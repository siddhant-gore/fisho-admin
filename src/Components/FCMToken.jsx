// import { messaging } from './firebase';
// import { getToken } from 'firebase/messaging';
import { useEffect } from 'react';
import { useSaveFcmTokenMutation } from '../redux/slices/apiSlice';
import { getToken } from 'firebase/messaging';
import { messaging } from '../utils/firebase';

const FCMToken = () => {
  const [saveFcmToken] = useSaveFcmTokenMutation();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const currentToken = await getToken(messaging, {
            vapidKey: 'BHThUXCH144RQ-kibsQkSUMMg9lh5NECswiDSxf4PZ9tr5fwv8nSfE6K4Zmw63wxM0jc1u0kayTIcQ6d5JX5GqA',
          });
          if (currentToken) {
            console.log('FCM Token:', currentToken);
            await saveFcmToken(currentToken);
          } else {
            console.warn('No registration token available.');
          }
        } else {
          console.warn('Notification permission not granted');
        }
      } catch (err) {
        console.error('Error retrieving token:', err);
      }
    };

    fetchToken();
  }, [saveFcmToken]);

  return null;
};

export default FCMToken;
