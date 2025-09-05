import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

interface IndexProps {
  navigation?: any;
}

const Index = ({ navigation }: IndexProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Your Blank App</Text>
        <Text style={styles.subtitle}>Start building your amazing project here!</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default Index;