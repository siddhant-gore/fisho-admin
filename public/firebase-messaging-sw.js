// public/firebase-messaging-sw.js
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDqUmRqoHwgQ5bcQy56qc_5mEI4rkYYzHA",
  authDomain: "fisho-717cc.firebaseapp.com",
  projectId: "fisho-717cc",
  storageBucket: "fisho-717cc.firebasestorage.app",
  messagingSenderId: "656093859945",
  appId: "1:656093859945:web:199979fb224521e4d8d2f8",
  measurementId: "G-W1EDF4H5H7"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
