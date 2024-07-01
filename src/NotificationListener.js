import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

export const NotificationListeners = () => {
  console.log("fsdfsf");
  messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived!', remoteMessage);

    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      android: {
        channelId: 'default',
        importance: AndroidImportance.HIGH,
      },
    });
    
    console.log(remoteMessage.notification.title, " ", remoteMessage.notification.body);
  });
};