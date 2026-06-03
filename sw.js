// ═══════════════════════════════════════════════════════════════
// Service Worker — Viaggio Europa 2026 V1.51
// Strategy: Stale-While-Revalidate for own assets (instant load + background update)
//           Cache-First for CDN (stable, versioned)
//           Network-Only for API calls
// ═══════════════════════════════════════════════════════════════
'use strict';

// ─── FCM: importScripts MUST be at the very top, before any event listeners ───
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-installations-compat.js');

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

const CACHE_NAME = 'quo-vadis-v1.51';
const IMAGE_CACHE_NAME = 'quo-vadis-images-v1';
const IMAGE_CACHE_LIMIT = 80;
const STATIC_ASSETS = [
  './',
  './index.html',
  './index_en.html',
  './style.css',
  './data.js',
  './days-data.js',
  './days-renderer.js',
  './wiki-links.js',
  './weather-coords.js',
  './app.js',
  './manifest.json',
  './icon.png',
  './icon-192.png',
  './icon-maskable-180.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
  './icons/van-marker.svg',
  './firebase-messaging-sw.js',
  './offline.html'
];

const CDN_ASSETS = [
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-installations-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js'
];

// ─── Install: pre-cache both CDN and STATIC assets, skip waiting immediately ───
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('[SW] Installing — caching all assets (CDN + Static)');
      return cache.addAll(CDN_ASSETS.concat(STATIC_ASSETS));
    }).then(function() {
      // Force immediate activation — don't wait for old SW to release
      return self.skipWaiting();
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

  // Stale-While-Revalidate for OWN assets (instant load + background refresh)
  event.respondWith(staleWhileRevalidate(event.request));
});

// ─── Helpers ───

function isApiRequest(url) {
  return url.hostname === 'api.open-meteo.com' ||
         url.hostname.includes('firebaseio.com') ||
         url.hostname.includes('firebasedatabase.app') ||
         url.hostname.includes('googleapis.com') ||
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
      // Serve branded offline page for navigation requests
      if (request.mode === 'navigate') {
        return caches.match('./offline.html').then(function(offlinePage) {
          return offlinePage || cachedResponse || new Response('Offline', { status: 503 });
        });
      }
      return cachedResponse || new Response('Offline', { status: 503 });
    });
    return cachedResponse || fetchPromise;
  });
}

function isDynamicImage(url) {
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
        return new Response('', { status: 404 });
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
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Background message received:', payload);
  var notif = payload.notification || {};
  var data = payload.data || {};
  var title = notif.title || data.title || 'Quo Vadis';
  var options = {
    body: notif.body || data.body || '',
    icon: './icon-maskable-192.png',
    badge: './icon-maskable-192.png',
    tag: 'quo-vadis-' + (data.tag || 'general'),
    data: { url: data.click_action || data.url || './', type: data.type || '' },
    vibrate: [100, 50, 100],
    actions: [
      { action: 'open', title: data.actionLabel || 'Apri' }
    ]
  };
  return self.registration.showNotification(title, options);
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

// Handle push event directly (for data-only messages without notification field)
self.addEventListener('push', function(event) {
  if (!event.data) return;
  var payload;
  try { payload = event.data.json(); } catch(e) { return; }

  // If it has a notification field, Firebase SDK handles it via onBackgroundMessage
  if (payload.notification) return;

  // Data-only message — show notification manually
  var data = payload.data || {};
  var title = data.title || 'Quo Vadis';
  var options = {
    body: data.body || '',
    icon: './icon-maskable-192.png',
    badge: './icon-maskable-192.png',
    tag: 'quo-vadis-' + (data.tag || 'general'),
    data: { url: data.url || './', type: data.type || '' },
    vibrate: [100, 50, 100]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
