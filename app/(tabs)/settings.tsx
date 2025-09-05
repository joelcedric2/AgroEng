import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const languages = [
  { value: "english", label: "English" },
  { value: "french", label: "French" },
  { value: "hausa", label: "Hausa" },
  { value: "yoruba", label: "Yoruba" },
  { value: "igbo", label: "Igbo" },
  { value: "swahili", label: "Swahili" },
];

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [audioLanguage, setAudioLanguage] = useState('english');

  const handleLanguageChange = () => {
    Alert.alert(
      'Select Language',
      'Choose your preferred language',
      languages.map(lang => ({
        text: lang.label,
        onPress: () => {
          setSelectedLanguage(lang.value);
          Alert.alert('Language Updated', `Switched to ${lang.label}`);
        }
      }))
    );
  };

  const handleAudioLanguageChange = () => {
    Alert.alert(
      'Select Audio Language',
      'Choose your preferred audio language',
      languages.map(lang => ({
        text: lang.label,
        onPress: () => {
          setAudioLanguage(lang.value);
          Alert.alert('Audio Language Updated', `Audio set to ${lang.label}`);
        }
      }))
    );
  };

  const handleDownloadCache = () => {
    Alert.alert(
      'Download Cache',
      'This will download common crops for your region for offline use.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Download', 
          onPress: () => {
            Alert.alert('Cache Downloaded!', '10 most common crops are now available offline.');
          }
        }
      ]
    );
  };

  const settingsGroups = [
    {
      title: 'Profile',
      items: [
        {
          icon: 'person-outline',
          label: 'Edit Profile',
          description: 'Complete your farming profile',
          onPress: () => Alert.alert('Profile', 'Profile editing coming soon!'),
          showArrow: true
        }
      ]
    },
    {
      title: 'App Settings',
      items: [
        {
          icon: 'language-outline',
          label: 'Language',
          description: languages.find(lang => lang.value === selectedLanguage)?.label || 'English',
          onPress: handleLanguageChange,
          showArrow: true
        },
        {
          icon: 'volume-medium-outline',
          label: 'Audio Language',
          description: languages.find(lang => lang.value === audioLanguage)?.label || 'English',
          onPress: handleAudioLanguageChange,
          showArrow: true
        },
        {
          icon: 'moon-outline',
          label: 'Dark Mode',
          description: 'Switch to dark theme',
          control: (
            <Switch
              value={darkMode}
              onValueChange={(value) => {
                setDarkMode(value);
                Alert.alert('Theme Updated', `Switched to ${value ? 'dark' : 'light'} mode`);
              }}
              trackColor={{ false: '#e5e7eb', true: '#22c55e' }}
              thumbColor={darkMode ? '#ffffff' : '#f4f3f4'}
            />
          )
        },
        {
          icon: 'wifi-outline',
          label: 'Offline Mode',
          description: 'Cache content for offline use',
          control: (
            <Switch
              value={offlineMode}
              onValueChange={(value) => {
                setOfflineMode(value);
                Alert.alert(
                  value ? 'Offline Mode Enabled' : 'Offline Mode Disabled',
                  value ? 'Content will be cached for offline use' : 'Content will not be cached offline'
                );
              }}
              trackColor={{ false: '#e5e7eb', true: '#22c55e' }}
              thumbColor={offlineMode ? '#ffffff' : '#f4f3f4'}
            />
          )
        }
      ]
    },
    {
      title: 'Offline Features',
      items: [
        {
          icon: 'download-outline',
          label: 'Download Offline Cache',
          description: 'Download common crops for your region (0 MB)',
          onPress: handleDownloadCache,
          showArrow: false
        }
      ]
    },
    {
      title: 'Subscription',
      items: [
        {
          icon: 'card-outline',
          label: 'Upgrade to Premium',
          description: 'Unlimited scans, advanced features',
          onPress: () => Alert.alert('Premium Upgrade', 'Stripe integration coming soon!'),
          showArrow: true,
          highlight: true
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle-outline',
          label: 'Help & Support',
          description: 'FAQs, contact support',
          onPress: () => Alert.alert('Help & Support', 'Contact us at support@agroeng.ai'),
          showArrow: true
        },
        {
          icon: 'shield-outline',
          label: 'Privacy Policy',
          description: 'How we protect your data',
          onPress: () => Alert.alert('Privacy Policy', 'Your data is secure and never shared with third parties.'),
          showArrow: true
        }
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* User Info Header */}
        <LinearGradient
          colors={['#f0fdf4', '#dcfce7']}
          style={styles.userCard}
        >
          <View style={styles.userContent}>
            <View style={styles.userAvatar}>
              <Ionicons name="person" size={32} color="#22c55e" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Farmer</Text>
              <Text style={styles.userEmail}>farmer@example.com</Text>
              <View style={styles.userMeta}>
                <View style={styles.userMetaItem}>
                  <Ionicons name="location-outline" size={12} color="#6b7280" />
                  <Text style={styles.userMetaText}>Add location</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            
            <View style={styles.groupCard}>
              {group.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingsItem,
                    item.highlight && styles.highlightItem,
                    itemIndex === group.items.length - 1 && styles.lastItem
                  ]}
                  onPress={item.onPress}
                  disabled={!item.onPress}
                >
                  <View style={styles.itemLeft}>
                    <View style={[styles.itemIcon, item.highlight && styles.highlightIcon]}>
                      <Ionicons 
                        name={item.icon as any} 
                        size={20} 
                        color={item.highlight ? '#22c55e' : '#6b7280'} 
                      />
                    </View>
                    <View style={styles.itemText}>
                      <Text style={[styles.itemLabel, item.highlight && styles.highlightLabel]}>
                        {item.label}
                      </Text>
                      <Text style={styles.itemDescription}>{item.description}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.itemRight}>
                    {item.control}
                    {item.showArrow && (
                      <Ionicons name="chevron-forward" size={16} color="#6b7280" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appTitle}>AgroEng AI</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            Made with 💚 for farmers worldwide
          </Text>
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  userCard: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  userContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  userMetaText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  settingsGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  groupCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  highlightItem: {
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  highlightIcon: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  itemText: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  highlightLabel: {
    color: '#22c55e',
  },
  itemDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  appTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});