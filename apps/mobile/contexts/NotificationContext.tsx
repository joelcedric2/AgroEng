import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';
import DailyTipsNotificationService from '../services/DailyTipsNotificationService';
import DailyTipBanner from '../components/DailyTipBanner';

type TipNotification = {
  id: string;
  title: string;
  body: string;
};

type NotificationContextType = {
  showTipBanner: (tip: TipNotification) => void;
  dismissTipBanner: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTip, setCurrentTip] = useState<TipNotification | null>(null);
  const [notificationService] = useState(() => DailyTipsNotificationService);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Initialize notification service
    notificationService.checkForNewTips();
    
    // Set up daily reset
    setupDailyReset();
    
    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: string) => {
    if (nextAppState === 'active') {
      notificationService.checkForNewTips();
    }
  };

  const setupDailyReset = () => {
    // Reset at midnight
    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1, // Next day
      0, 0, 0 // Midnight
    );
    
    const timeUntilMidnight = midnight.getTime() - now.getTime();
    
    const resetTimer = setTimeout(() => {
      notificationService.resetDailyTips();
      // Set up the next day's reset
      setupDailyReset();
    }, timeUntilMidnight);
    
    return () => clearTimeout(resetTimer);
  };

  const showTipBanner = (tip: TipNotification) => {
    setCurrentTip(tip);
  };

  const dismissTipBanner = () => {
    setCurrentTip(null);
  };

  return (
    <NotificationContext.Provider value={{ showTipBanner, dismissTipBanner }}>
      {children}
      <DailyTipBanner 
        tip={currentTip}
        onDismiss={dismissTipBanner}
      />
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
