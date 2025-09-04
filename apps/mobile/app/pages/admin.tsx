import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

const stats = {
  totalUsers: 1245,
  activeUsers: 892,
  totalScans: 5678,
  accuracy: '94.5%',
  commonDiseases: [
    { name: 'Early Blight', count: 1245 },
    { name: 'Late Blight', count: 876 },
    { name: 'Powdery Mildew', count: 654 },
    { name: 'Leaf Spot', count: 432 },
  ],
  recentActivity: [
    { id: 1, user: 'user123', action: 'Scan', disease: 'Early Blight', time: '2 min ago' },
    { id: 2, user: 'user456', action: 'Sign up', time: '5 min ago' },
    { id: 3, user: 'user789', action: 'Scan', disease: 'Late Blight', time: '12 min ago' },
    { id: 4, user: 'user012', action: 'View Solutions', disease: 'Powdery Mildew', time: '18 min ago' },
  ]
};

export default function AdminDashboard() {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Stats Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.activeUsers}</Text>
              <Text style={styles.statLabel}>Active Users</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalScans}</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.accuracy}</Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
          </View>
        </View>

        {/* Common Diseases */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Diseases</Text>
          <View style={styles.diseaseList}>
            {stats.commonDiseases.map((disease, index) => (
              <View key={index} style={styles.diseaseItem}>
                <Text style={styles.diseaseName}>{disease.name}</Text>
                <Text style={styles.diseaseCount}>{disease.count} cases</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {stats.recentActivity.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityUser}>@{activity.user}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                <Text style={styles.activityAction}>
                  {activity.action}{activity.disease ? `: ${activity.disease}` : ''}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2E7D32',
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  logoutText: {
    color: 'white',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 25,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  diseaseList: {
    marginTop: 10,
  },
  diseaseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  diseaseName: {
    fontSize: 15,
    color: '#333',
  },
  diseaseCount: {
    fontSize: 14,
    color: '#666',
  },
  activityList: {
    marginTop: 10,
  },
  activityItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  activityUser: {
    fontWeight: '600',
    color: '#2E7D32',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  activityAction: {
    fontSize: 14,
    color: '#555',
  },
});
