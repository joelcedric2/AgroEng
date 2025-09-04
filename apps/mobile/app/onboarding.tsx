import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LoginModal } from '../components/LoginModal';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Plant Disease Detection',
    description: 'Identify plant diseases quickly and accurately with our AI-powered scanner.',
    image: require('../assets/onboarding1.png'),
  },
  {
    id: '2',
    title: 'Expert Treatment Plans',
    description: 'Get personalized treatment recommendations for your plants.',
    image: require('../assets/onboarding2.png'),
  },
  {
    id: '3',
    title: 'Grow Your Knowledge',
    description: 'Learn how to care for your plants and prevent diseases.',
    image: require('../assets/onboarding3.png'),
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // On last slide, show login modal
      setShowLoginModal(true);
    }
  };

  const handleSkip = () => {
    // Skip to the end and show login modal
    setCurrentIndex(slides.length - 1);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Navigate to the main app
    router.replace('/(tabs)');
  };

  const handleGuestContinue = () => {
    // Continue as guest
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        scrollEventThrottle={16}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <View style={styles.imageContainer}>
              <Image 
                source={slide.image} 
                style={styles.image} 
                resizeMode="contain"
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.paginationDot, 
              index === currentIndex && styles.paginationDotActive
            ]} 
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />
        </TouchableOpacity>

        {currentIndex < slides.length - 1 && (
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={handleSkip}
          >
            <Text style={[styles.buttonText, { color: '#4CAF50' }]}>Skip</Text>
          </TouchableOpacity>
        )}

        {currentIndex === slides.length - 1 && (
          <TouchableOpacity 
            style={[styles.button, styles.guestButton]} 
            onPress={handleGuestContinue}
          >
            <Text style={[styles.buttonText, { color: '#666' }]}>Continue as Guest</Text>
          </TouchableOpacity>
        )}
      </View>

      <LoginModal 
        visible={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
        showSignUpLink={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  imageContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
  },
  textContainer: {
    flex: 0.4,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 180,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: '#4CAF50',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
  },
  guestButton: {
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 10,
  },
});
