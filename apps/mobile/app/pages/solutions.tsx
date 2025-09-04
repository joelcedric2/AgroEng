import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type Solution = {
  id: string;
  title: string;
  description: string;
  steps: string[];
  prevention: string[];
};

const solutions: Solution[] = [
  {
    id: 'early-blight',
    title: 'Early Blight in Tomatoes',
    description: 'Fungal disease causing dark spots with concentric rings on leaves',
    steps: [
      'Remove and destroy infected leaves immediately',
      'Apply copper-based fungicides every 7-10 days',
      'Water at the base of plants to keep foliage dry',
      'Improve air circulation around plants',
      'Rotate crops annually to prevent soil-borne pathogens'
    ],
    prevention: [
      'Use disease-resistant varieties',
      'Space plants properly for good air circulation',
      'Water in the morning to allow leaves to dry',
      'Mulch around plants to prevent soil splash',
      'Disinfect tools between uses'
    ]
  },
  {
    id: 'late-blight',
    title: 'Late Blight',
    description: 'Destructive disease causing rapid plant collapse',
    steps: [
      'Remove and destroy infected plants immediately',
      'Apply appropriate fungicides preventatively',
      'Avoid overhead watering',
      'Improve air circulation'
    ],
    prevention: [
      'Use certified disease-free seeds',
      'Practice crop rotation',
      'Keep garden clean of plant debris'
    ]
  }
];

export default function Solutions() {
  const navigation = useNavigation();

  const handleSolutionPress = (solution: Solution) => {
    // @ts-ignore - Navigation type issue
    navigation.navigate('solution-detail', { solution });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Plant Disease Solutions</Text>
      <ScrollView style={styles.scrollView}>
        {solutions.map((solution) => (
          <TouchableOpacity 
            key={solution.id} 
            style={styles.card}
            onPress={() => handleSolutionPress(solution)}
          >
            <Text style={styles.title}>{solution.title}</Text>
            <Text style={styles.description}>{solution.description}</Text>
            <Text style={styles.moreInfo}>Tap for detailed solution →</Text>
          </TouchableOpacity>
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
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  moreInfo: {
    fontSize: 14,
    color: '#2E7D32',
    fontStyle: 'italic',
    textAlign: 'right',
  },
});
