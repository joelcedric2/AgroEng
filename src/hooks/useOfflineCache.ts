import { useState, useEffect } from 'react';

interface CachedDiagnosis {
  id: string;
  image: string;
  plant: string;
  issue: string;
  cause?: string;
  timestamp: number;
  synced: boolean;
}

interface OfflineCacheHook {
  isOnline: boolean;
  queuedScans: CachedDiagnosis[];
  cachedDiagnoses: CachedDiagnosis[];
  addToQueue: (diagnosis: Omit<CachedDiagnosis, 'id' | 'timestamp' | 'synced'>) => void;
  syncPendingScans: () => Promise<void>;
  getCachedHistory: () => CachedDiagnosis[];
}

export const useOfflineCache = (): OfflineCacheHook => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queuedScans, setQueuedScans] = useState<CachedDiagnosis[]>([]);
  const [cachedDiagnoses, setCachedDiagnoses] = useState<CachedDiagnosis[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load cached data from localStorage
    loadCachedData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline && queuedScans.length > 0) {
      syncPendingScans();
    }
  }, [isOnline]);

  const loadCachedData = () => {
    try {
      const cached = localStorage.getItem('agroeng_cached_diagnoses');
      const queued = localStorage.getItem('agroeng_queued_scans');
      
      if (cached) {
        setCachedDiagnoses(JSON.parse(cached));
      }
      
      if (queued) {
        setQueuedScans(JSON.parse(queued));
      }
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
  };

  const saveCachedData = (diagnoses: CachedDiagnosis[], queued: CachedDiagnosis[]) => {
    try {
      localStorage.setItem('agroeng_cached_diagnoses', JSON.stringify(diagnoses));
      localStorage.setItem('agroeng_queued_scans', JSON.stringify(queued));
    } catch (error) {
      console.error('Error saving cached data:', error);
    }
  };

  const addToQueue = (diagnosis: Omit<CachedDiagnosis, 'id' | 'timestamp' | 'synced'>) => {
    const newDiagnosis: CachedDiagnosis = {
      ...diagnosis,
      id: Date.now().toString(),
      timestamp: Date.now(),
      synced: isOnline
    };

    const updatedCached = [...cachedDiagnoses, newDiagnosis];
    setCachedDiagnoses(updatedCached);

    if (!isOnline) {
      const updatedQueued = [...queuedScans, newDiagnosis];
      setQueuedScans(updatedQueued);
      saveCachedData(updatedCached, updatedQueued);
    } else {
      saveCachedData(updatedCached, queuedScans);
    }
  };

  const syncPendingScans = async () => {
    if (!isOnline || queuedScans.length === 0) return;

    try {
      // Simulate API sync - in real app, send to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mark all queued scans as synced
      const syncedScans = queuedScans.map(scan => ({ ...scan, synced: true }));
      const updatedCached = cachedDiagnoses.map(diagnosis => {
        const synced = syncedScans.find(s => s.id === diagnosis.id);
        return synced ? synced : diagnosis;
      });

      setCachedDiagnoses(updatedCached);
      setQueuedScans([]);
      saveCachedData(updatedCached, []);
      
      console.log(`Synced ${syncedScans.length} pending scans`);
    } catch (error) {
      console.error('Error syncing pending scans:', error);
    }
  };

  const getCachedHistory = () => {
    return cachedDiagnoses.sort((a, b) => b.timestamp - a.timestamp);
  };

  return {
    isOnline,
    queuedScans,
    cachedDiagnoses,
    addToQueue,
    syncPendingScans,
    getCachedHistory
  };
};