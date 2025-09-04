import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';

type TipDetailScreenProps = StackScreenProps<RootStackParamList, 'TipDetail'>;

const TipDetailScreen: React.FC<TipDetailScreenProps> = ({ route }) => {
  const { tipId } = route.params;
  
  // In a real app, you would fetch the tip details using the tipId
  // For now, we'll use mock data
  const tip = {
    id: tipId,
    title: 'Maximizing Crop Yield',
    content: 'Here are some detailed tips on how to maximize your crop yield...',
    image: 'https://example.com/tip-image.jpg',
    date: new Date().toLocaleDateString(),
    category: 'Farming Tips'
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: tip.image }} 
          style={styles.image} 
          resizeMode="cover"
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.category}>{tip.category}</Text>
        <Text style={styles.title}>{tip.title}</Text>
        <Text style={styles.date}>{tip.date}</Text>
        <Text style={styles.body}>{tip.content}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    height: 250,
    width: '100%',
  },
  image: {
    flex: 1,
    width: '100%',
  },
  content: {
    padding: 20,
  },
  category: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});

export default TipDetailScreen;
