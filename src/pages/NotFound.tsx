import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

interface NotFoundProps {
  navigation?: any;
}

const NotFound = ({ navigation }: NotFoundProps) => {
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route"
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>Oops! Page not found</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation?.navigate('Home') || navigation?.goBack()}
        >
          <Text style={styles.buttonText}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default NotFound;