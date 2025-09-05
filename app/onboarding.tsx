import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface Slide {
  icon: string;
  title: string;
  description: string;
  gradient: string[];
}

const slides: Slide[] = [
  {
    icon: "📷",
    title: "Snap. Compare. Save Your Crops.",
    description: "Take a photo of any plant or crop to get instant health insights powered by AI.",
    gradient: ['#22c55e', '#16a34a']
  },
  {
    icon: "🔍", 
    title: "AI diagnoses issues instantly & recommends solutions.",
    description: "See side-by-side comparisons with healthy plants and get expert recommendations.",
    gradient: ['#16a34a', '#15803d']
  },
  {
    icon: "🛡️",
    title: "Protect your yield. Anytime. Anywhere.", 
    description: "Works offline with multilingual support. Your farming assistant is always ready.",
    gradient: ['#15803d', '#22c55e']
  }
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = new Animated.Value(1);

  const animateSlideChange = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    setTimeout(callback, 200);
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      animateSlideChange(() => setCurrentSlide(currentSlide + 1));
    } else {
      router.push('/auth');
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      animateSlideChange(() => setCurrentSlide(currentSlide - 1));
    }
  };

  const goToSlide = (index: number) => {
    if (index !== currentSlide) {
      animateSlideChange(() => setCurrentSlide(index));
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#f1f5f9" />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>AgroEng AI</Text>
          <Text style={styles.appSubtitle}>Your Smart Farming Assistant</Text>
        </View>

        {/* Slide Content */}
        <View style={styles.slideContainer}>
          <Animated.View style={[styles.slideWrapper, { opacity: fadeAnim }]}>
            <LinearGradient
              colors={currentSlideData.gradient}
              style={styles.slideCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.slideContent}>
                <View style={styles.iconContainer}>
                  <Text style={styles.slideIcon}>{currentSlideData.icon}</Text>
                </View>
                
                <Text style={styles.slideTitle}>{currentSlideData.title}</Text>
                
                <Text style={styles.slideDescription}>
                  {currentSlideData.description}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => goToSlide(index)}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentSlide ? '#22c55e' : 'rgba(107, 114, 128, 0.3)',
                  transform: [{ scale: index === currentSlide ? 1.3 : 1 }]
                }
              ]}
              activeOpacity={0.7}
            />
          ))}
        </View>

        {/* Navigation */}
        <View style={styles.navigation}>
          <TouchableOpacity
            onPress={prevSlide}
            disabled={currentSlide === 0}
            style={[
              styles.navButton,
              styles.prevButton,
              { opacity: currentSlide === 0 ? 0.3 : 1 }
            ]}
            activeOpacity={0.7}
          >
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={nextSlide}
            style={styles.nextButton}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#22c55e', '#16a34a']}
              style={styles.nextButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.nextButtonText}>
                {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
              </Text>
              {currentSlide < slides.length - 1 && (
                <Text style={styles.nextArrow}> ›</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/auth')}
            style={styles.skipButton}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  slideWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  slideCard: {
    borderRadius: 24,
    padding: 40,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
    minHeight: 400,
    justifyContent: 'center',
  },
  slideContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  slideIcon: {
    fontSize: 48,
  },
  slideTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 34,
    paddingHorizontal: 8,
  },
  slideDescription: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 8,
    fontWeight: '400',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
    transition: 'all 0.3s ease',
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  navButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  prevButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  navButtonText: {
    fontSize: 24,
    color: '#475569',
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    marginHorizontal: 16,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  nextArrow: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 4,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
});