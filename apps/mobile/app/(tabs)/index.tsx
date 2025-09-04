import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type QuickAction = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen: string;
};

const quickActions: QuickAction[] = [
  { id: '1', title: 'Disease Detection', icon: 'leaf', screen: 'camera' },
  { id: '2', title: 'Crop Database', icon: 'search', screen: 'crop-database' },
  { id: '3', title: 'Weather', icon: 'cloudy', screen: 'weather' },
  { id: '4', title: 'Expert Help', icon: 'people', screen: 'expert-help' },
];

export default function Home() {
  const handleActionPress = (screen: string) => {
    // Navigation will be handled by the router
    console.log(`Navigate to ${screen}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'AgroEng' }} />
      
      {/* Welcome Section */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, User</Text>
        <Text style={styles.subtitle}>What would you like to do today?</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          {quickActions.map((action) => (
            <TouchableOpacity 
              key={action.id} 
              style={styles.actionCard}
              onPress={() => handleActionPress(action.screen)}
            >
              <View style={styles.actionIcon}>
                <Ionicons name={action.icon} size={24} color="#4CAF50" />
              </View>
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <Ionicons name="time-outline" size={24} color="#666" />
          <Text style={styles.activityText}>No recent activity</Text>
        </View>
      </View>

      {/* Tips Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Tips</Text>
        <View style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={24} color="#FFC107" style={styles.tipIcon} />
          <View>
            <Text style={styles.tipTitle}>Watering Tips</Text>
            <Text style={styles.tipText} numberOfLines={2}>
              Water your plants early in the morning to reduce evaporation and prevent diseases.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  activityCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityText: {
    marginLeft: 12,
    color: '#666',
  },
  tipCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipIcon: {
    marginRight: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
  },
});
