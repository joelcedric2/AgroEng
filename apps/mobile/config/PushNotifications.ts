import PushNotification, { Importance, ChannelObject } from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';

// Configure the notification channels for Android
const configurePushNotifications = () => {
  // Create the default channel for Android
  const channelId = 'daily_tips_channel';
  const channel: ChannelObject = {
    channelId,
    channelName: 'Daily Tips',
    channelDescription: 'Notifications for daily farming tips',
    playSound: true,
    soundName: 'default',
    importance: Importance.HIGH,
    vibrate: true,
  };

  // Configure the notification handler
  PushNotification.configure({
    // (optional) Called when Token is generated
    onRegister: function (token) {
      console.log('TOKEN:', token);
      // You can send this token to your server to send notifications to this device
    },

    // (required) Called when a remote or local notification is opened or received
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
      
      // Process the notification
      const isClicked = notification.userInteraction;
      const isSilent = !!notification.data.isSilent;

      // Handle the notification based on its type
      if (isClicked) {
        // User tapped on the notification
        // You can handle navigation here based on the notification data
      } else if (!isSilent) {
        // Notification was received in foreground
        // You can show an in-app banner or update the UI
      }

      // Call the completion handler for iOS
      if (Platform.OS === 'ios') {
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      }
    },

    // Should the initial notification be popped automatically
    popInitialNotification: true,

    // Request permissions on iOS
    requestPermissions: Platform.OS === 'ios',
  });

  // Create the notification channel for Android
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      channel,
      (created) => console.log(`Channel created: ${created}`)
    );
  }

  // Set notification categories for iOS
  if (Platform.OS === 'ios') {
    PushNotificationIOS.setNotificationCategories([
      {
        id: 'DAILY_TIP',
        actions: [
          { id: 'view', title: 'View', options: { foreground: true } },
          { id: 'dismiss', title: 'Dismiss', options: { foreground: false } },
        ],
      },
    ]);
  }
};

// Schedule a local notification
const scheduleLocalNotification = (id: string, title: string, message: string, date: Date) => {
  PushNotification.localNotificationSchedule({
    channelId: 'daily_tips_channel',
    id,
    title,
    message,
    date,
    allowWhileIdle: true,
    priority: 'high',
    importance: 'high',
    visibility: 'public',
    playSound: true,
    soundName: 'default',
  });
};

// Cancel a scheduled notification
const cancelScheduledNotification = (id: string) => {
  PushNotification.cancelLocalNotifications({ id });
};

// Cancel all scheduled notifications
const cancelAllScheduledNotifications = () => {
  PushNotification.cancelAllLocalNotifications();
};

export {
  configurePushNotifications,
  scheduleLocalNotification,
  cancelScheduledNotification,
  cancelAllScheduledNotifications,
};
