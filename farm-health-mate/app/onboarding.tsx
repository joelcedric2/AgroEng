import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Welcome to Farm Health Mate',
    description: 'Your AI-powered companion for crop health monitoring and agricultural insights.',
    icon: 'leaf-outline' as const,
  },
  {
    id: 2,
    title: 'Smart Crop Analysis',
    description: 'Take photos of your crops and get instant AI-powered health assessments and recommendations.',
    icon: 'camera-outline' as const,
  },
  {
    id: 3,
    title: 'Expert Guidance',
    description: 'Access personalized tips, treatment suggestions, and best practices for optimal crop health.',
    icon: 'bulb-outline' as const,
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = new Animated.Value(1);

  const nextSlide = () => {
    if (currentSlide < onboardingData.length - 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      setCurrentSlide(currentSlide + 1);
    } else {
      router.replace('/auth');
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      setCurrentSlide(currentSlide - 1);
    }
  };

  const skipOnboarding = () => {
    router.replace('/auth');
  };

  const goToSlide = (index: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    setCurrentSlide(index);
  };

  const currentData = onboardingData[currentSlide];

  return (
    <LinearGradient colors={['#22c55e', '#16a34a']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Skip Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={skipOnboarding} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.iconContainer}>
            <Ionicons name={currentData.icon} size={80} color="white" />
          </View>
          
          <Text style={styles.title}>{currentData.title}</Text>
          <Text style={styles.description}>{currentData.description}</Text>
        </Animated.View>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => goToSlide(index)}
              style={[
                styles.dot,
                index === currentSlide ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigation}>
          <TouchableOpacity
            onPress={prevSlide}
            style={[
              styles.navButton,
              currentSlide === 0 ? styles.disabledButton : styles.enabledButton,
            ]}
            disabled={currentSlide === 0}
          >
            <Text style={[
              styles.navButtonText,
              currentSlide === 0 ? styles.disabledText : styles.enabledText,
            ]}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={nextSlide} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>
              {currentSlide === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'flex-end',
    paddingTop: 20,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 40,
    padding: 20,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'white',
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 1,
  },
  enabledButton: {
    borderColor: 'white',
  },
  disabledButton: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  enabledText: {
    color: 'white',
  },
  disabledText: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  nextButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  nextButtonText: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: '600',
  },
});