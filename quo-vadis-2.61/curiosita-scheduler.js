// ═══════════════════════════════════════════════════════════════
// curiosita-scheduler.js — Rotazione automatica client-side v2.56
// Invia una curiosità al giorno (dopo le 9:00) con round-robin
// ═══════════════════════════════════════════════════════════════
(function() {
  'use strict';

  var NOTIFICATION_HOUR = 9;

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
    return CURIOSITA_DATA.filter(function(c) { return c.day === day; });
  }

  // Seleziona la prossima curiosità con rotazione round-robin
  function selectCuriosita(candidates, lastIndex) {
    if (!candidates || candidates.length === 0) return null;
    var idx = ((lastIndex || 0) + 1) % candidates.length;
    return { curiosita: candidates[idx], index: idx };
  }

  // Controlla e invia (chiamato all'apertura dell'app)
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

    // Controlla l'ora (solo dopo le 9:00)
    var now = new Date();
    if (now.getHours() < NOTIFICATION_HOUR) return;

    // Determina il giorno
    var tripDay = getTripDay();

    // Trova curiosità per oggi
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

    // Controlla se già inviata oggi
    var db = firebase.database();
    var metaRef = db.ref('trips/' + familyId + '/notifications/curiositaMeta');
    metaRef.once('value').then(function(snap) {
      var meta = snap.val() || {};
      var today = now.toISOString().split('T')[0];

      if (meta.lastSentDate === today) {
        console.log('[Curiosità] Già inviata oggi, skip.');
        return;
      }

      // Seleziona con rotazione
      var result = selectCuriosita(candidates, meta.lastIndex || -1);
      if (!result || !result.curiosita) return;

      // Invia come notifica Firebase
      var queueRef = db.ref('trips/' + familyId + '/notifications/queue');
      var notification = {
        type: 'curiosity',
        title: result.curiosita.emoji + ' Sapevi che...',
        body: result.curiosita.text,
        source: result.curiosita.source || '',
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        read: false
      };

      queueRef.push(notification).then(function() {
        console.log('[Curiosità] Inviata:', result.curiosita.text.substring(0, 50) + '...');
        // Salva il marker per oggi
        metaRef.update({
          lastSentDate: today,
          lastIndex: result.index,
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
  if (typeof AuthManager !== 'undefined') {
    AuthManager.subscribe(function(user) {
      if (user) {
        setTimeout(checkAndSendCuriosita, 5000);
        // v2.59: also schedule evening photo recap
        setTimeout(checkAndSendEveningRecap, 8000);
      }
    });
  } else {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        setTimeout(checkAndSendCuriosita, 5000);
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
