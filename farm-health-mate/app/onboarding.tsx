import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface Slide {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  gradient: string[];
}

const slides: Slide[] = [
  {
    icon: 'camera-outline',
    title: 'Snap. Compare. Save Your Crops.',
    description: 'Take a photo of any plant or crop to get instant health insights powered by AI.',
    gradient: ['#22c55e', '#16a34a']
  },
  {
    icon: 'search-outline',
    title: 'AI diagnoses issues instantly & recommends solutions.',
    description: 'See side-by-side comparisons with healthy plants and get expert recommendations.',
    gradient: ['#3b82f6', '#1d4ed8']
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Protect your yield. Anytime. Anywhere.',
    description: 'Works offline with multilingual support. Your farming assistant is always ready.',
    gradient: ['#10b981', '#059669']
  }
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      const nextIndex = currentSlide + 1;
      
      // Fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentSlide(nextIndex);
        scrollViewRef.current?.scrollTo({
          x: nextIndex * width,
          animated: false,
        });
        
        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
      router.replace('/auth');
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      const prevIndex = currentSlide - 1;
      
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentSlide(prevIndex);
        scrollViewRef.current?.scrollTo({
          x: prevIndex * width,
          animated: false,
        });
        
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const goToSlide = (index: number) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setCurrentSlide(index);
      scrollViewRef.current?.scrollTo({
        x: index * width,
        animated: false,
      });
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const currentSlideData = slides[currentSlide];

  return (
    <LinearGradient
      colors={['#f8fafc', '#e2e8f0']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>AgroEng AI</Text>
          <Text style={styles.appSubtitle}>Your Smart Farming Assistant</Text>
        </View>

        {/* Slide Content */}
        <Animated.View style={[styles.slideContainer, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={currentSlideData.gradient}
            style={styles.slideCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <Ionicons 
                  name={currentSlideData.icon} 
                  size={48} 
                  color="#ffffff" 
                />
              </View>
            </View>
            
            <Text style={styles.slideTitle}>
              {currentSlideData.title}
            </Text>
            
            <Text style={styles.slideDescription}>
              {currentSlideData.description}
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => goToSlide(index)}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentSlide ? '#22c55e' : '#cbd5e1',
                  transform: [{ scale: index === currentSlide ? 1.2 : 1 }]
                }
              ]}
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
          >
            <Ionicons name="chevron-back" size={24} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={nextSlide}
            style={[styles.navButton, styles.nextButton]}
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
                <Ionicons name="chevron-forward" size={20} color="#ffffff" />
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace('/auth')}
            style={styles.skipButton}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
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
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  slideCard: {
    width: width - 48,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  slideDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
    transition: 'all 0.3s ease',
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  nextButton: {
    flex: 1,
    marginHorizontal: 16,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
});