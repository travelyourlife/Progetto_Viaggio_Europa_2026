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
    var user = firebase.auth().currentUser;
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
      }
    });
  } else {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        setTimeout(checkAndSendCuriosita, 5000);
      }
    });
  }

  // Esponi per debug
  window._checkCuriosita = checkAndSendCuriosita;
  window._getCuriositaForDay = getCuriositaForDay;
  window._getTripDay = getTripDay;

})();
