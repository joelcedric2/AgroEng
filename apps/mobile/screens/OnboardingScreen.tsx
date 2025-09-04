import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GuestStackParamList } from '../navigation/GuestStack';

const { width, height } = Dimensions.get('window');

type OnboardingScreenNavigationProp = StackNavigationProp<GuestStackParamList, 'Onboarding'>;

export function OnboardingScreen() {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();

  const handleGetStarted = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/onboarding.png')} // Make sure to add this image to your assets
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to AgroEng</Text>
        <Text style={styles.subtitle}>
          Your personal agricultural assistant for plant disease detection and crop management
        </Text>
      </View>
      <View style={styles.footer}>
        <Button 
          mode="contained" 
          onPress={handleGetStarted}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Get Started
        </Button>
        <Button 
          onPress={() => navigation.navigate('Login')}
          style={styles.secondaryButton}
          labelStyle={styles.secondaryButtonLabel}
        >
          I already have an account
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  footer: {
    paddingBottom: 40,
    width: '100%',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButton: {
    marginTop: 8,
  },
  secondaryButtonLabel: {
    color: '#4CAF50',
    fontSize: 14,
  },
});
