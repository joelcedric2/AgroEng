import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Camera, Calendar, Filter, Download, Wifi, WifiOff, MoreVertical, Trash2, BarChart3, CheckCircle, AlertTriangle } from "lucide-react-native";
import { useScans } from "@/hooks/useScans";

interface HistoryProps {
  navigation: any;
}

export default function History({ navigation }: HistoryProps) {
  const { scans, loading, deleteScan } = useScans();
  const [isOnline] = useState(navigator.onLine);

  const handleDeleteScan = async (scanId: string) => {
    const success = await deleteScan(scanId);
    if (success) {
      Alert.alert("Scan deleted", "The plant diagnosis has been removed.");
    }
  };

  const getSeverityColor = (severity: string | null) => {
    switch (severity) {
      case "high": return "#ef4444";
      case "medium": return "#f59e0b";
      case "low": return "#22c55e";
      default: return "#6b7280";
    }
  };

  const getStatusIcon = (issue: string | null) => {
    if (!issue || issue.toLowerCase().includes('healthy')) return <CheckCircle size={20} color="#22c55e" />;
    if (issue.toLowerCase().includes('urgent') || issue.toLowerCase().includes('critical')) return <AlertTriangle size={20} color="#ef4444" />;
    return <AlertTriangle size={20} color="#f59e0b" />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Diagnosis History</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Offline Status Indicator */}
          <View style={[styles.statusCard, isOnline ? styles.onlineCard : styles.offlineCard]}>
            <View style={styles.statusContent}>
              {isOnline ? (
                <Wifi size={16} color="#22c55e" />
              ) : (
                <WifiOff size={16} color="#f59e0b" />
              )}
              <View style={styles.statusText}>
                <Text style={styles.statusTitle}>
                  {isOnline ? 'Online' : 'Offline Mode'}
                </Text>
                <Text style={styles.statusSubtitle}>
                  {isOnline 
                    ? 'All data synced'
                    : 'Viewing cached history. Some features may be limited.'
                  }
                </Text>
              </View>
            </View>
          </View>

          {/* Summary Stats */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{scans.length}</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#22c55e' }]}>
                {scans.filter(scan => !scan.issue_detected || scan.issue_detected.toLowerCase().includes('healthy')).length}
              </Text>
              <Text style={styles.statLabel}>Healthy</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#f59e0b' }]}>
                {scans.filter(scan => scan.issue_detected && !scan.issue_detected.toLowerCase().includes('healthy')).length}
              </Text>
              <Text style={styles.statLabel}>Issues Found</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Camera')}
            >
              <Camera size={16} color="#ffffff" />
              <Text style={styles.primaryButtonText}>New Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Filter size={16} color="#22c55e" />
              <Text style={styles.secondaryButtonText}>Filter</Text>
            </TouchableOpacity>
          </View>

          {/* History List */}
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Recent Diagnoses</Text>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading your scan history...</Text>
              </View>
            ) : scans.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyContent}>
                  <BarChart3 size={64} color="#9ca3af" />
                  <Text style={styles.emptyTitle}>No scans yet</Text>
                  <Text style={styles.emptyDescription}>
                    Start by taking a photo of your plants to build your diagnosis history
                  </Text>
                  <TouchableOpacity 
                    style={styles.emptyButton}
                    onPress={() => navigation.navigate('Camera')}
                  >
                    <Camera size={16} color="#ffffff" />
                    <Text style={styles.emptyButtonText}>Take First Scan</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              scans.map((scan) => (
                <View key={scan.id} style={styles.scanCard}>
                  <View style={styles.scanContent}>
                    {scan.image_url ? (
                      <Image 
                        source={{ uri: scan.image_url }}
                        style={styles.scanImage}
                      />
                    ) : (
                      <View style={styles.placeholderImage}>
                        <Camera size={24} color="#9ca3af" />
                      </View>
                    )}
                    <View style={styles.scanDetails}>
                      <View style={styles.scanHeader}>
                        <Text style={styles.scanTitle}>{scan.plant_type || 'Unknown Plant'}</Text>
                        <TouchableOpacity 
                          onPress={() => handleDeleteScan(scan.id)}
                          style={styles.deleteButton}
                        >
                          <Trash2 size={16} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.scanStatus}>
                        {getStatusIcon(scan.issue_detected)}
                        <Text style={styles.scanIssue}>
                          {scan.issue_detected || 'Healthy'}
                        </Text>
                      </View>
                      
                      <View style={styles.scanMeta}>
                        <View style={styles.scanDate}>
                          <Calendar size={12} color="#6b7280" />
                          <Text style={styles.scanDateText}>
                            {new Date(scan.created_at).toLocaleDateString()}
                          </Text>
                        </View>
                        {scan.severity && (
                          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(scan.severity) + '20' }]}>
                            <Text style={[styles.severityText, { color: getSeverityColor(scan.severity) }]}>
                              {scan.severity.charAt(0).toUpperCase() + scan.severity.slice(1)}
                            </Text>
                          </View>
                        )}
                      </View>
                      
                      {scan.confidence_score && (
                        <Text style={styles.confidenceText}>
                          Confidence: {Math.round(scan.confidence_score * 100)}%
                        </Text>
                      )}

                      {scan.recommendations && (
                        <Text style={styles.recommendationsText}>
                          <Text style={styles.recommendationsLabel}>Recommendations:</Text> {scan.recommendations.substring(0, 100)}...
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Export Options */}
          <View style={styles.exportCard}>
            <View style={styles.exportContent}>
              <Text style={styles.exportTitle}>Export Your Data</Text>
              <Text style={styles.exportDescription}>
                Download your diagnosis history for farm records
              </Text>
              <TouchableOpacity style={styles.exportButton}>
                <Download size={16} color="#22c55e" />
                <Text style={styles.exportButtonText}>Export PDF Report</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  statusCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  onlineCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  offlineCard: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 12,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  statusSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
    marginLeft: 8,
  },
  historySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  scanCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
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
  scanContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  placeholderImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
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
  scanTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  deleteButton: {
    padding: 4,
  },
  scanStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scanIssue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginLeft: 8,
  },
  scanMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  confidenceText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  recommendationsText: {
    fontSize: 12,
    color: '#6b7280',
  },
  recommendationsLabel: {
    fontWeight: '600',
  },
  exportCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  exportContent: {
    alignItems: 'center',
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  exportDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  exportButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
    marginLeft: 8,
  },
});