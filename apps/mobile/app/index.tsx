import { View, Text, StyleSheet, Button } from 'react-native';
import { useState } from 'react';

export default function HomeScreen() {
  const [count, setCount] = useState(0);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 AgroEng</Text>
      <Text style={styles.subtitle}>Expo Go Test</Text>
      <Text style={styles.count}>Count: {count}</Text>
      <Button 
        title="Increment" 
        onPress={() => setCount(c => c + 1)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  count: {
    fontSize: 24,
    marginVertical: 20,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

