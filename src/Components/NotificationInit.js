// NotificationInit.js
// import { messaging, getToken, onMessage } from './firebase';
import { useEffect } from 'react';
import { messaging, getToken, onMessage } from '../utils/firebase';

export default function NotificationInit() {
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          getToken(messaging, { vapidKey: 'BHThUXCH144RQ-kibsQkSUMMg9lh5NECswiDSxf4PZ9tr5fwv8nSfE6K4Zmw63wxM0jc1u0kayTIcQ6d5JX5GqA' })
            .then((currentToken) => {
              if (currentToken) {
                console.log('FCM Token:', currentToken);
                // Send token to your server to subscribe user
              } else {
                console.warn('No registration token available.');
              }
            })
            .catch((err) => {
              console.error('An error occurred while retrieving token. ', err);
            });
        }
      });
    }

    // Foreground message handler
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // Show custom toast or alert
    });
  }, []);

  return null;
}
