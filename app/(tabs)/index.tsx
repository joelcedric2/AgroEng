import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const quickTips = [
  "Avoid watering leaves to prevent fungal infections.",
  "Rotate your crops every season for better soil health.",
  "Check plants early morning for pest activity.",
  "Ensure good air circulation between plants.",
  "Water deeply but less frequently for stronger roots."
];

export default function HomeScreen() {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % quickTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>Farmer!</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={32} color="#22c55e" />
          </TouchableOpacity>
        </View>

        {/* Main Action Card */}
        <LinearGradient
          colors={['#22c55e', '#16a34a']}
          style={styles.mainActionCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.mainActionContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="camera" size={32} color="#ffffff" />
            </View>
            <Text style={styles.mainActionTitle}>Diagnose Your Plants</Text>
            <Text style={styles.mainActionDescription}>
              Take a photo to identify diseases and get treatment recommendations
            </Text>
            <TouchableOpacity 
              style={styles.mainActionButton}
              onPress={() => router.push('/(tabs)/camera')}
            >
              <Text style={styles.mainActionButtonText}>Take a Picture</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Total Scans</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#22c55e' }]}>8</Text>
            <Text style={styles.statLabel}>Healthy</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#f59e0b' }]}>4</Text>
            <Text style={styles.statLabel}>Issues Found</Text>
          </View>
        </View>

        {/* Daily Tip */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <View style={styles.tipIconContainer}>
              <Ionicons name="bulb" size={20} color="#f59e0b" />
            </View>
            <Text style={styles.tipTitle}>Daily Tip</Text>
          </View>
          <Text style={styles.tipContent}>{quickTips[currentTip]}</Text>
          <View style={styles.tipDots}>
            {quickTips.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.tipDot,
                  { backgroundColor: index === currentTip ? '#f59e0b' : '#d1d5db' }
                ]}
              />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/(tabs)/history')}
          >
            <Ionicons name="time-outline" size={24} color="#22c55e" />
            <Text style={styles.quickActionText}>View History</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/(tabs)/tips')}
          >
            <Ionicons name="book-outline" size={24} color="#22c55e" />
            <Text style={styles.quickActionText}>Learn Tips</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6b7280',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  profileButton: {
    padding: 4,
  },
  mainActionCard: {
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  mainActionContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  mainActionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  mainActionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  mainActionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  mainActionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  tipContent: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  tipDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  quickActionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 12,
    color: '#1f2937',
    marginTop: 8,
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 20,
  },
});