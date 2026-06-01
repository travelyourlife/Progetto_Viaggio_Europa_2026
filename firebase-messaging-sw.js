// firebase-messaging-sw.js — Required by Firebase SDK for push token registration.
// The actual messaging logic is handled by sw.js which is the registered service worker.
// This file exists as a fallback for Firebase SDK internal checks.
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

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  const title = payload.notification?.title || 'Quo Vadis';
  const options = {
    body: payload.notification?.body || '',
    icon: './icon-maskable-192.png',
    badge: './icon-maskable-192.png',
    data: payload.data || {}
  };
  return self.registration.showNotification(title, options);
});
