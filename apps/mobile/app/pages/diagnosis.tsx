import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Diagnosis() {
  const { id } = useLocalSearchParams();
  
  // This would normally come from an API call using the id
  const diagnosis = {
    id: id || '1',
    plantName: 'Tomato Plant',
    disease: 'Early Blight',
    confidence: '92%',
    date: '2023-11-15',
    symptoms: [
      'Dark spots with concentric rings on leaves',
      'Yellowing of lower leaves',
      'Premature leaf drop'
    ],
    treatment: [
      'Remove and destroy infected leaves',
      'Apply copper-based fungicides',
      'Improve air circulation',
      'Water at the base of plants'
    ]
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.plantName}>{diagnosis.plantName}</Text>
        <Text style={styles.disease}>{diagnosis.disease}</Text>
        <Text style={styles.confidence}>Confidence: {diagnosis.confidence}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Symptoms</Text>
        {diagnosis.symptoms.map((symptom, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.itemText}>{symptom}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Treatment</Text>
        {diagnosis.treatment.map((step, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.number}>{index + 1}.</Text>
            <Text style={styles.itemText}>{step}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.date}>Diagnosed on: {diagnosis.date}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 20,
  },
  plantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  disease: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  confidence: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bullet: {
    marginRight: 10,
    fontSize: 16,
    color: '#2E7D32',
  },
  number: {
    marginRight: 10,
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  footer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  date: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
