import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 AgroEng</Text>
      <Text style={styles.subtitle}>Plant Disease Detection</Text>
      
      <View style={styles.grid}>
        <Link href="/camera" style={styles.card}>
          <Text style={styles.cardText}>Scan Plant</Text>
        </Link>
        <Link href="/diagnosis" style={styles.card}>
          <Text style={styles.cardText}>Diagnosis</Text>
        </Link>
        <Link href="/solutions" style={styles.card}>
          <Text style={styles.cardText}>Solutions</Text>
        </Link>
        <Link href="/history" style={styles.card}>
          <Text style={styles.cardText}>History</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
});
