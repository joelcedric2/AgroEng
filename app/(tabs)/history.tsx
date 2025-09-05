import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const mockScans = [
  {
    id: '1',
    plant: 'Tomato',
    issue: 'Leaf Blight',
    severity: 'medium',
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1592479286881-62c8a1e07a4c?w=400&h=400&fit=crop',
    confidence: 94
  },
  {
    id: '2',
    plant: 'Maize',
    issue: 'Healthy',
    severity: 'low',
    date: '2024-01-14',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop',
    confidence: 98
  },
  {
    id: '3',
    plant: 'Cassava',
    issue: 'Mosaic Virus',
    severity: 'high',
    date: '2024-01-13',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
    confidence: 87
  }
];

export default function HistoryScreen() {
  const [isOnline] = useState(true);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (issue: string) => {
    if (issue.toLowerCase().includes('healthy')) {
      return <Ionicons name="checkmark-circle" size={20} color="#22c55e" />;
    }
    return <Ionicons name="warning" size={20} color="#f59e0b" />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Diagnosis History</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={20} color="#22c55e" />
          </TouchableOpacity>
        </View>

        {/* Online Status */}
        <View style={[styles.statusCard, { backgroundColor: isOnline ? '#dcfce7' : '#fef3c7' }]}>
          <View style={styles.statusContent}>
            <Ionicons 
              name={isOnline ? "wifi" : "wifi-off"} 
              size={16} 
              color={isOnline ? '#22c55e' : '#f59e0b'} 
            />
            <Text style={[styles.statusText, { color: isOnline ? '#22c55e' : '#f59e0b' }]}>
              {isOnline ? 'Online - All data synced' : 'Offline - Viewing cached history'}
            </Text>
          </View>
        </View>

        {/* Summary Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mockScans.length}</Text>
            <Text style={styles.statLabel}>Total Scans</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#22c55e' }]}>
              {mockScans.filter(scan => scan.issue.toLowerCase().includes('healthy')).length}
            </Text>
            <Text style={styles.statLabel}>Healthy</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#f59e0b' }]}>
              {mockScans.filter(scan => !scan.issue.toLowerCase().includes('healthy')).length}
            </Text>
            <Text style={styles.statLabel}>Issues Found</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/(tabs)/camera')}
          >
            <Ionicons name="camera" size={20} color="#ffffff" />
            <Text style={styles.quickActionText}>New Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButtonOutline}>
            <Ionicons name="download-outline" size={20} color="#22c55e" />
            <Text style={styles.quickActionTextOutline}>Export</Text>
          </TouchableOpacity>
        </View>

        {/* History List */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Recent Diagnoses</Text>
          
          {mockScans.map((scan) => (
            <View key={scan.id} style={styles.scanCard}>
              <View style={styles.scanContent}>
                <Image source={{ uri: scan.image }} style={styles.scanImage} />
                <View style={styles.scanDetails}>
                  <View style={styles.scanHeader}>
                    <Text style={styles.scanPlant}>{scan.plant}</Text>
                    <TouchableOpacity>
                      <Ionicons name="ellipsis-vertical" size={16} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.scanStatus}>
                    {getStatusIcon(scan.issue)}
                    <Text style={styles.scanIssue}>{scan.issue}</Text>
                  </View>
                  
                  <View style={styles.scanMeta}>
                    <View style={styles.scanDate}>
                      <Ionicons name="calendar-outline" size={12} color="#6b7280" />
                      <Text style={styles.scanDateText}>
                        {new Date(scan.date).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(scan.severity) + '20' }]}>
                      <Text style={[styles.severityText, { color: getSeverityColor(scan.severity) }]}>
                        {scan.severity.charAt(0).toUpperCase() + scan.severity.slice(1)}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.confidenceText}>
                    Confidence: {scan.confidence}%
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Export Section */}
        <View style={styles.exportCard}>
          <View style={styles.exportContent}>
            <Text style={styles.exportTitle}>Export Your Data</Text>
            <Text style={styles.exportDescription}>
              Download your diagnosis history for farm records
            </Text>
            <TouchableOpacity style={styles.exportButton}>
              <Ionicons name="download-outline" size={16} color="#22c55e" />
              <Text style={styles.exportButtonText}>Export PDF Report</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusCard: {
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  quickActionButton: {
    backgroundColor: '#22c55e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  quickActionText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  quickActionButtonOutline: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#22c55e',
    flex: 1,
    justifyContent: 'center',
  },
  quickActionTextOutline: {
    color: '#22c55e',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  historySection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  scanCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scanContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  scanDetails: {
    flex: 1,
  },
  scanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scanPlant: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  scanStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scanIssue: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    color: '#1f2937',
  },
  scanMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  scanDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanDateText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  confidenceText: {
    fontSize: 12,
    color: '#6b7280',
  },
  exportCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exportContent: {
    alignItems: 'center',
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  exportDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  exportButtonText: {
    color: '#22c55e',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 12,
  },
  bottomSpacing: {
    height: 20,
  },
  placeholder: {
    width: 24,
    height: 24,
  },
});