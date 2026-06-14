// ═══════════════════════════════════════════════════════════════
// curiosita-scheduler.js — Rotazione automatica client-side v2.88
// v2.88: invia 3 curiosità al giorno in 3 fasce orarie
//        (mattino 09:00, pomeriggio 14:00, sera 19:00), incluso il
//        pre-partenza, fino al 18 agosto 2026 incluso. Ogni fascia è
//        tracciata separatamente per evitare duplicati, con rotazione
//        round-robin tra le 3 curiosità disponibili per il giorno.
// ═══════════════════════════════════════════════════════════════
(function() {
  'use strict';

  // Fasce orarie (ora locale del dispositivo). Una curiosità per fascia.
  // slot 0 = mattino, slot 1 = pomeriggio, slot 2 = sera.
  var SLOT_HOURS = [9, 14, 19];
  // Ultimo giorno (incluso) in cui inviare le curiosità: 18 agosto 2026.
  var CURIOSITA_END_DATE = '2026-08-18';
  // Compat: mantenuto per eventuali riferimenti esterni.
  var NOTIFICATION_HOUR = SLOT_HOURS[0];

  // Determina quale fascia è "attiva" in base all'ora corrente.
  // Restituisce l'indice della fascia più avanzata già raggiunta, o -1.
  function getCurrentSlot(now) {
    var h = now.getHours();
    var slot = -1;
    for (var i = 0; i < SLOT_HOURS.length; i++) {
      if (h >= SLOT_HOURS[i]) slot = i;
    }
    return slot;
  }

  // Calcola il giorno di viaggio corrente (negativo = pre-partenza)
  function getTripDay() {
    var now = new Date();
    var start = new Date(TRIP_START);
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    var diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    return diff;
  }

  // Filtra curiosità per il giorno corrente
  function getCuriositaForDay(day) {
    if (typeof CURIOSITA_DATA === 'undefined') return [];
    // v2.88: considera solo le voci nel formato standard (con .text),
    // escludendo eventuali voci legacy nel formato fact/factEn.
    return CURIOSITA_DATA.filter(function(c) {
      return c.day === day && typeof c.text === 'string' && c.text.length > 0;
    });
  }

  // Seleziona la prossima curiosità con rotazione round-robin
  function selectCuriosita(candidates, lastIndex) {
    if (!candidates || candidates.length === 0) return null;
    var idx = ((lastIndex || 0) + 1) % candidates.length;
    return { curiosita: candidates[idx], index: idx };
  }

  // Controlla e invia (chiamato all'apertura dell'app)
  // v2.88: invia fino a 3 curiosità al giorno, una per fascia oraria.
  // Recupera le fasce già scadute oggi ma non ancora inviate (es. l'app
  // viene aperta solo nel pomeriggio → invia mattino + pomeriggio).
  function checkAndSendCuriosita() {
    // Solo owner può inviare
    // v2.58: usa AuthManager.getUser() invece di firebase.auth().currentUser
    // per evitare race condition al cold start su Android WebView
    var user = (typeof AuthManager !== 'undefined' && AuthManager.isResolved())
      ? AuthManager.getUser()
      : (typeof firebase !== 'undefined' && firebase.auth ? firebase.auth().currentUser : null);
    if (!user) return;
    if (typeof OWNER_UIDS === 'undefined') return;
    if (OWNER_UIDS.indexOf(user.uid) === -1) return;

    var now = new Date();
    var today = now.toISOString().split('T')[0];

    // v2.88: non inviare più curiosità dopo il 18 agosto 2026 (incluso).
    if (today > CURIOSITA_END_DATE) return;

    // Quante fasce sono già scadute a quest'ora?
    var currentSlot = getCurrentSlot(now);
    if (currentSlot < 0) return; // prima delle 09:00, nulla da inviare

    // Determina il giorno
    var tripDay = getTripDay();

    // Trova curiosità per oggi (solo quelle nel formato standard con .text)
    var candidates = getCuriositaForDay(tripDay);
    if (candidates.length === 0) {
      // Fallback: prendi curiosità del giorno più vicino disponibile
      for (var offset = 1; offset <= 5; offset++) {
        candidates = getCuriositaForDay(tripDay - offset);
        if (candidates.length > 0) break;
        candidates = getCuriositaForDay(tripDay + offset);
        if (candidates.length > 0) break;
      }
    }
    if (candidates.length === 0) return;

    // Determina familyId
    var familyId = null;
    if (typeof FAMILY_ID !== 'undefined') {
      familyId = FAMILY_ID;
    } else if (typeof window._familyId !== 'undefined') {
      familyId = window._familyId;
    } else {
      familyId = 'iadicicco';
    }

    var db = firebase.database();
    var metaRef = db.ref('trips/' + familyId + '/notifications/curiositaMeta');
    metaRef.once('value').then(function(snap) {
      var meta = snap.val() || {};
      // Reset del tracking quando cambia giorno.
      var sentSlots = (meta.lastSentDate === today && meta.sentSlots) ? meta.sentSlots : {};

      var queueRef = db.ref('trips/' + familyId + '/notifications/queue');
      var sendChain = Promise.resolve();
      var anySent = false;

      // Invia tutte le fasce scadute (0..currentSlot) non ancora inviate oggi.
      for (var slot = 0; slot <= currentSlot; slot++) {
        (function(slotIdx) {
          if (sentSlots[slotIdx]) return; // fascia già inviata oggi
          // Ogni fascia mostra una curiosità diversa: slot 0→idx0, 1→idx1, 2→idx2
          var curio = candidates[slotIdx % candidates.length];
          if (!curio || !curio.text) return;
          sentSlots[slotIdx] = true;
          anySent = true;
          sendChain = sendChain.then(function() {
            return queueRef.push({
              type: 'curiosity',
              title: curio.emoji + ' Sapevi che...',
              body: curio.text,
              source: curio.source || '',
              slot: slotIdx,
              timestamp: firebase.database.ServerValue.TIMESTAMP,
              read: false
            }).then(function() {
              console.log('[Curiosità] Inviata fascia', slotIdx, '-', curio.text.substring(0, 40) + '...');
            });
          });
        })(slot);
      }

      if (!anySent) {
        console.log('[Curiosità] Tutte le fasce di oggi già inviate, skip.');
        return;
      }

      sendChain.then(function() {
        metaRef.update({
          lastSentDate: today,
          sentSlots: sentSlots,
          lastDay: tripDay
        });
      }).catch(function(err) {
        console.error('[Curiosità] Errore invio:', err);
      });
    }).catch(function(err) {
      console.error('[Curiosità] Errore lettura meta:', err);
    });
  }

  // Avvia il check dopo che l'auth è pronto
  // v2.88: oltre al check all'apertura, ricontrolla periodicamente mentre
  // l'app resta aperta, così le fasce delle 14:00 e 19:00 partono senza
  // bisogno di riaprire l'app (l'invio resta idempotente per fascia).
  var _curioInterval = null;
  function startCurioWatcher() {
    if (_curioInterval) return;
    _curioInterval = setInterval(checkAndSendCuriosita, 30 * 60 * 1000); // ogni 30 min
  }
  if (typeof AuthManager !== 'undefined') {
    AuthManager.subscribe(function(user) {
      if (user) {
        setTimeout(checkAndSendCuriosita, 5000);
        startCurioWatcher();
        // v2.59: also schedule evening photo recap
        setTimeout(checkAndSendEveningRecap, 8000);
      }
    });
  } else {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        setTimeout(checkAndSendCuriosita, 5000);
        startCurioWatcher();
        setTimeout(checkAndSendEveningRecap, 8000);
      }
    });
  }

  // ─── v2.59: Evening Photo Recap ────────────────────────────────
  // Sends a chat message at 21:00 with today's diary photos and km summary.
  // Only owner can send. Runs once per day.
  var RECAP_HOUR = 21;

  function checkAndSendEveningRecap() {
    var user = (typeof AuthManager !== 'undefined' && AuthManager.isResolved())
      ? AuthManager.getUser()
      : (typeof firebase !== 'undefined' && firebase.auth ? firebase.auth().currentUser : null);
    if (!user) return;
    if (typeof OWNER_UIDS === 'undefined' || OWNER_UIDS.indexOf(user.uid) === -1) return;

    var now = new Date();
    if (now.getHours() < RECAP_HOUR) return;

    var tripDay = getTripDay();
    if (tripDay < 0) return; // pre-trip

    var familyId = (typeof FAMILY_ID !== 'undefined') ? FAMILY_ID : 'iadicicco';
    var today = now.toISOString().split('T')[0];
    var db = firebase.database();

    // Check if already sent today
    var recapMetaRef = db.ref('trips/' + familyId + '/notifications/eveningRecapMeta');
    recapMetaRef.once('value').then(function(snap) {
      var meta = snap.val() || {};
      if (meta.lastSentDate === today) return; // already sent

      // Load today's diary entry
      var dayKey = 'day-' + tripDay;
      db.ref('trips/' + familyId + '/diary').orderByKey().startAt(dayKey).limitToFirst(5)
        .once('value').then(function(diarySnap) {
          var entries = diarySnap.val() || {};
          var photos = [];
          var textSnippet = '';

          Object.values(entries).forEach(function(entry) {
            if (!entry) return;
            // Collect up to 3 photos
            if (entry.photos) {
              Object.values(entry.photos).forEach(function(p) {
                if (p && p.url && photos.length < 3) photos.push(p.url);
              });
            }
            // Get first text entry
            if (!textSnippet && entry.text) {
              textSnippet = entry.text.substring(0, 120) + (entry.text.length > 120 ? '...' : '');
            }
          });

          // Load today's km from dailySummaries
          db.ref('trips/' + familyId + '/dailySummaries/' + today)
            .once('value').then(function(sumSnap) {
              var summary = sumSnap.val() || {};
              var km = summary.km ? summary.km.toFixed(0) : '—';

              // Build chat message
              var g = 'G' + tripDay;
              var cityName = (typeof TRIP_COORDS !== 'undefined' && TRIP_COORDS[tripDay])
                ? TRIP_COORDS[tripDay].city : '';

              var msgParts = ['📸 *Riepilogo serale — ' + g + (cityName ? ' · ' + cityName : '') + '*'];
              if (km !== '—') msgParts.push('🚐 ' + km + ' km percorsi oggi');
              if (textSnippet) msgParts.push('📝 ' + textSnippet);
              if (photos.length > 0) msgParts.push('🖼️ ' + photos.length + ' foto nel diario');

              var msgText = msgParts.join('\n');

              // Push to chat
              var chatRef = db.ref('chat/' + familyId);
              var chatMsg = {
                uid: user.uid,
                displayName: user.displayName || 'Owner',
                text: msgText,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                type: 'evening_recap',
                photos: photos.length > 0 ? photos : null
              };

              chatRef.push(chatMsg).then(function() {
                recapMetaRef.update({ lastSentDate: today, tripDay: tripDay });
                console.log('[EveningRecap] Sent for day', tripDay);
              }).catch(function(err) {
                console.error('[EveningRecap] Send error:', err);
              });
            });
        });
    }).catch(function(err) {
      console.error('[EveningRecap] Meta read error:', err);
    });
  }

  window._checkEveningRecap = checkAndSendEveningRecap;

  // Esponi per debug
  window._checkCuriosita = checkAndSendCuriosita;
  window._getCuriositaForDay = getCuriositaForDay;
  window._getTripDay = getTripDay;

})();

// ─── v2.72: Notifica Buongiorno giornaliera ─────────────────────────────────
// Inviata dal client (ha accesso diretto all'itinerario locale)
// alla prima apertura dell'app ogni mattina durante il viaggio
(function() {
  var BUONGIORNO_KEY = 'qv-buongiorno-sent';

  function sendBuongiorno() {
    try {
      if (typeof TRIP_START === 'undefined' || typeof itinerario === 'undefined') return;
      if (typeof firebase === 'undefined' || !firebase.database) return;

      var user = (typeof AuthManager !== 'undefined' && AuthManager.isResolved())
        ? AuthManager.getUser() : null;
      if (!user) return;

      var today = new Date(); today.setHours(0,0,0,0);
      var tripStart = new Date(TRIP_START); tripStart.setHours(0,0,0,0);
      var dayIdx = Math.floor((today - tripStart) / 86400000);
      var totalDays = typeof TRIP_DAYS !== 'undefined' ? TRIP_DAYS : 55;

      // Solo durante il viaggio
      if (dayIdx < 0 || dayIdx >= totalDays) return;

      // Controlla se già inviata oggi
      var todayStr = today.toISOString().split('T')[0];
      var lastSent = localStorage.getItem(BUONGIORNO_KEY);
      if (lastSent === todayStr) return;

      // Leggi i dati del giorno dall'itinerario locale
      var dayData = itinerario[dayIdx];
      var dest = dayData ? (dayData.tragitto || dayData.title || '') : '';
      var km   = dayData ? (dayData.km || 0) : 0;

      var title = '\uD83C\uDF05 Buongiorno! Giorno ' + (dayIdx + 1) + '/' + totalDays;
      var body  = dest + (km > 0 ? ' \u00B7 ' + km + ' km' : ' \u00B7 Giorno di sosta');

      // Aggiungi meteo se disponibile in weatherLog Firebase
      var familyId = (typeof FAMILY_ID !== 'undefined') ? FAMILY_ID : 'viaggio-europa-2026';
      firebase.database().ref('trips/' + familyId + '/weatherLog/' + todayStr).once('value', function(snap) {
        var meteo = snap.val();
        if (meteo && meteo.tempMax) {
          body += ' \u00B7 ' + meteo.tempMax + '\u00B0/' + meteo.tempMin + '\u00B0C';
        }

        // Accoda la notifica
        firebase.database().ref('trips/' + familyId + '/notifications/queue').push({
          type: 'buongiorno', title: title, body: body,
          target: 'family', url: './#tab-giorni',
          tag: 'buongiorno', createdAt: Date.now(), sent: false
        }).then(function() {
          localStorage.setItem(BUONGIORNO_KEY, todayStr);
          console.warn('[Buongiorno] Inviata per G' + dayIdx + ': ' + body);
        }).catch(function(e) {
          console.warn('[Buongiorno] Invio fallito:', e.message);
        });
      });
    } catch(e) {
      console.warn('[Buongiorno] Errore:', e.message);
    }
  }

  // Invia alla prima apertura dopo le 07:30
  function maybeSendBuongiorno() {
    var now = new Date();
    if (now.getHours() >= 7 && (now.getHours() > 7 || now.getMinutes() >= 30)) {
      sendBuongiorno();
    }
  }

  // Attendi che Auth sia pronta
  if (typeof AuthManager !== 'undefined') {
    AuthManager.subscribe(function(user) {
      if (user) maybeSendBuongiorno();
    });
  } else {
    window.addEventListener('authStateChanged', function(e) {
      if (e.detail && e.detail.user) maybeSendBuongiorno();
    });
  }
})();
