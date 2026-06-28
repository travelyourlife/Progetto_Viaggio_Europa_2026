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

  // v3.95 FIX: Use global window.localDateStr (defined in app.js) — single source of truth.
  // Fallback only if app.js hasn't loaded yet (should never happen).
  function localDateStr(d) {
    if (window.localDateStr) return window.localDateStr(d);
    var x = d ? new Date(d) : new Date();
    return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
  }

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

  // v3.95 FIX: Use global getCurrentTripDay (defined in app.js) — single source of truth.
  // Respects _dayOverride and clamps to valid range.
  function getTripDay() {
    if (typeof window.getCurrentTripDay === 'function') return window.getCurrentTripDay();
    // Fallback with clamp (race condition: curiosita-scheduler loads before app.js globals)
    var now = new Date();
    var start = new Date(TRIP_START);
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    var diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    var maxDay = (typeof TRIP_DAYS !== 'undefined') ? TRIP_DAYS - 1 : 54;
    return Math.max(-1, Math.min(diff, maxDay));
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
    var today = localDateStr(now); // v2.96: LOCAL (era UTC)

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
    var queueRef = db.ref('trips/' + familyId + '/notifications/queue');

    // v2.94: dedup STRUTTURALE basato sul contenuto.
    // Leggiamo le curiosità già presenti in coda e non re-inviamo mai un testo già inviato.
    // Questo elimina i duplicati indipendentemente da come/quando è stato aperto l'app.
    Promise.all([
      metaRef.once('value'),
      queueRef.orderByChild('type').equalTo('curiosity').once('value')
    ]).then(function(results) {
      var meta = results[0].val() || {};
      var sentTexts = {};
      results[1].forEach(function(child) {
        var v = child.val() || {};
        if (v.body) sentTexts[v.body] = true;
      });

      // v2.97 FIX (race condition → notifiche doppie):
      // Prima si leggeva sentSlots e si aggiornava metaRef SOLO alla fine della
      // catena di invio. Due esecuzioni concorrenti di checkAndSendCuriosita
      // (apertura app + setInterval 30min + riapertura) leggevano entrambe lo
      // stato PRIMA che l'altra scrivesse → stessa fascia inviata due volte.
      // Soluzione: reclamare ogni fascia in modo ATOMICO con una transaction su
      // curiositaMeta. Solo l'esecuzione che "vince" la transaction invia.

      // Costruiamo l'elenco delle fasce candidate (0..currentSlot) con la relativa
      // curiosità, saltando quelle il cui testo è già stato inviato (dedup contenuto).
      var slotsToSend = [];
      for (var slot = 0; slot <= currentSlot; slot++) {
        var curio = candidates[slot % candidates.length];
        if (!curio || !curio.text) continue;
        if (sentTexts[curio.text]) continue; // testo già inviato in passato → salta
        slotsToSend.push({ slot: slot, curio: curio });
      }

      if (slotsToSend.length === 0) {
        console.log('[Curiosità] Nessuna nuova curiosità da inviare (fasce coperte o già inviate), skip.');
        return;
      }

      // Reclama UNA fascia per volta in modo atomico, poi invia solo se vinta.
      function claimAndSend(i) {
        if (i >= slotsToSend.length) return Promise.resolve();
        var slotIdx = slotsToSend[i].slot;
        var curio = slotsToSend[i].curio;

        return metaRef.transaction(function(current) {
          current = current || {};
          // Nuovo giorno → azzera lo stato delle fasce.
          if (current.lastSentDate !== today) {
            current = { lastSentDate: today, sentSlots: {}, lastDay: tripDay };
          }
          var slots = current.sentSlots || {};
          if (slots[slotIdx]) {
            // Fascia già reclamata da un'altra esecuzione → ABORT (non sovrascrivere).
            return; // undefined = abort transaction
          }
          slots[slotIdx] = true;
          current.sentSlots = slots;
          current.lastDay = tripDay;
          return current;
        }).then(function(result) {
          if (!result.committed) {
            // Persa la corsa (un'altra esecuzione ha reclamato la fascia): non inviare.
            console.log('[Curiosità] Fascia', slotIdx, 'già reclamata, skip (race evitata).');
            return claimAndSend(i + 1);
          }
          // Vinta la fascia → invia in coda.
          return queueRef.push({
            type: 'curiosity',
            title: curio.emoji + ' Sapevi che...',
            body: curio.text,
            source: curio.source || '',
            slot: slotIdx,
            tripDay: tripDay,
            dateKey: today,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            createdAt: Date.now(),
            read: false
          }).then(function() {
            console.log('[Curiosità] Inviata fascia', slotIdx, '(G' + tripDay + ') -', curio.text.substring(0, 40) + '...');
            return claimAndSend(i + 1);
          });
        });
      }

      claimAndSend(0).catch(function(err) {
        console.error('[Curiosità] Errore invio:', err);
      });
    }).catch(function(err) {
      console.error('[Curiosità] Errore lettura meta/coda:', err);
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
  // v3.06: Curiosità scheduling moved to server-side (curiositaDispatcher Cloud Function).
  // When QV_CURIOSITA_SERVER_SIDE is true, skip client-side curiosità sending.
  // Evening recap and buongiorno remain client-side (they need local data access).
  // v3.95 FIX: AuthManager is always available (defined in app.js before this script loads).
  // Removed dead fallback branch that duplicated the same logic via firebase.auth().onAuthStateChanged.
  AuthManager.subscribe(function(user) {
    if (user) {
      if (!window.QV_CURIOSITA_SERVER_SIDE) {
        setTimeout(checkAndSendCuriosita, 5000);
        startCurioWatcher();
      }
      // v2.59: evening photo recap (always client-side)
      setTimeout(checkAndSendEveningRecap, 8000);
    }
  });

  // ─── v4.08: Enhanced Evening Photo Recap ────────────────────────────────
  // Sends a rich chat message at 23:00 with today's diary posts, weather,
  // drive time, steps, and photos. Only owner can send. Runs once per day.
  var RECAP_HOUR = 23;

  // WMO weather code to emoji (client-side helper)
  function _recapWmoEmoji(code) {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 57) return '🌦️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '❄️';
    if (code <= 82) return '🌧️';
    return '⛈️';
  }

  function _recapFormatTime(ms) {
    var s = Math.floor(ms / 1000);
    var h = Math.floor(s / 3600); var m = Math.floor((s % 3600) / 60);
    return h + 'h ' + (m < 10 ? '0' : '') + m + 'min';
  }

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
    var today = localDateStr(now);
    var db = firebase.database();

    // Atomic claim to prevent duplicate recaps
    var recapMetaRef = db.ref('trips/' + familyId + '/notifications/eveningRecapMeta');
    recapMetaRef.transaction(function(current) {
      current = current || {};
      if (current.lastSentDate === today) return; // already sent → abort
      current.lastSentDate = today;
      current.tripDay = tripDay;
      return current;
    }).then(function(result) {
      if (!result.committed) {
        console.log('[EveningRecap] Già inviato oggi o reclamato da altra esecuzione, skip.');
        return;
      }

      // Load today's diary entries
      var dayKey = 'day-' + tripDay + '-';
      var diaryPromise = db.ref('trips/' + familyId + '/diary').orderByKey()
        .startAt(dayKey).endAt(dayKey + '\uf8ff').limitToFirst(20)
        .once('value');

      // Load dailySummaries (km, time)
      var summaryPromise = db.ref('trips/' + familyId + '/dailySummaries/' + today).once('value');

      // Load currentLocation (city, country, flag)
      var locationPromise = db.ref('trips/' + familyId + '/currentLocation').once('value');

      // Load weather for today
      var weatherPromise = db.ref('trips/' + familyId + '/weatherLog/' + today).once('value');

      // Load activities (steps for today)
      var activitiesPromise = db.ref('trips/' + familyId + '/activities').once('value');

      Promise.all([diaryPromise, summaryPromise, locationPromise, weatherPromise, activitiesPromise])
        .then(function(results) {
          var diarySnap = results[0];
          var sumSnap = results[1];
          var clSnap = results[2];
          var weatherSnap = results[3];
          var actSnap = results[4];

          // ─── Parse diary entries ───
          var entriesRaw = diarySnap.val() || {};
          var entries = {};
          Object.keys(entriesRaw).forEach(function(k) {
            if (k.indexOf(dayKey) === 0) entries[k] = entriesRaw[k];
          });
          var photos = [];
          var textPosts = []; // all text posts
          var highlight = '';

          Object.values(entries).forEach(function(entry) {
            if (!entry) return;
            // Collect photos (max 5)
            if (entry.photos) {
              Object.values(entry.photos).forEach(function(p) {
                if (p && p.url && photos.length < 5) photos.push(p.url);
              });
            }
            // Collect all text posts
            if (entry.text) {
              var snippet = entry.text.substring(0, 120) + (entry.text.length > 120 ? '…' : '');
              textPosts.push(snippet);
            }
            // Get highlight
            if (!highlight && entry.highlight) {
              highlight = entry.highlight;
            }
          });

          // ─── Parse summary (km + drive time) ───
          var summary = sumSnap.val() || {};
          var km = summary.km ? summary.km.toFixed(0) : '';
          var driveTime = summary.time ? _recapFormatTime(summary.time) : '';

          // ─── Parse location ───
          var cl = clSnap.val();
          var cityName = '';
          var flag = '';
          if (cl && cl.updatedAt && (Date.now() - cl.updatedAt < 24 * 3600000)) {
            cityName = cl.city || '';
            flag = cl.flag || '';
          }
          if (!cityName && typeof TRIP_COORDS !== 'undefined' && TRIP_COORDS[tripDay]) {
            cityName = TRIP_COORDS[tripDay].city || '';
          }

          // ─── Parse weather ───
          var weather = weatherSnap.val();
          var weatherStr = '';
          if (weather && weather.tempMax !== undefined) {
            weatherStr = _recapWmoEmoji(weather.weatherCode) + ' ' + weather.tempMax + '°/' + weather.tempMin + '°';
          }

          // ─── Parse steps (today only) ───
          var todaySteps = 0;
          var todayWalkKm = 0;
          var activities = actSnap.val() || {};
          Object.values(activities).forEach(function(act) {
            if (!act || act.type !== 'daily_walk') return;
            if (act.date === today) {
              todaySteps += (parseInt(act.steps) || 0);
              todayWalkKm += (parseFloat(act.distance) || 0);
            }
          });

          // ─── Build chat message ───
          var g = 'G' + (tripDay + 1);
          var appUrl = 'https://viaggio-europa-2026.web.app/';
          var msgParts = [];

          // Header: 📸 *Riepilogo serale — G3 · Marki* 🇵🇱
          var header = '📸 *Riepilogo serale — ' + g;
          if (cityName) header += ' · ' + cityName;
          header += '*';
          if (flag) header += ' ' + flag;
          msgParts.push(header);
          msgParts.push(''); // blank line

          // Driving stats: 🚐 874 km · ⏱️ 8h 12min
          if (km) {
            var driveLine = '🚐 ' + km + ' km percorsi';
            if (driveTime) driveLine += ' · ⏱️ ' + driveTime;
            msgParts.push(driveLine);
          }

          // Weather: ☀️ 24°/16°
          if (weatherStr) {
            msgParts.push(weatherStr);
          }

          // Steps: 👣 12.500 passi (8.7 km)
          if (todaySteps > 0) {
            var stepsLine = '👣 ' + todaySteps.toLocaleString('it-IT') + ' passi';
            if (todayWalkKm > 0) stepsLine += ' (' + todayWalkKm.toFixed(1) + ' km)';
            msgParts.push(stepsLine);
          }

          // Separator before posts
          if (textPosts.length > 0 || highlight) {
            msgParts.push(''); // blank line
          }

          // All diary posts (each with snippet + link)
          textPosts.forEach(function(snippet, idx) {
            msgParts.push('📝 ' + snippet);
          });

          // Deep link to diary
          if (textPosts.length > 0) {
            msgParts.push('→ ' + appUrl + '#tab-diario');
          }

          // Highlight: ⭐ momento top
          if (highlight) {
            msgParts.push('');
            msgParts.push('⭐ ' + highlight);
          }

          // Photos count
          if (photos.length > 0) {
            msgParts.push('');
            msgParts.push('🖼️ ' + photos.length + ' foto nel diario');
          }

          var msgText = msgParts.join('\n');

          // Push to chat
          var chatRef = db.ref('chat/' + familyId);
          var chatMsg = {
            uid: user.uid,
            displayName: user.displayName || 'Owner',
            text: msgText,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            type: 'evening_recap',
            photos: photos.length > 0 ? photos.slice(0, 3) : null
          };

          chatRef.push(chatMsg).then(function() {
            console.log('[EveningRecap] Sent for day', tripDay);
          }).catch(function(err) {
            console.error('[EveningRecap] Send error:', err);
            // Rollback claim so a retry can re-send
            recapMetaRef.transaction(function(cur) {
              if (cur && cur.lastSentDate === today) { cur.lastSentDate = null; return cur; }
              return cur;
            });
          });
        }); // end Promise.all .then()
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

      // Controlla se già inviata oggi (cache locale veloce)
      var todayStr = localDateStr(today); // v2.96: LOCAL (era UTC)
      var lastSent = localStorage.getItem(BUONGIORNO_KEY);
      if (lastSent === todayStr) return;

      // Leggi i dati del giorno dall'itinerario locale
      var dayData = itinerario[dayIdx];
      var dest = dayData ? (dayData.tragitto || dayData.title || '') : '';
      var km   = dayData ? (dayData.km || 0) : 0;

      var title = '\uD83C\uDF05 Buongiorno! Giorno ' + (dayIdx + 1) + '/' + totalDays;
      var body  = dest + (km > 0 ? ' \u00B7 ' + km + ' km' : ' \u00B7 Giorno di sosta');

      var familyId = (typeof FAMILY_ID !== 'undefined') ? FAMILY_ID : 'viaggio-europa-2026';

      // v2.97 FIX: claim atomico SU FIREBASE prima di inviare. Il solo localStorage
      // è per-dispositivo e veniva scritto dopo il push → due dispositivi owner (o due
      // chiamate ravvicinate) potevano inviare due "Buongiorno". La transaction su
      // buongiornoMeta garantisce un solo invio al giorno per tutto il viaggio.
      var bgMetaRef = firebase.database().ref('trips/' + familyId + '/notifications/buongiornoMeta');
      bgMetaRef.transaction(function(current) {
        current = current || {};
        if (current.lastSentDate === todayStr) return; // già inviato oggi → abort
        current.lastSentDate = todayStr;
        current.dayIdx = dayIdx;
        return current;
      }).then(function(result) {
        if (!result.committed) {
          localStorage.setItem(BUONGIORNO_KEY, todayStr); // allinea la cache locale
          console.warn('[Buongiorno] Già inviato oggi (altro dispositivo/esecuzione), skip.');
          return;
        }
        // Vinto il claim → leggi meteo e accoda.
        firebase.database().ref('trips/' + familyId + '/weatherLog/' + todayStr).once('value', function(snap) {
          var meteo = snap.val();
          if (meteo && meteo.tempMax) {
            body += ' \u00B7 ' + meteo.tempMax + '\u00B0/' + meteo.tempMin + '\u00B0C';
          }
          firebase.database().ref('trips/' + familyId + '/notifications/queue').push({
            type: 'buongiorno', title: title, body: body,
            target: 'owner', url: './#tab-giorni',
            tag: 'buongiorno', createdAt: Date.now(), sent: false
          }).then(function() {
            localStorage.setItem(BUONGIORNO_KEY, todayStr);
            console.warn('[Buongiorno] Inviata per G' + dayIdx + ': ' + body);
          }).catch(function(e) {
            console.warn('[Buongiorno] Invio fallito:', e.message);
            // Rollback del claim per consentire un retry.
            bgMetaRef.transaction(function(cur) {
              if (cur && cur.lastSentDate === todayStr) { cur.lastSentDate = null; return cur; }
              return cur;
            });
          });
        });
      }).catch(function(e) {
        console.warn('[Buongiorno] Claim fallito:', e.message);
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

  // v3.95 FIX: AuthManager is always available. Removed dead fallback.
  AuthManager.subscribe(function(user) {
    if (user) maybeSendBuongiorno();
  });
})();
