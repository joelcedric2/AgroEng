import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const tips = [
  {
    id: '1',
    title: 'Watering Tips',
    description: 'Water your plants in the morning to reduce evaporation and prevent fungal diseases.',
    image: require('../../assets/images/watering.jpg')
  },
  {
    id: '2',
    title: 'Soil Health',
    description: 'Regularly add compost to improve soil structure and provide essential nutrients.',
    image: require('../../assets/images/soil.jpg')
  },
  {
    id: '3',
    title: 'Pest Control',
    description: 'Use companion planting to naturally deter pests from your garden.',
    image: require('../../assets/images/pest-control.jpg')
  },
  {
    id: '4',
    title: 'Pruning',
    description: 'Regular pruning helps plants grow stronger and produce more fruits and flowers.',
    image: require('../../assets/images/pruning.jpg')
  },
  {
    id: '5',
    title: 'Seasonal Planting',
    description: 'Plant crops according to their growing seasons for optimal growth and yield.',
    image: require('../../assets/images/seasonal.jpg')
  }
];

export default function Tips() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gardening Tips</Text>
      <ScrollView style={styles.scrollView}>
        {tips.map((tip) => (
          <View key={tip.id} style={styles.tipCard}>
            <View style={styles.imageContainer}>
              <Image 
                source={tip.image} 
                style={styles.image} 
                resizeMode="cover"
              />
            </View>
            <View style={styles.content}>
              <Text style={styles.title}>{tip.title}</Text>
              <Text style={styles.description}>{tip.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    height: 150,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});
