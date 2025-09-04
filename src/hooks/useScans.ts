import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useSubscriptionLimits } from '@/components/SubscriptionLimits';
import { useToast } from './use-toast';

interface Scan {
  id: string;
  user_id: string;
  image_url?: string | null;
  plant_type?: string | null;
  issue_detected?: string | null;
  severity?: string | null;
  diagnosis_result?: any;
  recommendations?: string | null;
  confidence_score?: number | null;
  location?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

interface CreateScanData {
  image_url?: string;
  plant_type?: string;
  issue_detected?: string;
  severity?: 'low' | 'medium' | 'high';
  diagnosis_result?: any;
  recommendations?: string;
  confidence_score?: number;
  location?: string;
  notes?: string;
}

export const useScans = () => {
  const { user } = useAuth();
  const { canScan, incrementScanUsage } = useSubscriptionLimits();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchScans = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScans(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching scans",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createScan = async (scanData: CreateScanData): Promise<Scan | null> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save scans.",
        variant: "destructive"
      });
      return null;
    }

    if (!canScan()) {
      toast({
        title: 'Daily scan limit reached',
        description: 'Upgrade to premium for unlimited scans.',
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('scans')
        .insert([{
          user_id: user.id,
          ...scanData
        }])
        .select()
        .single();

      if (error) throw error;

      setScans(prev => [data, ...prev]);
      incrementScanUsage(); // Track the scan usage
      toast({
        title: "Scan saved",
        description: "Your plant diagnosis has been saved successfully.",
      });
      
      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error saving scan",
        description: err.message,
        variant: "destructive"
      });
      return null;
    }
  };

  const updateScan = async (id: string, updates: Partial<CreateScanData>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('scans')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setScans(prev => prev.map(scan => 
        scan.id === id ? { ...scan, ...updates } : scan
      ));

      toast({
        title: "Scan updated",
        description: "Your plant diagnosis has been updated.",
      });
      
      return true;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error updating scan",
        description: err.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteScan = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('scans')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setScans(prev => prev.filter(scan => scan.id !== id));
      toast({
        title: "Scan deleted",
        description: "Your plant diagnosis has been deleted.",
      });
      
      return true;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error deleting scan",
        description: err.message,
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchScans();
  }, [user]);

  return {
    scans,
    loading,
    error,
    createScan,
    updateScan,
    deleteScan,
    refreshScans: fetchScans,
    canScan: canScan
  };
};