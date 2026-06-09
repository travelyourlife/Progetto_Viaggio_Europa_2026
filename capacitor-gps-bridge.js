/**
 * Capacitor GPS Bridge — Background Geolocation → Firebase
 * 
 * This script runs inside the WebView and uses the Capacitor background
 * geolocation plugin to track GPS in the background. It writes data to
 * Firebase using the same paths as the PWA's JavaScript tracking:
 * 
 *   - trips/{FAMILY_ID}/live/{uid}         → real-time position
 *   - trips/{FAMILY_ID}/tracks/{date}/points → track history (push)
 *   - trips/{FAMILY_ID}/liveSession/{uid}   → session state
 */

(function() {
  'use strict';

  // Only activate if Capacitor is available (native app, not browser)
  if (!window.Capacitor || !window.Capacitor.isNativePlatform()) return;

  var BackgroundGeolocation = null;
  var bgGeoActive = false;
  var bgTodayKm = 0;
  var bgLastLat = null;
  var bgLastLng = null;
  var bgStartTime = null;

  // Wait for Capacitor plugins to load
  document.addEventListener('DOMContentLoaded', function() {
    // The plugin is registered globally by Capacitor
    if (window.Capacitor.Plugins && window.Capacitor.Plugins.BackgroundGeolocation) {
      BackgroundGeolocation = window.Capacitor.Plugins.BackgroundGeolocation;
      console.log('[CapGPS] Background Geolocation plugin available');
      overrideTrackingButtons();
    } else {
      console.warn('[CapGPS] Background Geolocation plugin NOT available');
    }
  });

  function overrideTrackingButtons() {
    // Wait for the app to fully initialize and buttons to exist
    var checkInterval = setInterval(function() {
      var startBtn = document.getElementById('pos-live-start');
      var stopBtn = document.getElementById('pos-live-stop');
      if (startBtn && stopBtn) {
        clearInterval(checkInterval);
        hijackTracking(startBtn, stopBtn);
      }
    }, 500);

    // Timeout after 30 seconds
    setTimeout(function() { clearInterval(checkInterval); }, 30000);
  }

  function hijackTracking(startBtn, stopBtn) {
    // Clone buttons to remove existing event listeners
    var newStart = startBtn.cloneNode(true);
    var newStop = stopBtn.cloneNode(true);
    startBtn.parentNode.replaceChild(newStart, startBtn);
    stopBtn.parentNode.replaceChild(newStop, stopBtn);

    newStart.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      startBackgroundTracking();
    });

    newStop.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      stopBackgroundTracking();
    });

    // Also hijack the quick start/stop buttons
    setTimeout(function() {
      var quickStart = document.getElementById('pos-quick-start');
      var quickStop = document.getElementById('pos-quick-stop');
      if (quickStart) {
        quickStart.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          if (bgGeoActive) stopBackgroundTracking();
          else startBackgroundTracking();
        });
      }
    }, 2000);

    // Expose globally for the home card
    window._startLiveTracking = startBackgroundTracking;
    window._stopLiveTracking = stopBackgroundTracking;
    window._isLiveTrackingActive = function() { return bgGeoActive; };

    console.log('[CapGPS] Tracking buttons hijacked for native GPS');
  }

  function getFirebaseRefs() {
    // Access Firebase from the global scope (already initialized by app.js)
    var db = window.firebase && window.firebase.database ? window.firebase.database() : null;
    var user = window.firebase && window.firebase.auth ? window.firebase.auth().currentUser : null;
    var familyId = window.FAMILY_ID || (window._familyId); // exposed by app.js

    // Try to get FAMILY_ID from the app's scope
    if (!familyId) {
      var el = document.querySelector('[data-family-id]');
      if (el) familyId = el.getAttribute('data-family-id');
    }

    // Last resort: read from localStorage
    if (!familyId) {
      familyId = localStorage.getItem('quo_family_id');
    }

    if (!db || !user || !familyId) {
      console.warn('[CapGPS] Firebase not ready:', { db: !!db, user: !!user, familyId: familyId });
      return null;
    }

    return { db: db, uid: user.uid, familyId: familyId, name: user.displayName || 'Furgone' };
  }

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function haversineKm(lat1, lng1, lat2, lng2) {
    var R = 6371;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLng = (lng2 - lng1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function startBackgroundTracking() {
    if (bgGeoActive) return;

    var refs = getFirebaseRefs();
    if (!refs) {
      if (window.showToast) window.showToast('GPS: Firebase non pronto. Riprova.', 'error');
      return;
    }

    bgTodayKm = 0;
    bgLastLat = null;
    bgLastLng = null;
    bgStartTime = Date.now();

    // Save session to Firebase
    refs.db.ref('trips/' + refs.familyId + '/liveSession/' + refs.uid).set({
      active: true,
      startTime: bgStartTime,
      todayKm: 0,
      name: refs.name
    });

    // Start native background geolocation
    BackgroundGeolocation.addWatcher({
      backgroundMessage: 'Quo Vadis sta registrando il percorso',
      backgroundTitle: '🚐 Tracking attivo',
      requestPermissions: true,
      stale: false,
      distanceFilter: 20 // meters between updates
    }, function(location, error) {
      if (error) {
        if (error.code === 'NOT_AUTHORIZED') {
          if (window.confirm('Quo Vadis ha bisogno del permesso GPS in background. Aprire le impostazioni?')) {
            BackgroundGeolocation.openSettings();
          }
        }
        console.warn('[CapGPS] Error:', error);
        return;
      }

      if (!location) return;

      var lat = location.latitude;
      var lng = location.longitude;
      var speed = location.speed != null ? location.speed * 3.6 : 0; // m/s → km/h
      var heading = location.bearing || 0;
      var time = Date.now();

      // Calculate distance
      if (bgLastLat !== null && bgLastLng !== null) {
        var dist = haversineKm(bgLastLat, bgLastLng, lat, lng);
        if (dist > 0.005 && dist < 5) { // filter noise (5m-5km)
          bgTodayKm += dist;
        }
      }
      bgLastLat = lat;
      bgLastLng = lng;

      // Write to Firebase
      var currentRefs = getFirebaseRefs();
      if (!currentRefs) return;

      var basePath = 'trips/' + currentRefs.familyId;

      // 1. Live position
      currentRefs.db.ref(basePath + '/live/' + currentRefs.uid).set({
        lat: lat,
        lng: lng,
        speed: speed,
        heading: heading,
        time: time,
        name: currentRefs.name,
        status: 'moving'
      });

      // 2. Track point (push)
      var pt = { lat: lat, lng: lng, speed: speed, heading: heading, time: time };
      currentRefs.db.ref(basePath + '/tracks/' + todayStr() + '/points').push(pt);

      // 3. Update session km
      currentRefs.db.ref(basePath + '/liveSession/' + currentRefs.uid + '/todayKm').set(bgTodayKm);

      // 4. Update UI if visible
      updateUIStats(speed, bgTodayKm);

    }).then(function(watcherId) {
      window._bgWatcherId = watcherId;
      bgGeoActive = true;
      updateUIState(true);
      if (window.showToast) window.showToast('🚐 Tracking GPS avviato (background attivo)', 'success');
      console.log('[CapGPS] Watcher started, ID:', watcherId);
    });
  }

  function stopBackgroundTracking() {
    if (!bgGeoActive) return;

    if (window._bgWatcherId != null) {
      BackgroundGeolocation.removeWatcher({ id: window._bgWatcherId });
      window._bgWatcherId = null;
    }

    bgGeoActive = false;

    // Update Firebase session
    var refs = getFirebaseRefs();
    if (refs) {
      refs.db.ref('trips/' + refs.familyId + '/liveSession/' + refs.uid).set({
        active: false,
        stoppedAt: Date.now(),
        todayKm: bgTodayKm
      });
      refs.db.ref('trips/' + refs.familyId + '/live/' + refs.uid).update({
        status: 'stopped',
        speed: 0
      });
    }

    updateUIState(false);
    if (window.showToast) window.showToast('⏹️ Tracking fermato. ' + bgTodayKm.toFixed(1) + ' km registrati.', 'info');
    console.log('[CapGPS] Tracking stopped. Total km:', bgTodayKm.toFixed(1));
  }

  function updateUIState(active) {
    var startBtn = document.getElementById('pos-live-start');
    var stopBtn = document.getElementById('pos-live-stop');
    var statusBadge = document.getElementById('pos-live-status-badge');
    var liveDot = document.getElementById('pos-live-dot');

    if (startBtn) startBtn.style.display = active ? 'none' : '';
    if (stopBtn) stopBtn.style.display = active ? '' : 'none';
    if (statusBadge) {
      statusBadge.textContent = active ? '● LIVE' : '○ OFF';
      statusBadge.style.color = active ? '#4CAF50' : '#999';
    }
    if (liveDot) liveDot.style.display = active ? '' : 'none';
  }

  function updateUIStats(speed, km) {
    var statsDiv = document.getElementById('pos-live-stats');
    if (statsDiv && statsDiv.offsetParent !== null) {
      // Only update if visible
      var elapsed = Date.now() - bgStartTime;
      var h = Math.floor(elapsed / 3600000);
      var m = Math.floor((elapsed % 3600000) / 60000);
      var timeStr = h > 0 ? h + 'h ' + m + 'min' : m + 'min';
      statsDiv.innerHTML = '<b>' + km.toFixed(1) + ' km</b> · ' + 
                           Math.round(speed) + ' km/h · ' + timeStr;
    }
  }

  // Auto-resume on app restart
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      var refs = getFirebaseRefs();
      if (!refs) return;
      refs.db.ref('trips/' + refs.familyId + '/liveSession/' + refs.uid).once('value', function(snap) {
        var session = snap.val();
        if (session && session.active === true) {
          console.log('[CapGPS] Resuming tracking from previous session');
          bgTodayKm = session.todayKm || 0;
          bgStartTime = session.startTime || Date.now();
          startBackgroundTracking();
        }
      });
    }, 3000); // Wait for Firebase auth to complete
  });

})();
