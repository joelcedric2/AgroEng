import { useState, useEffect } from 'react';

interface OfflineData {
  id: string;
  timestamp: number;
  data: any;
  type: 'scan' | 'tip' | 'guide';
}

interface OfflineStorageHook {
  isOffline: boolean;
  offlineData: OfflineData[];
  addOfflineData: (data: Omit<OfflineData, 'id' | 'timestamp'>) => void;
  clearOfflineData: () => void;
  syncOfflineData: () => Promise<void>;
  downloadCache: () => Promise<void>;
  cacheSize: string;
}

export const useOfflineStorage = (): OfflineStorageHook => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [offlineData, setOfflineData] = useState<OfflineData[]>([]);
  const [cacheSize, setCacheSize] = useState('0 MB');

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load cached data from localStorage
    const savedData = localStorage.getItem('offline-data');
    if (savedData) {
      try {
        setOfflineData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading offline data:', error);
      }
    }

    // Calculate cache size
    calculateCacheSize();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const calculateCacheSize = () => {
    const data = localStorage.getItem('offline-data') || '';
    const staticCache = localStorage.getItem('static-cache') || '';
    const totalSize = new Blob([data + staticCache]).size;
    const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
    setCacheSize(`${sizeInMB} MB`);
  };

  const addOfflineData = (data: Omit<OfflineData, 'id' | 'timestamp'>) => {
    const newData: OfflineData = {
      ...data,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    const updatedData = [...offlineData, newData];
    setOfflineData(updatedData);
    localStorage.setItem('offline-data', JSON.stringify(updatedData));
    calculateCacheSize();
  };

  const clearOfflineData = () => {
    setOfflineData([]);
    localStorage.removeItem('offline-data');
    localStorage.removeItem('static-cache');
    setCacheSize('0 MB');
  };

  const syncOfflineData = async () => {
    if (isOffline || offlineData.length === 0) return;

    try {
      // Simulate syncing data to server
      for (const item of offlineData) {
        console.log('Syncing offline data:', item);
        // Here you would send the data to your backend
      }
      
      // Clear synced data
      clearOfflineData();
    } catch (error) {
      console.error('Error syncing offline data:', error);
    }
  };

  const downloadCache = async (): Promise<void> => {
    return new Promise((resolve) => {
      // Simulate downloading common crops data and guides
      const staticCacheData = {
        crops: [
          'maize', 'rice', 'cassava', 'yam', 'plantain', 
          'cocoa', 'coffee', 'groundnuts', 'beans', 'millet'
        ],
        diseases: [
          'leaf_blight', 'root_rot', 'stem_borer', 'mosaic_virus',
          'black_spot', 'powdery_mildew', 'bacterial_wilt'
        ],
        treatments: {
          leaf_blight: 'Apply copper-based fungicide every 7-10 days',
          root_rot: 'Improve drainage and reduce watering frequency',
          stem_borer: 'Use neem-based insecticide or introduce natural predators',
          mosaic_virus: 'Remove infected plants and control aphid vectors',
          black_spot: 'Apply sulfur-based fungicide and improve air circulation',
          powdery_mildew: 'Use baking soda solution or organic fungicides',
          bacterial_wilt: 'Remove affected plants and improve soil drainage'
        },
        tips: [
          'Water plants early morning to reduce fungal diseases',
          'Rotate crops annually to prevent soil depletion',
          'Use organic compost to improve soil fertility',
          'Monitor plants weekly for early disease detection',
          'Plant native varieties for better disease resistance'
        ],
        lastUpdated: Date.now()
      };

      localStorage.setItem('static-cache', JSON.stringify(staticCacheData));
      calculateCacheSize();
      
      setTimeout(() => {
        resolve();
      }, 3000); // Simulate 3-second download
    });
  };

  return {
    isOffline,
    offlineData,
    addOfflineData,
    clearOfflineData,
    syncOfflineData,
    downloadCache,
    cacheSize,
  };
};