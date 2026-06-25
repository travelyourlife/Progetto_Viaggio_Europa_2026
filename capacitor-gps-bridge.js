/**
 * Capacitor GPS Bridge — Background Geolocation → Firebase
 * v2.34: Refactored with Event Delegation (no more cloneNode timing issues)
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

  // ─── v2.46: Android Back Button Handler ───
  // Intercepts hardware back button: closes menu/modal if open,
  // navigates to Home if on another tab, or minimizes app if already on Home.
  (function initBackButton() {
    var AppPlugin = window.Capacitor.Plugins && window.Capacitor.Plugins.App;
    if (!AppPlugin) {
      // Retry after plugins load
      setTimeout(initBackButton, 500);
      return;
    }
    AppPlugin.addListener('backButton', function(ev) {
      // 1. Close side menu if open
      var sideMenu = document.getElementById('sideMenu');
      if (sideMenu && sideMenu.classList.contains('open')) {
        sideMenu.classList.remove('open');
        var overlay = document.getElementById('menuOverlay');
        if (overlay) overlay.classList.remove('active');
        return;
      }
      // 2. Close any open modal
      var modal = document.querySelector('.modal-overlay.active, .modal.active, .confirm-overlay.active');
      if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        return;
      }
      // 3. Close bottom sheet if open
      var bottomSheet = document.querySelector('.bottom-sheet.open');
      if (bottomSheet) {
        bottomSheet.classList.remove('open');
        return;
      }
      // 4. If not on Home tab, navigate to Home
      var activeSection = document.querySelector('.tab-content.active');
      if (activeSection && activeSection.id !== 'tab-home') {
        if (typeof window.switchTab === 'function') {
          window.switchTab('home');
        }
        return;
      }
      // 5. Already on Home — minimize app (don't exit)
      AppPlugin.minimizeApp();
    });
    console.info('[Capacitor] Back button handler registered');
  })();

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
    } else {
      console.warn('[CapGPS] Background Geolocation plugin NOT available');
    }
  });

  // v2.34: EVENT DELEGATION — intercepts clicks on tracking buttons regardless of timing
  // This replaces the fragile cloneNode approach that lost event listeners
  document.addEventListener('click', function(e) {
    if (!BackgroundGeolocation) return;

    var target = e.target.closest('#pos-live-start, #pos-live-start-quick, [data-action="start-tracking"]');
    if (target) {
      e.preventDefault();
      e.stopPropagation();
      startBackgroundTracking();
      return;
    }

    var stopTarget = e.target.closest('#pos-live-stop, #pos-live-stop-quick, [data-action="stop-tracking"]');
    if (stopTarget) {
      e.preventDefault();
      e.stopPropagation();
      stopBackgroundTracking();
      return;
    }

    // Quick toggle button (single button that starts/stops)
    var quickToggle = e.target.closest('#pos-quick-start, #pos-quick-stop');
    if (quickToggle) {
      e.preventDefault();
      e.stopPropagation();
      if (bgGeoActive) stopBackgroundTracking();
      else startBackgroundTracking();
      return;
    }
  }, true); // capture phase to intercept before other handlers

  // Expose globally for home card and other components
  window._startLiveTracking = function() { startBackgroundTracking(); };
  window._stopLiveTracking = function() { stopBackgroundTracking(); };
  window._isLiveTrackingActive = function() { return bgGeoActive; };

  function getFirebaseRefs() {
    // Access Firebase from the global scope (already initialized by app.js)
    var db = window.firebase && window.firebase.database ? window.firebase.database() : null;
    // v2.58 FIX: prefer window.firebaseUser (set by checkOwnerStatus/onAuthStateChanged)
    // over firebase.auth().currentUser which can be null during Capacitor cold-start
    var user = window.firebaseUser ||
               (window.AuthManager && window.AuthManager.isResolved() ? window.AuthManager.getUser() : null) ||
               (window.firebase && window.firebase.auth ? window.firebase.auth().currentUser : null);
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

  // v2.58: delegates to window._haversineKm (data.js) — single canonical implementation
  function haversineKm(lat1, lng1, lat2, lng2) {
    if (window._haversineKm) return window._haversineKm(lat1, lng1, lat2, lng2);
    // Fallback (should not be needed if data.js loaded first)
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
    if (!BackgroundGeolocation) {
      if (window.showToast) window.showToast('GPS: Plugin non disponibile', 'error');
      return;
    }

    var refs = getFirebaseRefs();
    if (!refs) {
      // v2.34: If auth not ready yet, wait and retry once
      if (typeof window.waitForAuth === 'function') {
        window.waitForAuth(3000).then(function() {
          var retryRefs = getFirebaseRefs();
          if (retryRefs) {
            doStartTracking(retryRefs);
          } else {
            if (window.showToast) window.showToast('GPS: Firebase non pronto. Riprova.', 'error');
          }
        });
        return;
      }
      if (window.showToast) window.showToast('GPS: Firebase non pronto. Riprova.', 'error');
      return;
    }

    doStartTracking(refs);
  }

  function doStartTracking(refs) {
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

      // v2.45 FIX: Buffer & Flush strategy
      // Instead of writing to Firebase on every GPS update (~100/min at highway speed),
      // buffer track points locally and flush every 60 seconds.
      // Only live position is written immediately (for real-time map display).

      // 1. Live position — write immediately (debounced at 5s minimum interval)
      var currentRefs = getFirebaseRefs();
      if (!currentRefs) return;

      var basePath = 'trips/' + currentRefs.familyId;
      var now = Date.now();

      if (!window._lastLiveWrite || (now - window._lastLiveWrite) >= 15000) {
        window._lastLiveWrite = now;
        currentRefs.db.ref(basePath + '/live/' + currentRefs.uid).set({
          lat: lat,
          lng: lng,
          speed: speed,
          heading: heading,
          time: time,
          name: currentRefs.name,
          status: speed > 3 ? 'moving' : 'stopped', // v3.66 FIX: was always 'moving'
          todayKm: bgTodayKm, // v3.66 FIX: was missing — family members couldn't see km
          startTime: bgStartTime
        });
        // v2.98: persist last known position so the family map keeps showing
        // the van after tracking stops (lastPosition survives live/ cleanup)
        currentRefs.db.ref(basePath + '/lastPosition').set({
          lat: lat, lng: lng, heading: heading, ts: time, name: currentRefs.name
        }).catch(function(e) { console.warn('[CapGPS] lastPosition write failed:', e.message); });

        // v3.89: Update current country via Nominatim (max once every 10 min)
        if (!window._lastCountryCheck || (now - window._lastCountryCheck) >= 600000) {
          window._lastCountryCheck = now;
          (function(refPath, cLat, cLng) {
            fetch('https://nominatim.openstreetmap.org/reverse?lat=' + cLat + '&lon=' + cLng + '&format=json&zoom=3', {
              headers: { 'User-Agent': 'QuoVadis-TripApp/3.89' }
            }).then(function(r) { return r.json(); }).then(function(data) {
              if (data && data.address && data.address.country_code) {
                var cc = data.address.country_code.toUpperCase();
                var nameMap = { 'IT':'Italia','AT':'Austria','DE':'Germania','CH':'Svizzera','FR':'Francia','ES':'Spagna','PT':'Portogallo','BE':'Belgio','NL':'Paesi Bassi','LU':'Lussemburgo','HR':'Croazia','SI':'Slovenia','CZ':'Rep. Ceca','PL':'Polonia','HU':'Ungheria','SK':'Slovacchia','DK':'Danimarca','SE':'Svezia','NO':'Norvegia','FI':'Finlandia','EE':'Estonia','LV':'Lettonia','LT':'Lituania' };
                var name = nameMap[cc] || data.address.country || cc;
                currentRefs.db.ref(refPath + '/currentCountry').set({ code: cc, name: name });
              }
            }).catch(function() { /* silent */ });
          })(basePath, lat, lng);
        }
      }

      // 2. Buffer track point locally
      if (!window._gpsTrackBuffer) window._gpsTrackBuffer = [];
      window._gpsTrackBuffer.push({ lat: lat, lng: lng, speed: speed, heading: heading, time: time });

      // 3. Flush buffer every 60 seconds
      if (!window._gpsFlushInterval) {
        window._gpsFlushInterval = setInterval(function() {
          var buffer = window._gpsTrackBuffer;
          if (!buffer || buffer.length === 0) return;
          var flushRefs = getFirebaseRefs();
          if (!flushRefs) return;
          var flushPath = 'trips/' + flushRefs.familyId + '/tracks/' + todayStr() + '/points';
          // Multi-path update: push all buffered points in a single write
          var updates = {};
          for (var i = 0; i < buffer.length; i++) {
            var key = flushRefs.db.ref(flushPath).push().key;
            updates[key] = buffer[i];
          }
          flushRefs.db.ref(flushPath).update(updates)
            .catch(function(e) { console.warn('[CapGPS] Flush track failed:', e.message); });
          // Update session km once per flush
          flushRefs.db.ref('trips/' + flushRefs.familyId + '/liveSession/' + flushRefs.uid + '/todayKm').set(bgTodayKm)
            .catch(function(e) { console.warn('[CapGPS] Flush km failed:', e.message); });
          // v2.98: refresh lastPosition on every flush so the family map stays accurate
          if (bgLastLat !== null && bgLastLng !== null) {
            flushRefs.db.ref('trips/' + flushRefs.familyId + '/lastPosition').set({
              lat: bgLastLat, lng: bgLastLng, heading: 0, ts: Date.now(), name: flushRefs.name
            }).catch(function(e) { console.warn('[CapGPS] Flush lastPosition failed:', e.message); });
          }
          window._gpsTrackBuffer = [];
          console.log('[CapGPS] Flushed ' + buffer.length + ' track points');
        }, 60000); // 60 seconds (v2.48: was 30s, reduced writes by 50%)
      }

      // 4. Update UI if visible
      updateUIStats(speed, bgTodayKm);
      // v2.58: notify app.js of new position so it can update km display and idle timer
      window.dispatchEvent(new CustomEvent('capgpsPositionUpdate', {
        detail: { lat: lat, lng: lng, speed: speed, km: bgTodayKm }
      }));

    }).then(function(watcherId) {
      window._bgWatcherId = watcherId;
      bgGeoActive = true;
      updateUIState(true);
      // v2.58 FIX: notify app.js that tracking started (so liveActive, timers, autoSave all sync)
      // app.js startLive_resume handles the case where liveActive is already true (no-op on watchPosition)
      // but sets up timer, autoSave interval, and updates pos auth UI correctly
      window.dispatchEvent(new CustomEvent('capgpsTrackingStarted', {
        detail: { km: bgTodayKm, startTime: bgStartTime }
      }));
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

    // v2.45: Flush remaining buffer and clear interval
    if (window._gpsFlushInterval) {
      clearInterval(window._gpsFlushInterval);
      window._gpsFlushInterval = null;
    }
    if (window._gpsTrackBuffer && window._gpsTrackBuffer.length > 0) {
      var flushRefs = getFirebaseRefs();
      if (flushRefs) {
        var flushPath = 'trips/' + flushRefs.familyId + '/tracks/' + todayStr() + '/points';
        var updates = {};
        for (var i = 0; i < window._gpsTrackBuffer.length; i++) {
          var key = flushRefs.db.ref(flushPath).push().key;
          updates[key] = window._gpsTrackBuffer[i];
        }
        flushRefs.db.ref(flushPath).update(updates);
        console.log('[CapGPS] Final flush: ' + window._gpsTrackBuffer.length + ' points');
      }
      window._gpsTrackBuffer = [];
    }

    // Update Firebase session
    var refs = getFirebaseRefs();
    if (refs) {
      refs.db.ref('trips/' + refs.familyId + '/liveSession/' + refs.uid).set({
        active: false,
        stoppedAt: Date.now(),
        todayKm: bgTodayKm
      });
      // v3.06 FIX: remove todayKm from live node on stop to prevent stale km display next day
      refs.db.ref('trips/' + refs.familyId + '/live/' + refs.uid).update({
        status: 'stopped',
        speed: 0,
        todayKm: null  // explicitly remove stale todayKm
      });
      // v2.98: write final lastPosition so the family map keeps the van pinned
      if (bgLastLat !== null && bgLastLng !== null) {
        refs.db.ref('trips/' + refs.familyId + '/lastPosition').set({
          lat: bgLastLat, lng: bgLastLng, heading: 0, ts: Date.now(), name: refs.name
        }).catch(function(e) { console.warn('[CapGPS] Stop lastPosition failed:', e.message); });
      }
    }

    updateUIState(false);
    // v2.58 FIX: notify app.js that tracking stopped so it can clean up timers
    window.dispatchEvent(new CustomEvent('capgpsTrackingStopped', {
      detail: { km: bgTodayKm }
    }));
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
    // v2.58 FIX: update the individual span elements that app.js uses, not just innerHTML
    // Previously, CapGPS was overwriting pos-live-stats innerHTML — bypassing app.js spans
    var speedNow = document.getElementById('live-speed-now');
    var kmToday = document.getElementById('live-km-today');
    var timeToday = document.getElementById('live-time-today');
    var statsDiv = document.getElementById('pos-live-stats');

    var elapsed = Date.now() - bgStartTime;
    var h = Math.floor(elapsed / 3600000);
    var m = Math.floor((elapsed % 3600000) / 60000);
    var timeStr = h > 0 ? h + 'h ' + String(m).padStart(2, '0') + 'm' : m + 'min';

    if (speedNow) speedNow.textContent = Math.round(speed);
    if (kmToday) kmToday.textContent = km.toFixed(1);
    if (timeToday) timeToday.textContent = timeStr;
    // Make sure the stats container is visible when tracking is active
    if (statsDiv && bgGeoActive) statsDiv.style.display = '';
  }

  // v2.48: Flush GPS buffer when app goes to background
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden' && window._gpsTrackBuffer && window._gpsTrackBuffer.length > 0) {
      var flushRefs = getFirebaseRefs();
      if (flushRefs) {
        var flushPath = 'trips/' + flushRefs.familyId + '/tracks/' + todayStr() + '/points';
        var updates = {};
        for (var i = 0; i < window._gpsTrackBuffer.length; i++) {
          var key = flushRefs.db.ref(flushPath).push().key;
          updates[key] = window._gpsTrackBuffer[i];
        }
        flushRefs.db.ref(flushPath).update(updates);
        console.log('[CapGPS] Background flush: ' + window._gpsTrackBuffer.length + ' points');
        window._gpsTrackBuffer = [];
      }
    }
  });

  // v2.48: Flush on Capacitor appStateChange (Android/iOS background)
  if (window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
    window.Capacitor.Plugins.App.addListener('appStateChange', function(state) {
      if (!state.isActive && window._gpsTrackBuffer && window._gpsTrackBuffer.length > 0) {
        var flushRefs = getFirebaseRefs();
        if (flushRefs) {
          var flushPath = 'trips/' + flushRefs.familyId + '/tracks/' + todayStr() + '/points';
          var updates = {};
          for (var i = 0; i < window._gpsTrackBuffer.length; i++) {
            var key = flushRefs.db.ref(flushPath).push().key;
            updates[key] = window._gpsTrackBuffer[i];
          }
          flushRefs.db.ref(flushPath).update(updates);
          console.log('[CapGPS] AppState flush: ' + window._gpsTrackBuffer.length + ' points');
          window._gpsTrackBuffer = [];
        }
      }
    });
  }

  // v2.48: Flush before page unload (web)
  window.addEventListener('beforeunload', function() {
    if (window._gpsTrackBuffer && window._gpsTrackBuffer.length > 0) {
      var flushRefs = getFirebaseRefs();
      if (flushRefs) {
        var flushPath = 'trips/' + flushRefs.familyId + '/tracks/' + todayStr() + '/points';
        var updates = {};
        for (var i = 0; i < window._gpsTrackBuffer.length; i++) {
          var key = flushRefs.db.ref(flushPath).push().key;
          updates[key] = window._gpsTrackBuffer[i];
        }
        flushRefs.db.ref(flushPath).update(updates);
        window._gpsTrackBuffer = [];
      }
    }
  });

  // Auto-resume on app restart (waits for auth to be ready)
  document.addEventListener('DOMContentLoaded', function() {
    // v2.34: Use waitForAuth instead of arbitrary 3s timeout
    var resumeDelay = typeof window.waitForAuth === 'function'
      ? window.waitForAuth(5000)
      : new Promise(function(r) { setTimeout(r, 3000); });

    resumeDelay.then(function() {
      var refs = getFirebaseRefs();
      if (!refs) return;
      refs.db.ref('trips/' + refs.familyId + '/liveSession/' + refs.uid).once('value', function(snap) {
        var session = snap.val();
        if (session && session.active === true) {
          console.log('[CapGPS] Resuming tracking from previous session');
          bgTodayKm = session.todayKm || 0;
          bgStartTime = session.startTime || Date.now();
          doStartTracking(refs);
        }
      });
    });
  });

})();
