import { View, Text, StyleSheet, Button } from 'react-native';
import { Stack } from 'expo-router';

export default function Onboarding() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Welcome' }} />
      <Text style={styles.title}>Welcome to AgroEng</Text>
      <Text style={styles.subtitle}>Your agricultural companion for crop health and management</Text>
      {/* Add your onboarding content here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});
