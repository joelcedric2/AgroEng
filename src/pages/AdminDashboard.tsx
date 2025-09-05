import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { 
  Users, 
  Activity, 
  Scan, 
  TrendingUp, 
  Database, 
  Bug, 
  MessageSquare, 
  CreditCard, 
  Volume2, 
  Brain, 
  Settings,
  Search,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  BarChart3,
  PieChart
} from 'lucide-react-native';

interface AdminDashboardProps {
  navigation?: any;
}

export default function AdminDashboard({ navigation }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with real data from your backend
  const dashboardMetrics = {
    totalUsers: 2547,
    activeMonthlyUsers: 1823,
    dailyScans: 127,
    aiSuccessRate: 87.5,
    topCrops: ['Cassava', 'Maize', 'Rice', 'Yam', 'Beans']
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>AgroEng AI Management</Text>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Tab Navigation */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScrollView}>
            <View style={styles.tabsList}>
              {[
                { key: 'overview', icon: BarChart3, label: 'Overview' },
                { key: 'crops', icon: Database, label: 'Crops' },
                { key: 'diseases', icon: Bug, label: 'Diseases' },
                { key: 'users', icon: Users, label: 'Users' },
                { key: 'feedback', icon: MessageSquare, label: 'Feedback' },
                { key: 'billing', icon: CreditCard, label: 'Billing' },
                { key: 'audio', icon: Volume2, label: 'Audio' },
                { key: 'training', icon: Brain, label: 'AI Training' },
                { key: 'settings', icon: Settings, label: 'Settings' },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                    onPress={() => setActiveTab(tab.key)}
                  >
                    <Icon size={16} color={activeTab === tab.key ? "#22c55e" : "#6b7280"} />
                    <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <View style={styles.tabContent}>
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <View style={styles.metricContent}>
                    <Users size={32} color="#22c55e" />
                    <View style={styles.metricText}>
                      <Text style={styles.metricLabel}>Total Users</Text>
                      <Text style={styles.metricValue}>{dashboardMetrics.totalUsers.toLocaleString()}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.metricCard}>
                  <View style={styles.metricContent}>
                    <Activity size={32} color="#22c55e" />
                    <View style={styles.metricText}>
                      <Text style={styles.metricLabel}>Monthly Active</Text>
                      <Text style={styles.metricValue}>{dashboardMetrics.activeMonthlyUsers.toLocaleString()}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.metricCard}>
                  <View style={styles.metricContent}>
                    <Scan size={32} color="#3b82f6" />
                    <View style={styles.metricText}>
                      <Text style={styles.metricLabel}>Daily Scans</Text>
                      <Text style={styles.metricValue}>{dashboardMetrics.dailyScans}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.metricCard}>
                  <View style={styles.metricContent}>
                    <TrendingUp size={32} color="#f59e0b" />
                    <View style={styles.metricText}>
                      <Text style={styles.metricLabel}>AI Success Rate</Text>
                      <Text style={styles.metricValue}>{dashboardMetrics.aiSuccessRate}%</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.topCropsCard}>
                <Text style={styles.cardTitle}>Top 5 Crops Scanned</Text>
                <View style={styles.cropsList}>
                  {dashboardMetrics.topCrops.map((crop, index) => (
                    <View key={crop} style={styles.cropItem}>
                      <Text style={styles.cropRank}>{index + 1}. {crop}</Text>
                      <View style={styles.cropBadge}>
                        <Text style={styles.cropBadgeText}>{Math.floor(Math.random() * 100 + 50)} scans</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {activeTab === 'crops' && (
            <View style={styles.tabContent}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Crop Database Management</Text>
                <View style={styles.headerButtons}>
                  <TouchableOpacity style={styles.primaryButton}>
                    <Plus size={16} color="#ffffff" />
                    <Text style={styles.primaryButtonText}>Add Crop</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryButton}>
                    <Upload size={16} color="#22c55e" />
                    <Text style={styles.secondaryButtonText}>Bulk Upload</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.searchContainer}>
                <Search size={16} color="#6b7280" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search crops..."
                  placeholderTextColor="#6b7280"
                />
              </View>

              <View style={styles.cropsGrid}>
                {['Cassava', 'Maize', 'Rice', 'Yam', 'Beans', 'Cocoa'].map((crop) => (
                  <View key={crop} style={styles.cropCard}>
                    <View style={styles.cropCardHeader}>
                      <Text style={styles.cropName}>{crop}</Text>
                      <View style={styles.cropActions}>
                        <TouchableOpacity style={styles.actionButton}>
                          <Edit size={16} color="#6b7280" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                          <Trash2 size={16} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text style={styles.cropScientific}>Scientific name: Manihot esculenta</Text>
                    <View style={styles.diseasesBadge}>
                      <Text style={styles.diseasesBadgeText}>5 diseases tracked</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Add other tab contents as needed */}
          {activeTab !== 'overview' && activeTab !== 'crops' && (
            <View style={styles.tabContent}>
              <Text style={styles.comingSoonText}>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} management coming soon...
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  badge: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  badgeText: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  tabScrollView: {
    marginBottom: 24,
  },
  tabsList: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 4,
    minWidth: 80,
  },
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  activeTabText: {
    color: '#22c55e',
  },
  tabContent: {
    marginTop: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  metricContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricText: {
    marginLeft: 12,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  topCropsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  cropsList: {
    marginTop: 8,
  },
  cropItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cropRank: {
    fontSize: 14,
    color: '#1f2937',
  },
  cropBadge: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cropBadgeText: {
    fontSize: 12,
    color: '#6b7280',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  primaryButton: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 4,
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
    marginLeft: 8,
  },
  cropsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cropCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cropCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cropName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  cropActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 4,
  },
  cropScientific: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  diseasesBadge: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  diseasesBadgeText: {
    fontSize: 12,
    color: '#6b7280',
  },
  comingSoonText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 32,
  },
});