import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert,
  Switch,
  ActivityIndicator,
  Linking,
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

type MenuItem = {
  id: string;
  title: string;
  icon: any;
  type: 'link' | 'toggle' | 'button';
  screen?: string;
  onPress?: () => void;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  isDanger?: boolean;
};

export function ProfileScreen() {
  const navigation = useNavigation();
  const { user, isGuest, signOut, subscription, refreshUser } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Refresh user data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshUser();
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await signOut();
              // Navigation is handled by the auth state change in AuthContext
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  // Handle subscription management
  const handleManageSubscription = () => {
    if (isGuest) {
      navigation.navigate('SignUp');
      return;
    }
    
    if (subscription?.status === 'active') {
      // In a real app, this would open a web view or deep link to your subscription management page
      Alert.alert(
        'Manage Subscription',
        'You will be redirected to manage your subscription.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Continue', 
            onPress: () => {
              // This would be your subscription management URL
              Linking.openURL('https://yourapp.com/account/subscription');
            }
          },
        ]
      );
    } else {
      navigation.navigate('Upgrade');
    }
  };

  // Menu items configuration
  const menuItems: MenuItem[] = [
    {
      id: 'account',
      title: 'Account Settings',
      icon: require('../../assets/icons/user.png'),
      type: 'link',
      screen: 'AccountSettings',
      onPress: () => {
        if (isGuest) {
          navigation.navigate('Login');
        } else {
          navigation.navigate('AccountSettings');
        }
      },
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: require('../../assets/icons/bell.png'),
      type: 'toggle',
      value: notificationsEnabled,
      onValueChange: (value) => setNotificationsEnabled(value),
    },
    {
      id: 'appearance',
      title: 'Dark Mode',
      icon: require('../../assets/icons/moon.png'),
      type: 'toggle',
      value: darkMode,
      onValueChange: (value) => setDarkMode(value),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: require('../../assets/icons/help-circle.png'),
      type: 'link',
      screen: 'Help',
    },
    {
      id: 'about',
      title: 'About AgroEng',
      icon: require('../../assets/icons/info.png'),
      type: 'link',
      screen: 'About',
    },
    {
      id: 'rate',
      title: 'Rate the App',
      icon: require('../../assets/icons/star.png'),
      type: 'button',
      onPress: () => {
        // In a real app, this would link to the app store
        Alert.alert('Rate Us', 'Thank you for using AgroEng! Please rate us on the App Store.');
      },
    },
    {
      id: 'signOut',
      title: 'Sign Out',
      icon: require('../../assets/icons/log-out.png'),
      type: 'button',
      onPress: handleSignOut,
      isDanger: true,
    },
  ];

  // Filter menu items based on user state
  const filteredMenuItems = isGuest 
    ? menuItems.filter(item => item.id !== 'subscription' && item.id !== 'signOut')
    : menuItems;

  // Render menu item based on type
  const renderMenuItem = (item: MenuItem) => {
    switch (item.type) {
      case 'link':
        return (
          <TouchableOpacity 
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
            disabled={isLoading}
          >
            <View style={styles.menuItemLeft}>
              <Image 
                source={item.icon} 
                style={[
                  styles.menuIcon, 
                  item.isDanger && styles.dangerIcon
                ]} 
              />
              <Text 
                style={[
                  styles.menuText,
                  item.isDanger && styles.dangerText
                ]}
              >
                {item.title}
              </Text>
            </View>
            <Image 
              source={require('../../assets/icons/chevron-right.png')} 
              style={styles.chevronIcon} 
            />
          </TouchableOpacity>
        );
      
      case 'toggle':
        return (
          <View key={item.id} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Image 
                source={item.icon} 
                style={styles.menuIcon} 
              />
              <Text style={styles.menuText}>{item.title}</Text>
            </View>
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ false: '#E0E0E0', true: '#81C784' }}
              thumbColor="#fff"
            />
          </View>
        );
      
      case 'button':
        return (
          <TouchableOpacity 
            key={item.id}
            style={[
              styles.menuItem,
              styles.buttonMenuItem,
              item.isDanger && styles.dangerButton
            ]}
            onPress={item.onPress}
            disabled={isLoading}
          >
            <View style={styles.menuItemLeft}>
              <Image 
                source={item.icon} 
                style={[
                  styles.menuIcon, 
                  item.isDanger && styles.dangerIcon
                ]} 
              />
              <Text 
                style={[
                  styles.menuText,
                  item.isDanger && styles.dangerText
                ]}
              >
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
          {!isGuest && subscription?.status === 'active' && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>PRO</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.userName}>
          {isGuest 
            ? 'Guest User' 
            : user?.full_name || user?.email?.split('@')[0] || 'User'
          }
        </Text>
        
        <Text style={styles.userEmail}>
          {isGuest ? 'guest@example.com' : user?.email}
        </Text>
        
        <TouchableOpacity 
          style={[
            styles.upgradeButton,
            subscription?.status === 'active' && styles.manageButton
          ]}
          onPress={handleManageSubscription}
          disabled={isLoading}
        >
          <Text style={styles.upgradeButtonText}>
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>PRO</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.userName}>
            {isGuest 
              ? 'Guest User' 
              : user?.full_name || user?.email?.split('@')[0] || 'User'
            }
          </Text>
          
          <Text style={styles.userEmail}>
            {isGuest ? 'guest@example.com' : user?.email}
          </Text>
          
          <TouchableOpacity 
            style={[
              styles.upgradeButton,
              subscription?.status === 'active' && styles.manageButton
            ]}
            onPress={handleManageSubscription}
            disabled={isLoading}
          >
            <Text style={styles.upgradeButtonText}>
              {isGuest 
                ? 'Sign Up for Free' 
                : subscription?.status === 'active' 
                  ? 'Manage Subscription' 
                  : 'Upgrade to Pro'
              }
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuContainer}>
            {filteredMenuItems
              .filter(item => !['signOut', 'rate'].includes(item.id))
              .map(renderMenuItem)
            }
          </View>
        </View>
        
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>More</Text>
          <View style={styles.menuContainer}>
            {filteredMenuItems
              .filter(item => ['rate', 'signOut'].includes(item.id))
              .map(renderMenuItem)
            }
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.versionText}>AgroEng v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2025 AgroEng. All rights reserved.</Text>
        </View>
      </ScrollView>
      
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#E0E0E0',
  },
  premiumBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFC107',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    minWidth: 200,
    alignItems: 'center',
  },
  manageButton: {
    backgroundColor: '#2196F3',
  },
  upgradeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  menuSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9E9E9E',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  buttonMenuItem: {
    justifyContent: 'flex-start',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 22,
    height: 22,
    tintColor: '#757575',
    marginRight: 16,
  },
  dangerIcon: {
    tintColor: '#F44336',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  dangerText: {
    color: '#F44336',
  },
  chevronIcon: {
    width: 16,
    height: 16,
    tintColor: '#BDBDBD',
  },
  dangerButton: {
    borderBottomWidth: 0,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#9E9E9E',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: '#BDBDBD',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
