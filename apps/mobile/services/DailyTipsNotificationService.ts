import { Platform } from 'react-native';
import { getUniqueId } from 'react-native-device-info';
import { 
  configurePushNotifications, 
  scheduleLocalNotification,
  cancelScheduledNotification,
  cancelAllScheduledNotifications 
} from '../config/PushNotifications';

const NOTIFICATION_GROUP_ID = 'daily_tips_group';
const NOTIFICATION_THREAD_ID = 'daily_tips_thread';

// Tip variations for notifications
const TIP_VARIATIONS = [
  'How to spot early blight in low light.',
  '3 ways to boost cassava yield this week.',
  'Soil pH quick fix for tomatoes.',
  'Watering tips for the dry season.',
  'Natural pest control for your garden.'
];

class DailyTipsNotificationService {
  private static instance: DailyTipsNotificationService;
  private deviceId: string = '';
  private lastTipTimestamp: number = 0;
  private pendingTips: Array<{id: string, title: string, body: string}> = [];
  private digestScheduled: boolean = false;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): DailyTipsNotificationService {
    if (!DailyTipsNotificationService.instance) {
      DailyTipsNotificationService.instance = new DailyTipsNotificationService();
    }
    return DailyTipsNotificationService.instance;
  }

  private async initialize() {
    this.deviceId = await getUniqueId();
    this.setupNotificationChannels();
    this.setupNotificationListeners();
  }

  private setupNotificationChannels() {
    // Configure push notifications using our centralized config
    configurePushNotifications();
  }

  private setupNotificationListeners() {
    // No need to set up listeners here as they're handled in the PushNotifications config
    // The PushNotifications.configure() in config/PushNotifications.ts will handle all notifications
  }

  public async scheduleDailyTip() {
    const now = Date.now();
    const tipIndex = Math.floor(Math.random() * TIP_VARIATIONS.length);
    const tipBody = TIP_VARIATIONS[tipIndex];
    const notificationId = `daily_tip_${now}`;

    // Add to pending tips for potential digest
    this.pendingTips.push({
      id: notificationId,
      title: 'Your daily tip is here',
      body: tipBody
    });

    // Schedule the notification
    this.scheduleNotification({
      id: notificationId,
      title: 'Your daily tip is here',
      message: tipBody,
      isSilent: false,
      isSummary: false
    });

    // Schedule digest in the evening if not already scheduled
    if (!this.digestScheduled) {
      this.scheduleEveningDigest();
      this.digestScheduled = true;
    }
  }

  private scheduleNotification({
    id,
    title,
    message,
    isSilent,
    isSummary
  }: {
    id: string;
    title: string;
    message: string;
    isSilent: boolean;
    isSummary: boolean;
  }) {
    // For silent notifications, schedule immediately with a short delay
    if (isSilent) {
      scheduleLocalNotification(
        id,
        title,
        message,
        new Date(Date.now() + 1000) // 1 second from now
      );
      return;
    }

    // For regular notifications, schedule with the current time
    scheduleLocalNotification(
      id,
      title,
      message,
      new Date()
    );

    // Set up the notification's user info for handling taps
    const userInfo = {
      id,
      type: isSummary ? 'digest' : 'daily_tip',
      timestamp: Date.now(),
      isSilent: isSilent ? '1' : '0',
      isSummary: isSummary ? '1' : '0',
      threadId: NOTIFICATION_THREAD_ID,
      groupId: NOTIFICATION_GROUP_ID,
    };
  }

  private async scheduleEveningDigest() {
    if (this.pendingTips.length <= 1) {
      // No need for digest if there's only one or no tips
      return;
    }

    // Schedule digest for 8 PM
    const now = new Date();
    const eveningTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      20, // 8 PM
      0,
      0
    );

    // If it's already past 8 PM, schedule for next day
    if (now > eveningTime) {
      eveningTime.setDate(eveningTime.getDate() + 1);
    }

    const digestId = `digest_${eveningTime.getTime()}`;
    
    this.scheduleNotification({
      id: digestId,
      title: `${this.pendingTips.length} new tips today`,
      message: 'Check out your daily farming tips',
      isSilent: false,
      isSummary: true
    });
  }

  private handleNotificationTap(notification: any) {
    const { userInfo } = notification;
    
    // This method is kept for backward compatibility
    // The actual navigation is handled in the PushNotifications config's onNotification handler
    console.log('Notification tapped:', userInfo);
  }

  public async sendSilentPushPrefetch(tipId: string, content: string) {
    // This would be called from your backend when sending a push notification
    // The actual implementation would depend on your push notification service
    console.log('Silent push received for prefetching tip:', tipId);
    // Prefetch the tip content here
  }

  public async checkForNewTips() {
    // This would be called when the app is opened to check for any new tips
    // that might have been missed
    console.log('Checking for new tips...');
    // Implementation depends on your backend
  }

  public async resetDailyTips() {
    // Reset at midnight or when needed
    this.pendingTips = [];
    this.digestScheduled = false;
    cancelAllScheduledNotifications();
  }
}

export default DailyTipsNotificationService.getInstance();
