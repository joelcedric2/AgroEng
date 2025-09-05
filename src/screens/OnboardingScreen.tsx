import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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

const OnboardingScreen = ({ navigation }: any) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = new Animated.Value(1);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
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
      navigation.navigate('Auth');
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

  const goToSlide = (index: number) => {
    if (index !== currentSlide) {
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
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      <View style={styles.content}>
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

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => goToSlide(index)}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentSlide ? '#22c55e' : '#d1d5db',
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
            <Text style={styles.navButtonText}>←</Text>
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
                {currentSlide === slides.length - 1 ? 'Get Started' : 'Next →'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Auth')}
            style={styles.skipButton}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
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
    color: '#6b7280',
    textAlign: 'center',
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 40,
  },
  slideCard: {
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  slideContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  slideIcon: {
    fontSize: 40,
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
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevButton: {
    backgroundColor: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  navButtonText: {
    fontSize: 20,
    color: '#374151',
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    marginHorizontal: 16,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default OnboardingScreen;