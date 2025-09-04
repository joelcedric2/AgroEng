# Push Notifications Setup

This document outlines the push notification implementation for the AgroEng mobile app, including setup instructions and usage.

## Features

- Daily tips notifications with grouping/threading
- Silent push for content prefetching
- Evening digest notifications
- In-app notification banners
- Cross-platform support (iOS & Android)

## Setup

### Prerequisites

1. Install required dependencies:
   ```bash
   npm install @react-native-community/push-notification-ios react-native-push-notification react-native-device-info --legacy-peer-deps
   ```

2. For iOS, install pods:
   ```bash
   cd ios && pod install && cd ..
   ```

### Android Configuration

1. Add the following to `android/app/src/main/AndroidManifest.xml` inside the `<application>` tag:
   ```xml
   <meta-data
     android:name="com.google.firebase.messaging.default_notification_channel_id"
     android:value="daily_tips_channel" />
   ```

2. Add required permissions:
   ```xml
   <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
   <uses-permission android:name="android.permission.VIBRATE" />
   <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
   ```

### iOS Configuration

1. Enable Push Notifications in Xcode:
   - Open your project in Xcode
   - Select your target
   - Go to "Signing & Capabilities"
   - Click "+ Capability" and add "Push Notifications" and "Background Modes"
   - In Background Modes, enable "Remote notifications"

2. Add the following to your `AppDelegate.m`:
   ```objc
   #import <UserNotifications/UserNotifications.h>
   #import <RNCPushNotificationIOS.h>
   
   // ...
   
   - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
     // ... other code
     
     // Define UNUserNotificationCenter
     UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
     center.delegate = self;
     
     return YES;
   }
   
   // Required for the register event.
   - (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
   {
     [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
   }
   
   // Required for the notification event. You must call the completion handler after handling the remote notification.
   - (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
   fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
   {
     [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
   }
   
   // Required for the registrationError event.
   - (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
   {
     [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
   }
   
   // Required for localNotification event
   - (void)userNotificationCenter:(UNUserNotificationCenter *)center
   didReceiveNotificationResponse:(UNNotificationResponse *)response
   withCompletionHandler:(void (^)(void))completionHandler
   {
     [RNCPushNotificationIOS didReceiveNotificationResponse:response];
   }
   
   // Called when a notification is delivered to a foreground app.
   -(void)userNotificationCenter:(UNUserNotificationCenter *)center 
   willPresentNotification:(UNNotification *)notification 
   withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
   {
     // Still call the JS onNotification handler so it can display the new message right away
     NSDictionary *userInfo = notification.request.content.userInfo;
     [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo
                                   fetchCompletionHandler:^void (UIBackgroundFetchResult result){}];
   
     // allow showing foreground notifications
     completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
   }
   ```

## Usage

### Scheduling Daily Tips

```typescript
import DailyTipsNotificationService from '../services/DailyTipsNotificationService';

// Schedule a daily tip
DailyTipsNotificationService.scheduleDailyTip();
```

### Handling Notification Taps

Notification taps are handled automatically by the `PushNotifications` configuration. The app will navigate to the appropriate screen based on the notification type.

### Testing Notifications

You can test notifications using the following methods:

1. **Local Notifications**:
   ```typescript
   import { scheduleLocalNotification } from '../config/PushNotifications';
   
   scheduleLocalNotification(
     'test_notification',
     'Test Notification',
     'This is a test notification',
     new Date(Date.now() + 5000) // 5 seconds from now
   );
   ```

2. **Silent Push Notifications**:
   ```typescript
   // This would typically be sent from your server
   const silentPush = {
     content_available: true,
     priority: 'high',
     data: {
       isSilent: '1',
       tipId: '123',
       content: 'Prefetched tip content'
     }
   };
   ```

## Troubleshooting

1. **Notifications not showing on Android**:
   - Make sure the app has notification permissions
   - Check that the notification channel is created
   - Verify the app is not in battery optimization mode

2. **Notifications not showing on iOS**:
   - Check that push notifications are enabled in device settings
   - Verify the provisioning profile includes push notification capability
   - Make sure the app is properly code signed

3. **Silent notifications not working**:
   - On iOS, make sure "Background Modes" includes "Remote notifications"
   - On Android, ensure the app has the WAKE_LOCK permission
   - Check that the payload includes `content_available: true` and `priority: 'high'`

## Best Practices

1. Always request notification permissions before showing notifications
2. Handle notification taps to navigate to the relevant screen
3. Use silent notifications for prefetching content
4. Group related notifications using thread IDs
5. Test notifications on both iOS and Android
6. Handle app state changes (foreground/background)

## License

This implementation is part of the AgroEng mobile app and is subject to the project's license.
