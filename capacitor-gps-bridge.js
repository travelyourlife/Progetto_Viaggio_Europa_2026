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

  function todayStrFor(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function todayStr() {
    return todayStrFor(new Date());
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
    // v5.85 (QV-033): attempt to recover any points saved to localStorage by
    // a previous session's failed final flush, grouping by their own date
    // just like the live flush does. Best-effort — if this also fails, the
    // points stay in localStorage for the next attempt rather than being lost.
    try {
      var recovered = JSON.parse(localStorage.getItem('qv_gps_recovery') || '[]');
      if (recovered.length > 0) {
        var recRefs = getFirebaseRefs();
        if (recRefs) {
          var byDateRec = {};
          recovered.forEach(function(pt) {
            var d = pt.time ? todayStrFor(new Date(pt.time)) : todayStr();
            if (!byDateRec[d]) byDateRec[d] = [];
            byDateRec[d].push(pt);
          });
          var recoveryPromises = Object.keys(byDateRec).map(function(dateKey) {
            var flushPath = 'trips/' + recRefs.familyId + '/tracks/' + dateKey + '/points';
            var updates = {};
            byDateRec[dateKey].forEach(function(pt) {
              var key = recRefs.db.ref(flushPath).push().key;
              updates[key] = pt;
            });
            return recRefs.db.ref(flushPath).update(updates);
          });
          Promise.all(recoveryPromises).then(function() {
            localStorage.removeItem('qv_gps_recovery');
            console.log('[CapGPS] Recovered ' + recovered.length + ' point(s) from a previous failed flush');
          }).catch(function(e) {
            console.warn('[CapGPS] Recovery flush failed, will retry next start:', e.message);
          });
        }
      }
    } catch (e) { /* best effort only */ }
    if (!BackgroundGeolocation) {
      if (window.showToast) window.showToast((typeof LANG3 !== 'undefined' && LANG3 === 'es') ? 'GPS: Plugin no disponible' : (typeof isEN !== 'undefined' && isEN) ? 'GPS: Plugin not available' : 'GPS: Plugin non disponibile', 'error');
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
            if (window.showToast) window.showToast((typeof LANG3 !== 'undefined' && LANG3 === 'es') ? 'GPS: Firebase no listo. Reintentar.' : (typeof isEN !== 'undefined' && isEN) ? 'GPS: Firebase not ready. Retry.' : 'GPS: Firebase non pronto. Riprova.', 'error');
          }
        });
        return;
      }
      if (window.showToast) window.showToast((typeof LANG3 !== 'undefined' && LANG3 === 'es') ? 'GPS: Firebase no listo. Reintentar.' : (typeof isEN !== 'undefined' && isEN) ? 'GPS: Firebase not ready. Retry.' : 'GPS: Firebase non pronto. Riprova.', 'error');
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
          if (window.confirm((typeof LANG3 !== 'undefined' && LANG3 === 'es') ? 'Quo Vadis necesita permiso GPS en segundo plano. 00bfAbrir ajustes?' : (typeof isEN !== 'undefined' && isEN) ? 'Quo Vadis needs background GPS permission. Open settings?' : 'Quo Vadis ha bisogno del permesso GPS in background. Aprire le impostazioni?')) {
            BackgroundGeolocation.openSettings();
          }
        }
        console.warn('[CapGPS] Error:', error);
        return;
      }

      if (!location) return;

      // v5.03: Accuracy filter — discard low-quality fixes
      var _acc = location.accuracy || 0;
      if (_acc > 30) {
        console.log('[CapGPS] Fix discarded: accuracy=' + _acc.toFixed(0) + 'm > 30m');
        return;
      }

      var lat = location.latitude;
      var lng = location.longitude;
      var speed = location.speed != null ? location.speed * 3.6 : 0; // m/s → km/h
      var heading = location.bearing || 0;
      var time = Date.now();

      // Calculate distance
      if (bgLastLat !== null && bgLastLng !== null) {
        var dist = haversineKm(bgLastLat, bgLastLng, lat, lng);
        // v5.03: dynamic threshold based on accuracy (replaces fixed 0.1)
        var distMin = Math.max(0.1, (_acc || 10) / 1000 * 1.5);
        if (dist >= distMin && dist < 5) {
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

        // v3.93: Update unified /currentLocation (throttled: every 5 min or >500m moved)
        if (window.writeCurrentLocation) {
          var _doLocWrite = false;
          if (!window._lastLocWriteTime) _doLocWrite = true;
          else if ((now - window._lastLocWriteTime) >= 300000) _doLocWrite = true;
          else if (window._lastLocWriteLat != null) {
            var _locDist = haversineKm(window._lastLocWriteLat, window._lastLocWriteLng, lat, lng);
            if (_locDist > 0.5) _doLocWrite = true;
          }
          if (_doLocWrite) {
            window._lastLocWriteTime = now;
            window._lastLocWriteLat = lat;
            window._lastLocWriteLng = lng;
            window.writeCurrentLocation(lat, lng);
          }
        }

        // v3.89: Update current country via Nominatim (max once every 10 min)
        if (!window._lastCountryCheck || (now - window._lastCountryCheck) >= 600000) {
          window._lastCountryCheck = now;
          (function(refPath, cLat, cLng) {
            // v5.95 FIX (QV-042): was a raw fetch(), bypassing the shared
            // 1100ms-queued _nominatimFetch wrapper that every other Nominatim
            // call in the app already goes through — this GPS-driven check
            // could fire concurrently with those and get rate-limited (429)
            // independently. Routed through the same queue now; the 10-minute
            // self-throttle above stays as a second, complementary limit.
            var geoUrl = 'https://nominatim.openstreetmap.org/reverse?lat=' + cLat + '&lon=' + cLng + '&format=json&zoom=3';
            var geoPromise = window._nominatimFetch
              ? window._nominatimFetch(geoUrl, { headers: { 'User-Agent': 'QuoVadis-TripApp/3.89' } })
              : fetch(geoUrl, { headers: { 'User-Agent': 'QuoVadis-TripApp/3.89' } }).then(function(r) { return r.json(); });
            geoPromise.then(function(data) {
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
          // v5.85 FIX (QV-033 + QV-034, same buffer/flush mechanism):
          // - QV-033: this used to clear window._gpsTrackBuffer immediately
          //   after starting update(), not after it actually succeeded — a
          //   network failure (very plausible mid-trip) silently discarded
          //   the whole buffer with only a console.warn nobody ever sees.
          //   Now the buffer being flushed is only cleared on confirmed
          //   success; on failure, those points go back into the live
          //   buffer (prepended, so points added meanwhile aren't lost
          //   either) and are retried on the next 60s flush.
          // - QV-034: this used to group ALL buffered points under a single
          //   todayStr() computed at FLUSH time, not per-point acquisition
          //   time — a point captured just before midnight but flushed just
          //   after could be saved under the wrong day. Now grouped by each
          //   point's own .time field.
          var byDate = {};
          buffer.forEach(function(pt) {
            var d = pt.time ? todayStrFor(new Date(pt.time)) : todayStr();
            if (!byDate[d]) byDate[d] = [];
            byDate[d].push(pt);
          });
          var toFlush = buffer.slice(); // snapshot of what we're attempting
          window._gpsTrackBuffer = []; // new points captured during the write land here, untouched
          var writePromises = Object.keys(byDate).map(function(dateKey) {
            var flushPath = 'trips/' + flushRefs.familyId + '/tracks/' + dateKey + '/points';
            var updates = {};
            byDate[dateKey].forEach(function(pt) {
              var key = flushRefs.db.ref(flushPath).push().key;
              updates[key] = pt;
            });
            return flushRefs.db.ref(flushPath).update(updates);
          });
          Promise.all(writePromises).then(function() {
            console.log('[CapGPS] Flushed ' + toFlush.length + ' track points across ' + Object.keys(byDate).length + ' day(s)');
          }).catch(function(e) {
            console.warn('[CapGPS] Flush track failed, re-queueing ' + toFlush.length + ' point(s) for retry:', e.message);
            window._gpsTrackBuffer = toFlush.concat(window._gpsTrackBuffer);
          });
          // Update session km once per flush
          flushRefs.db.ref('trips/' + flushRefs.familyId + '/liveSession/' + flushRefs.uid + '/todayKm').set(bgTodayKm)
            .catch(function(e) { console.warn('[CapGPS] Flush km failed:', e.message); });
          // v2.98: refresh lastPosition on every flush so the family map stays accurate
          if (bgLastLat !== null && bgLastLng !== null) {
            flushRefs.db.ref('trips/' + flushRefs.familyId + '/lastPosition').set({
              lat: bgLastLat, lng: bgLastLng, heading: 0, ts: Date.now(), name: flushRefs.name
            }).catch(function(e) { console.warn('[CapGPS] Flush lastPosition failed:', e.message); });
          }
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
      if (window.showToast) window.showToast((typeof LANG3 !== 'undefined' && LANG3 === 'es') ? 'D83dDe90 Tracking GPS iniciado (segundo plano activo)' : (typeof isEN !== 'undefined' && isEN) ? 'D83dDe90 GPS tracking started (background active)' : 'D83dDe90 Tracking GPS avviato (background attivo)', 'success');
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
        // v5.85 FIX (QV-033 + QV-034): same fix as the periodic flush above —
        // group by each point's own acquisition date, and only clear the
        // buffer once the write is confirmed, restoring it on failure so a
        // stop-tracking action during a network hiccup doesn't silently lose
        // the final batch of real GPS points.
        var stopBuffer = window._gpsTrackBuffer.slice();
        var byDateStop = {};
        stopBuffer.forEach(function(pt) {
          var d = pt.time ? todayStrFor(new Date(pt.time)) : todayStr();
          if (!byDateStop[d]) byDateStop[d] = [];
          byDateStop[d].push(pt);
        });
        window._gpsTrackBuffer = [];
        Object.keys(byDateStop).forEach(function(dateKey) {
          var flushPath = 'trips/' + flushRefs.familyId + '/tracks/' + dateKey + '/points';
          var updates = {};
          byDateStop[dateKey].forEach(function(pt) {
            var key = flushRefs.db.ref(flushPath).push().key;
            updates[key] = pt;
          });
          flushRefs.db.ref(flushPath).update(updates).catch(function(e) {
            console.warn('[CapGPS] Final flush failed for ' + dateKey + ', re-queueing:', e.message);
            window._gpsTrackBuffer = (byDateStop[dateKey] || []).concat(window._gpsTrackBuffer);
            // v5.85: the periodic flush interval is already cleared by the
            // time we get here (tracking has stopped), so nothing will ever
            // retry window._gpsTrackBuffer again this session. Persist to
            // localStorage as a last-resort recovery point instead of
            // letting it disappear the moment the tab/app closes.
            try {
              var recovered = JSON.parse(localStorage.getItem('qv_gps_recovery') || '[]');
              recovered = recovered.concat(byDateStop[dateKey] || []);
              localStorage.setItem('qv_gps_recovery', JSON.stringify(recovered));
            } catch (e2) { /* best effort only */ }
          });
        });
        console.log('[CapGPS] Final flush: ' + stopBuffer.length + ' points across ' + Object.keys(byDateStop).length + ' day(s)');
      }
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
        // v3.93: Write unified /currentLocation on stop
        if (window.writeCurrentLocation) window.writeCurrentLocation(bgLastLat, bgLastLng);
      }
    }

    updateUIState(false);
    // v2.58 FIX: notify app.js that tracking stopped so it can clean up timers
    window.dispatchEvent(new CustomEvent('capgpsTrackingStopped', {
      detail: { km: bgTodayKm }
    }));
    if (window.showToast) window.showToast((typeof LANG3 !== 'undefined' && LANG3 === 'es') ? '23f9Fe0f Tracking detenido. ' + bgTodayKm.toFixed(1) + ' km registrados.' : (typeof isEN !== 'undefined' && isEN) ? '23f9Fe0f Tracking stopped. ' + bgTodayKm.toFixed(1) + ' km recorded.' : '23f9Fe0f Tracking fermato. ' + bgTodayKm.toFixed(1) + ' km registrati.', 'info');
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
