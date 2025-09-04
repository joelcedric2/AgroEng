import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  showSignUpLink?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  visible,
  onClose,
  onSuccess,
  showSignUpLink = true,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { signIn, signUp, convertToFullUser, isGuest } = useAuth();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let result;
      
      if (isSignUp) {
        result = await signUp(email, password);
        if (!result.error) {
          setSuccessMessage('Account created! Please check your email to verify your account.');
          setTimeout(() => {
            setIsSignUp(false);
            setSuccessMessage(null);
          }, 3000);
          return;
        }
      } else if (isGuest) {
        // Convert guest to full user
        result = await convertToFullUser(email, password);
        if (!result.error) {
          setSuccessMessage('Account upgraded successfully!');
          onSuccess?.();
          setTimeout(onClose, 1500);
          return;
        }
      } else {
        // Regular login
        result = await signIn(email, password);
        if (!result.error) {
          onSuccess?.();
          setTimeout(onClose, 500);
          return;
        }
      }

      if (result.error) {
        setError(result.error.message || 'An error occurred');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>
            {isGuest && !isSignUp ? 'Create an Account' : isSignUp ? 'Sign Up' : 'Sign In'}
          </Text>
          
          {error && <Text style={styles.errorText}>{error}</Text>}
          {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#999"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />
          
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isGuest && !isSignUp ? 'Create Account' : isSignUp ? 'Sign Up' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>
          
          {showSignUpLink && (
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setIsSignUp(!isSignUp)}
            >
              <Text style={styles.toggleText}>
                {isSignUp 
                  ? 'Already have an account? Sign In' 
                  : isGuest
                    ? 'Already have an account? Sign In'
                    : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleButton: {
    marginTop: 15,
  },
  toggleText: {
    color: '#4CAF50',
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: '#f44336',
    marginBottom: 15,
    textAlign: 'center',
  },
  successText: {
    color: '#4CAF50',
    marginBottom: 15,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#999',
  },
});
