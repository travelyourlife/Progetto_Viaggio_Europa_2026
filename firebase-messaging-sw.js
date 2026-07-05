// firebase-messaging-sw.js — Required by Firebase SDK for push token registration.
// The actual messaging logic is handled by sw.js which is the registered service worker.
// This file exists as a fallback for Firebase SDK internal checks.
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

// v2.96 FIX: NON registrare qui onBackgroundMessage.
// In precedenza sia questo file SIA sw.js gestivano onBackgroundMessage: se il
// browser avesse usato/registrato entrambi i service worker FCM, lo stesso push
// avrebbe potuto generare DUE notifiche. La gestione dei messaggi in background è
// centralizzata in sw.js (il service worker effettivamente registrato dall'app).
// Qui ci limitiamo a inizializzare Messaging per i controlli interni dell'SDK.
firebase.messaging();
