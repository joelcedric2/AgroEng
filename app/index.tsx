import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function Index() {
  useEffect(() => {
    // Redirect to onboarding on app start
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Loading AgroEng AI...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 18,
    color: '#22c55e',
    fontWeight: '600',
  },
});