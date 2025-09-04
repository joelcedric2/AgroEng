import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GuestStackParamList } from '../navigation/GuestStack';
import { useAuth } from '../contexts/AuthContext';

type VerifyEmailScreenNavigationProp = StackNavigationProp<GuestStackParamList, 'VerifyEmail'>;
type VerifyEmailScreenRouteProp = RouteProp<GuestStackParamList, 'VerifyEmail'>;

export function VerifyEmailScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const navigation = useNavigation<VerifyEmailScreenNavigationProp>();
  const route = useRoute<VerifyEmailScreenRouteProp>();
  const { resendVerificationEmail } = useAuth();
  
  const email = route.params?.email || '';

  // Handle resend verification email
  const handleResendEmail = async () => {
    if (!email) return;
    
    setIsLoading(true);
    try {
      const { error } = await resendVerificationEmail(email);
      
      if (error) {
        Alert.alert('Error', error.message || 'Failed to resend verification email');
        return;
      }
      
      // Start countdown for resend button
      setResendDisabled(true);
      setCountdown(30);
      
      Alert.alert('Email Sent', 'Verification email has been resent. Please check your inbox.');
    } catch (error) {
      console.error('Resend verification error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Countdown timer for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendDisabled, countdown]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Image 
            source={require('../../assets/email-verified.png')} 
            style={styles.icon}
          />
        </View>
        
        <Text style={styles.title}>Verify Your Email</Text>
        
        <Text style={styles.subtitle}>
          We've sent a verification link to
        </Text>
        
        <Text style={styles.emailText}>
          {email}
        </Text>
        
        <Text style={styles.instructions}>
          Please check your email and click the verification link to activate your account.
        </Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.didntReceiveText}>
          Didn't receive the email?
        </Text>
        
        <TouchableOpacity 
          style={[
            styles.resendButton, 
            (isLoading || resendDisabled) && styles.resendButtonDisabled
          ]}
          onPress={handleResendEmail}
          disabled={isLoading || resendDisabled}
        >
          {isLoading ? (
            <ActivityIndicator color="#1976D2" size="small" />
          ) : (
            <Text style={styles.resendButtonText}>
              {resendDisabled ? `Resend in ${countdown}s` : 'Resend Verification Email'}
            </Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already verified? 
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: '#1976D2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 24,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    width: '100%',
    marginVertical: 24,
  },
  didntReceiveText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  resendButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1976D2',
    marginBottom: 24,
    minWidth: 200,
    alignItems: 'center',
  },
  resendButtonDisabled: {
    borderColor: '#BBDEFB',
  },
  resendButtonText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  signInLink: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});
