// ═══════════════════════════════════════════════════════════════
// Service Worker — Quo Vadis V2.00
// Strategy: Stale-While-Revalidate for own assets (instant load + background update)
//           Cache-First for CDN (stable, versioned)
//           Network-Only for API calls
// ═══════════════════════════════════════════════════════════════
'use strict';

// ─── FCM: importScripts MUST be at the very top, before any event listeners ───
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCuUYGu_5PlIlDbxwYsFYL5y4OmoGehzzg',
  authDomain: 'viaggio-europa-2026.firebaseapp.com',
  databaseURL: 'https://viaggio-europa-2026-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'viaggio-europa-2026',
  storageBucket: 'viaggio-europa-2026.firebasestorage.app',
  messagingSenderId: '859844907239',
  appId: '1:859844907239:web:f226b10961df1fe66fd242'
});

var messaging = firebase.messaging();

// ═══════════════════════════════════════════════════════════════
// ─── CACHING CONFIG ───
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME = 'quo-vadis-v5.01';
const IMAGE_CACHE_NAME = 'quo-vadis-images-v1';
const IMAGE_CACHE_LIMIT = 80;
const STATIC_ASSETS = [
  './',
  './index.html',
  './index_en.html',
  './index_es.html',
  './style.css?v=4.92',
  './data.js',
  './days-data.js',
  './days-renderer.js',
  // wiki-links.js: NOT precached — lazy-loaded on first open of Cultura/Attività tab
  './weather-coords.js',
  './app.js?v=4.92',
  './manifest.json',
  './icon.png',
  './icon-192.png',
  './icon-maskable-180.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
  './icons/van-marker.svg',
  './firebase-messaging-sw.js',
  './capacitor-gps-bridge.js',
  './offline.html',
  './home-variants.html',
  './home-variants_en.html',
  './home-variants_es.html',
  './home-variants.css',
  './home-variants.js',
  './unified-map.js',
  './unified-map.css',
  './poi-data.js',
  './modern-pages.css',
  './curiosita-data.js',
  './curiosita-scheduler.js',
  './quiz-fun.js',
  './city-itineraries.js?v=4.92',
  './city-itineraries-ui.js?v=4.92',
  // debug-overlay.js: rimosso — caricato on-demand solo da Admin
  // v2.70: immagini placeholder per Home offline
  './img/placeholder/bridge-coast.jpg',
  './img/placeholder/fjord-camper.jpg',
  './img/placeholder/road-fjord.jpg',
  './img/placeholder/scandinavia-road.jpg',
  './img/placeholder/tallinn-old-town.jpg',
  './img/placeholder/van-view.jpg',
  './icons/icon-posizione.png'
];

const CDN_ASSETS = [
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  // v2.71: MarkerCluster aggiunto al precache — necessario per mappa offline
  'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js',
  'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css',
  'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js'
];

// ─── Install: pre-cache both CDN and STATIC assets ───
// v2.11 FIX: Removed automatic skipWaiting() to prevent mid-navigation breakage.
// The new SW waits until the user accepts the update via the client-side banner.
self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('[SW] Installing — caching all assets (CDN + Static)');
      return cache.addAll(CDN_ASSETS.concat(STATIC_ASSETS));
    })
  );
});

// ─── Activate: clean ALL old caches, take control immediately ───
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME && key !== IMAGE_CACHE_NAME; })
            .map(function(key) {
              console.log('[SW] Deleting old cache:', key);
              return caches.delete(key);
            })
      );
    }).then(function() {
      // Take control of ALL open tabs immediately
      return self.clients.claim();
    }).then(function() {
      // Notify all clients to reload
      return self.clients.matchAll({ type: 'window' }).then(function(clients) {
        clients.forEach(function(client) {
          client.postMessage({ type: 'SW_UPDATED', version: CACHE_NAME });
        });
      });
    })
  );
});

// ─── Fetch strategy router ───
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // v4.42 FIX: Map tiles (OpenStreetMap) must NEVER be intercepted by the SW.
  // Previously imageCacheFirst() handled every external .png and, on any fetch
  // miss/failure, returned an empty Response('', {status:404}). That empty body
  // made Leaflet show GREY tiles (only the SVG markers/route stayed visible) on
  // both the Live Map and the Home mini-map. Let the browser fetch tiles directly.
  if (isMapTile(url)) {
    return; // network passthrough, no SW handling
  }

  // Network-Only for API calls (Firebase, meteo) — never cache
  if (isApiRequest(url)) {
    return; // Let the browser handle it normally
  }

  // Cache-First for CDN assets (versioned, stable)
  if (isCdnAsset(url)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Dynamic images (flags, external icons) — cache with size limit
  if (isDynamicImage(url)) {
    event.respondWith(imageCacheFirst(event.request));
    return;
  }

  // v2.96: Network-First per il codice e i dati propri (app.js, *-data.js, *.js, *.json).
  // Lo Stale-While-Revalidate serviva la versione VECCHIA al primo avvio dopo un update
  // (le novità comparivano solo al secondo avvio). Con Network-First, quando si è online
  // l'utente vede SUBITO l'ultima versione; offline si usa la cache come prima.
  if (url.origin === self.location.origin && isOwnCodeOrData(url)) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Stale-While-Revalidate for OWN assets (instant load + background refresh)
  event.respondWith(staleWhileRevalidate(event.request));
});

// v2.96: identifica codice/dati propri che devono essere sempre freschi quando online
function isOwnCodeOrData(url) {
  var p = url.pathname;
  if (p.indexOf('version.json') !== -1) return false; // gestito come API (no-store)
  return /\.js$/.test(p) || /\.json$/.test(p) || /\.html$/.test(p) || /\.css$/.test(p) || p === '/' || p.endsWith('/');
}

// v2.96: Network-First — prova la rete, in caso di errore/offline ricade sulla cache
function networkFirst(request) {
  return fetch(request).then(function(networkResponse) {
    if (networkResponse && networkResponse.status === 200) {
      var copy = networkResponse.clone();
      caches.open(CACHE_NAME).then(function(cache) { cache.put(request, copy); });
    }
    return networkResponse;
  }).catch(function() {
    return caches.match(request).then(function(cached) {
      return cached || new Response('Offline', { status: 503 });
    });
  });
}

// ─── Helpers ───

function isApiRequest(url) {
  return url.hostname === 'api.open-meteo.com' ||
         url.hostname.includes('firebaseio.com') ||
         url.hostname.includes('firebasedatabase.app') ||
         url.hostname.includes('googleapis.com') ||
         url.hostname === 'accounts.google.com' ||
         url.pathname.includes('/__/auth/') ||
         url.pathname.includes('version.json');
}

function isCdnAsset(url) {
  return url.hostname === 'unpkg.com' ||
         url.hostname === 'www.gstatic.com' ||
         url.hostname === 'cdn.jsdelivr.net' ||
         url.hostname === 'fonts.googleapis.com' ||
         url.hostname === 'fonts.gstatic.com';
}

// Stale-While-Revalidate: serve cached immediately, update in background
function staleWhileRevalidate(request) {
  return caches.match(request).then(function(cachedResponse) {
    var fetchPromise = fetch(request).then(function(networkResponse) {
      if (networkResponse && networkResponse.status === 200) {
        var cacheCopy = networkResponse.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(request, cacheCopy);
        });
      }
      return networkResponse;
    }).catch(function() {
      console.log('[SW] Network error (offline mode)');
      // v2.11 FIX: For navigation requests, serve the cached app shell (index.html)
      // instead of a generic offline page. This allows full itinerary browsing offline
      // since data.js and days-data.js are pre-cached.
      if (request.mode === 'navigate') {
        return cachedResponse || caches.match('./index.html').then(function(shellPage) {
          return shellPage || caches.match('./offline.html').then(function(offlinePage) {
            return offlinePage || new Response('Offline', { status: 503 });
          });
        });
      }
      return cachedResponse || new Response('Offline', { status: 503 });
    });
    return cachedResponse || fetchPromise;
  });
}

// v4.42: identify map tile hosts so the SW leaves them to the network untouched
function isMapTile(url) {
  var h = url.hostname;
  return h === 'tile.openstreetmap.org' ||
         /\.tile\.openstreetmap\.org$/.test(h) ||   // a/b/c.tile.openstreetmap.org
         /\.tile\.opentopomap\.org$/.test(h) ||
         h === 'tile.opentopomap.org' ||
         /(^|\.)basemaps\.cartocdn\.com$/.test(h) ||
         /(^|\.)tiles?\.stadiamaps\.com$/.test(h) ||
         /(^|\.)tile\.thunderforest\.com$/.test(h);
}

function isDynamicImage(url) {
  if (isMapTile(url)) return false; // never cache/serve map tiles via SW
  var ext = url.pathname.split('.').pop().toLowerCase();
  return (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'webp' || ext === 'svg') &&
         url.hostname !== self.location.hostname; // only external images
}

// Image cache with size limit
function imageCacheFirst(request) {
  return caches.open(IMAGE_CACHE_NAME).then(function(cache) {
    return cache.match(request).then(function(cached) {
      if (cached) return cached;
      return fetch(request).then(function(response) {
        if (response && response.status === 200) {
          cache.put(request, response.clone());
          // Evict oldest entries if over limit
          cache.keys().then(function(keys) {
            if (keys.length > IMAGE_CACHE_LIMIT) {
              var toDelete = keys.length - IMAGE_CACHE_LIMIT;
              for (var i = 0; i < toDelete; i++) {
                cache.delete(keys[i]);
              }
            }
          });
        }
        return response;
      }).catch(function() {
        // v4.42: do NOT fabricate an empty 404 (it made images/tiles render blank).
        // Re-attempt a plain network fetch and, if that also fails, return a
        // transparent error so the browser shows its normal broken-image state
        // instead of a cached empty body.
        return fetch(request).catch(function() {
          return Response.error();
        });
      });
    });
  });
}

// Cache-First: serve from cache, only fetch if not cached (for CDN)
function cacheFirst(request) {
  return caches.match(request).then(function(cached) {
    if (cached) return cached;
    return fetch(request).then(function(response) {
      if (response && response.status === 200) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(request, clone);
        });
      }
      return response;
    });
  });
}

// ─── Message handling ───
self.addEventListener('message', function(event) {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  if (event.data === 'checkUpdate') {
    // Force re-registration check
    self.registration.update();
  }
});

// ═══════════════════════════════════════════════════════════════
// ─── FCM PUSH NOTIFICATIONS ───
// ═══════════════════════════════════════════════════════════════

// Handle background push messages
// v3.02 FIX: Since Cloud Function now sends webpush.notification (which the
// browser displays automatically), onBackgroundMessage should NOT call
// showNotification again — that would cause duplicates.
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Background message received:', payload);
  // webpush.notification is already shown by the browser — do NOT show again.
  // The 'notificationclick' handler (below) will handle routing.
});

// Handle notification click — route based on notification type and user role
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var data = event.notification.data || {};
  var url = data.url || './';
  var type = data.type || '';

  // For visitors: always open diary tab
  // For family: open relevant tab based on notification type
  if (type === 'evening_recap' || type === 'recap_reminder') {
    url = './#tab-diario';
  } else if (type === 'checkin_itinerary' || type === 'place_suggestion') {
    url = './#tab-posizione';
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var clientUrl = clientList[i].url || '';
        if (clientUrl.indexOf('Progetto_Viaggio_Europa_2026') !== -1 || clientUrl.indexOf('quo-vadis') !== -1 || clientUrl.indexOf('viaggio') !== -1) {
          clientList[i].focus();
          return clientList[i].navigate(url);
        }
      }
      return self.clients.openWindow(url);
    })
  );
});

// v3.02 NOTE: With webpush.notification set in the CF payload, the browser
// auto-displays the notification. This handler is a fallback for edge cases
// where webpush.notification might not be present (e.g., direct FCM data-only).
self.addEventListener('push', function(event) {
  if (!event.data) return;
  var payload;
  try { payload = event.data.json(); } catch(e) { return; }

  // If it has a notification field, Firebase SDK / browser handles it
  if (payload.notification) return;

  // If webpush.notification was set by CF, the browser already shows it — skip
  var data = payload.data || {};
  if (!data.title && !data.body) return; // nothing to show

  // Pure data-only fallback — show notification manually
  var title = data.title || 'Quo Vadis';
  var options = {
    body: data.body || '',
    icon: './icon-maskable-192.png',
    badge: './icon-maskable-192.png',
    tag: 'quo-vadis-' + (data.tag || 'general'),
    data: { url: data.url || './', type: data.type || '' },
    vibrate: [100, 50, 100],
    renotify: false
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
