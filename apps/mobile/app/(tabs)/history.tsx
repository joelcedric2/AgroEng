import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type ScanHistoryItem = {
  id: string;
  plantName: string;
  disease: string;
  date: string;
  image: any;
  status: 'healthy' | 'diseased';
};

const historyData: ScanHistoryItem[] = [
  {
    id: '1',
    plantName: 'Tomato Plant',
    disease: 'Early Blight',
    date: '2023-11-15',
    image: require('../../assets/images/tomato-blight.jpg'),
    status: 'diseased'
  },
  {
    id: '2',
    plantName: 'Rose Bush',
    disease: 'Healthy',
    date: '2023-11-10',
    image: require('../../assets/images/healthy-rose.jpg'),
    status: 'healthy'
  },
  {
    id: '3',
    plantName: 'Tomato Plant',
    disease: 'Late Blight',
    date: '2023-11-05',
    image: require('../../assets/images/tomato-late-blight.jpg'),
    status: 'diseased'
  },
  {
    id: '4',
    plantName: 'Rose Bush',
    disease: 'Black Spot',
    date: '2023-10-28',
    image: require('../../assets/images/rose-black-spot.jpg'),
    status: 'diseased'
  },
  {
    id: '5',
    plantName: 'Tomato Plant',
    disease: 'Healthy',
    date: '2023-10-20',
    image: require('../../assets/images/healthy-tomato.jpg'),
    status: 'healthy'
  },
];

export default function History() {
  const navigation = useNavigation<any>();

  const renderItem = ({ item }: { item: ScanHistoryItem }) => (
    <TouchableOpacity 
      style={styles.item}
      onPress={() => navigation.navigate('diagnosis', { id: item.id })}
    >
      <Image source={item.image} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.plantName}>{item.plantName}</Text>
        <View style={[
          styles.statusBadge,
          item.status === 'healthy' ? styles.healthyBadge : styles.diseasedBadge
        ]}>
          <Text style={styles.statusText}>
            {item.status === 'healthy' ? 'Healthy' : 'Diseased'}
          </Text>
        </View>
        <Text style={styles.disease}>{item.disease}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Scan History</Text>
      <FlatList
        data={historyData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listContainer: {
    padding: 10,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    padding: 15,
  },
  plantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  disease: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 5,
  },
  healthyBadge: {
    backgroundColor: '#d4edda',
  },
  diseasedBadge: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#155724',
  },
});
