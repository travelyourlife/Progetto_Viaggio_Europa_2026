// firebase-messaging-sw.js — Required by Firebase SDK for push token registration.
// The actual messaging logic is handled by sw.js which is the registered service worker.
// This file exists as a fallback for Firebase SDK internal checks.
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDiYJKRTMJm3LoJwTp2GnFMiNDkxsGJOk8",
  authDomain: "viaggio-europa-2026.firebaseapp.com",
  databaseURL: "https://viaggio-europa-2026-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "viaggio-europa-2026",
  storageBucket: "viaggio-europa-2026.firebasestorage.app",
  messagingSenderId: "859844907239",
  appId: "1:859844907239:web:389e3e5e4fa3e38e3b5e3e"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  const title = payload.notification?.title || 'Quo Vadis 🧭';
  const options = {
    body: payload.notification?.body || '',
    icon: '/Progetto_Viaggio_Europa_2026/icons/icon-192.png',
    badge: '/Progetto_Viaggio_Europa_2026/icons/icon-72.png',
    data: payload.data || {}
  };
  return self.registration.showNotification(title, options);
});
