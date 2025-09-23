// firebase.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDqUmRqoHwgQ5bcQy56qc_5mEI4rkYYzHA",
  authDomain: "fisho-717cc.firebaseapp.com",
  projectId: "fisho-717cc",
  storageBucket: "fisho-717cc.firebasestorage.app",
  messagingSenderId: "656093859945",
  appId: "1:656093859945:web:199979fb224521e4d8d2f8",
  measurementId: "G-W1EDF4H5H7"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export { messaging, getToken, onMessage };
