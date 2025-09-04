import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GuestStackParamList } from '../navigation/GuestStack';
import { useAuth } from '../contexts/AuthContext';

type HomeScreenNavigationProp = StackNavigationProp<GuestStackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user, isGuest, guestFeatures } = useAuth();

  const features = [
    {
      id: 'scan',
      title: 'Scan Plant',
      description: 'Scan a plant to detect diseases',
      icon: require('../../assets/scan-icon.png'),
      screen: 'Scan',
      requiresAuth: false,
    },
    {
      id: 'history',
      title: 'My History',
      description: 'View your scan history',
      icon: require('../../assets/history-icon.png'),
      screen: 'History',
      requiresAuth: true,
    },
    {
      id: 'tips',
      title: 'Daily Tips',
      description: 'Get agricultural tips and advice',
      icon: require('../../assets/tips-icon.png'),
      screen: 'Tips',
      requiresAuth: false,
    },
  ];

  const handleFeaturePress = (feature: typeof features[0]) => {
    if (feature.requiresAuth && isGuest) {
      // Show login prompt or limit reached message
      if (feature.id === 'scan' && !guestFeatures.canPerformAction('scan')) {
        // Show paywall or upgrade prompt
        navigation.navigate('Login', { showUpgradePrompt: true });
        return;
      }
      navigation.navigate('Login');
      return;
    }
    
    // Navigate to the feature screen
    // @ts-ignore - We know the screen exists
    navigation.navigate(feature.screen);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {isGuest ? 'Hello, Guest' : `Hello, ${user?.email?.split('@')[0] || 'User'}`}
        </Text>
        {isGuest && (
          <Text style={styles.remainingScans}>
            {guestFeatures.remainingScans} scans remaining
          </Text>
        )}
      </View>

      <View style={styles.featuresContainer}>
        {features.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            style={styles.featureCard}
            onPress={() => handleFeaturePress(feature)}
            disabled={feature.id === 'scan' && isGuest && !guestFeatures.canPerformAction('scan')}
          >
            <View style={styles.featureIconContainer}>
              <Image source={feature.icon} style={styles.featureIcon} />
            </View>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
            
            {feature.requiresAuth && isGuest && (
              <View style={styles.lockIcon}>
                <Image 
                  source={require('../../assets/lock-icon.png')} 
                  style={{ width: 16, height: 16 }}
                />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {isGuest && (
        <View style={styles.upgradeBanner}>
          <Text style={styles.upgradeText}>
            Unlock unlimited scans and advanced features
          </Text>
          <TouchableOpacity 
            style={styles.upgradeButton}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  remainingScans: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    width: 24,
    height: 24,
    tintColor: '#4CAF50',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
  },
  lockIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 4,
  },
  upgradeBanner: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upgradeText: {
    flex: 1,
    fontSize: 14,
    color: '#0D47A1',
    marginRight: 12,
  },
  upgradeButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  upgradeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
