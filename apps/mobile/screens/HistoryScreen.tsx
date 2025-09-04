import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useGuestFeatures } from '../hooks/useGuestFeatures';

type HistoryItem = {
  id: string;
  disease: string;
  confidence: number;
  imageUri: string;
  timestamp: number;
  isFavorite: boolean;
};

export function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  const navigation = useNavigation();
  const { isGuest } = useAuth();
  const { canPerformAction, recordAction } = useGuestFeatures();

  // Mock data - replace with actual data fetching
  useEffect(() => {
    const loadHistory = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockHistory: HistoryItem[] = [
          {
            id: '1',
            disease: 'Early Blight',
            confidence: 0.87,
            imageUri: 'https://example.com/image1.jpg',
            timestamp: Date.now() - 3600000, // 1 hour ago
            isFavorite: true,
          },
          {
            id: '2',
            disease: 'Late Blight',
            confidence: 0.92,
            imageUri: 'https://example.com/image2.jpg',
            timestamp: Date.now() - 86400000, // 1 day ago
            isFavorite: false,
          },
          {
            id: '3',
            disease: 'Powdery Mildew',
            confidence: 0.78,
            imageUri: 'https://example.com/image3.jpg',
            timestamp: Date.now() - 259200000, // 3 days ago
            isFavorite: true,
          },
        ];
        
        setHistory(mockHistory);
      } catch (error) {
        console.error('Error loading history:', error);
        Alert.alert('Error', 'Failed to load history. Please try again.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };
    
    loadHistory();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Refresh logic would go here
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const toggleFavorite = (id: string) => {
    if (isGuest && !canPerformAction('favorite')) {
      Alert.alert(
        'Limit Reached',
        'You have reached your free favorites limit. Please sign up to save more favorites.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Sign Up', 
            onPress: () => navigation.navigate('SignUp')
          }
        ]
      );
      return;
    }
    
    setHistory(prevHistory =>
      prevHistory.map(item =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
    
    if (isGuest) {
      recordAction('favorite');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Scan',
      'Are you sure you want to delete this scan?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
          },
        },
      ]
    );
  };

  const filteredHistory = selectedFilter === 'all' 
    ? history 
    : history.filter(item => item.isFavorite);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Image 
        source={require('../../assets/empty-history.png')} 
        style={styles.emptyStateImage}
      />
      <Text style={styles.emptyStateTitle}>No Scan History</Text>
      <Text style={styles.emptyStateText}>
        Your scan history will appear here. Start by scanning a plant!
      </Text>
      <TouchableOpacity 
        style={styles.scanButton}
        onPress={() => navigation.navigate('Scan')}
      >
        <Text style={styles.scanButtonText}>Scan a Plant</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity 
      style={styles.historyItem}
      onPress={() => navigation.navigate('HistoryDetail', { id: item.id })}
    >
      <Image 
        source={{ uri: item.imageUri }} 
        style={styles.historyImage}
        defaultSource={require('../../assets/placeholder-image.png')}
      />
      <View style={styles.historyContent}>
        <View>
          <Text style={styles.diseaseName} numberOfLines={1}>{item.disease}</Text>
          <View style={styles.confidenceContainer}>
            <View 
              style={[
                styles.confidenceMeter, 
                { width: `${item.confidence * 100}%` }
              ]} 
            />
            <Text style={styles.confidenceText}>
              {Math.round(item.confidence * 100)}% confidence
            </Text>
          </View>
          <Text style={styles.timestamp}>
            {formatTimestamp(item.timestamp)}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
            style={styles.favoriteButton}
          >
            <Image 
              source={item.isFavorite 
                ? require('../../assets/heart-filled.png') 
                : require('../../assets/heart-outline.png')
              }
              style={[
                styles.favoriteIcon,
                item.isFavorite && styles.favoriteIconActive
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation();
              handleDelete(item.id);
            }}
            style={styles.deleteButton}
          >
            <Image 
              source={require('../../assets/trash.png')}
              style={styles.deleteIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading your history...</Text>
        </View>
      ) : (
        <>
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === 'all' && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text 
                style={[
                  styles.filterButtonText,
                  selectedFilter === 'all' && styles.filterButtonTextActive
                ]}
              >
                All Scans
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === 'favorites' && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter('favorites')}
            >
              <Text 
                style={[
                  styles.filterButtonText,
                  selectedFilter === 'favorites' && styles.filterButtonTextActive
                ]}
              >
                Favorites
              </Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={filteredHistory}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={['#4CAF50']}
                tintColor="#4CAF50"
              />
            }
          />
        </>
      )}
      
      {isGuest && (
        <View style={styles.guestBanner}>
          <Text style={styles.guestText}>
            Guest: {canPerformAction('history') ? 'History saves remaining: ' + canPerformAction('history') : 'No history saves left'}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.upgradeText}>Upgrade to Pro</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// Helper function to format timestamp
const formatTimestamp = (timestamp: number): string => {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#E8F5E9',
  },
  filterButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateImage: {
    width: 150,
    height: 150,
    marginBottom: 16,
    opacity: 0.7,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  scanButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
  },
  historyContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    maxWidth: 200,
  },
  confidenceContainer: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  confidenceMeter: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  confidenceText: {
    fontSize: 12,
    color: '#666',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 8,
    marginRight: 8,
  },
  favoriteIcon: {
    width: 24,
    height: 24,
    tintColor: '#BDBDBD',
  },
  favoriteIconActive: {
    tintColor: '#F44336',
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    width: 20,
    height: 20,
    tintColor: '#E53935',
    opacity: 0.7,
  },
  guestBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#FFB74D',
  },
  guestText: {
    color: '#E65100',
    fontSize: 14,
  },
  upgradeText: {
    color: '#E65100',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
