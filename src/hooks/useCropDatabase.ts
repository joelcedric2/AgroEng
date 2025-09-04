import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Crop {
  id: string;
  name: string;
  scientific_name?: string;
  description?: string;
  category?: string;
  planting_season?: string;
  harvest_season?: string;
  growing_conditions?: any;
  nutrition_info?: any;
  market_info?: any;
  created_at: string;
  updated_at: string;
}

export interface Disease {
  id: string;
  name: string;
  scientific_name?: string;
  description?: string;
  symptoms?: string;
  causes?: string;
  prevention?: string;
  treatment?: string;
  severity?: string;
  created_at: string;
  updated_at: string;
}

export interface CropImage {
  id: string;
  crop_id: string;
  image_url: string;
  image_type: string;
  description?: string;
  ai_analysis?: any;
  created_at: string;
}

export const useCropDatabase = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCrops = async () => {
    try {
      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCrops(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchDiseases = async () => {
    try {
      const { data, error } = await supabase
        .from('diseases')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setDiseases(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const searchCrops = async (query: string): Promise<Crop[]> => {
    try {
      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .or(`name.ilike.%${query}%,scientific_name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  const searchDiseases = async (query: string): Promise<Disease[]> => {
    try {
      const { data, error } = await supabase
        .from('diseases')
        .select('*')
        .or(`name.ilike.%${query}%,symptoms.ilike.%${query}%,description.ilike.%${query}%`)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  const getCropImages = async (cropId: string): Promise<CropImage[]> => {
    try {
      const { data, error } = await supabase
        .from('crop_images')
        .select('*')
        .eq('crop_id', cropId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  const getCropDiseases = async (cropId: string): Promise<Disease[]> => {
    try {
      const { data, error } = await supabase
        .from('crop_diseases')
        .select(`
          diseases (*)
        `)
        .eq('crop_id', cropId);
      
      if (error) throw error;
      return data?.map((item: any) => item.diseases) || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  const getDiseasesForCrop = async (cropName: string): Promise<Disease[]> => {
    try {
      // First get the crop ID
      const { data: cropData, error: cropError } = await supabase
        .from('crops')
        .select('id')
        .eq('name', cropName)
        .single();
      
      if (cropError) throw cropError;
      
      // Then get diseases for this crop
      return await getCropDiseases(cropData.id);
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  const diagnoseFromImage = async (imageUrl: string, cropHint?: string): Promise<any> => {
    try {
      const { data, error } = await supabase.functions
        .invoke('crop-image-analysis', {
          body: {
            imageUrl,
            description: cropHint ? `Suspected crop: ${cropHint}` : 'Unknown crop'
          }
        });

      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const searchSimilarCases = async (symptoms: string[]): Promise<any[]> => {
    try {
      // Use the search vectors to find similar cases
      const { data, error } = await supabase
        .from('crop_search_vectors')
        .select(`
          *,
          crops (*),
          diseases (*)
        `)
        .eq('content_type', 'image_analysis')
        .limit(10);
      
      if (error) throw error;
      
      // In a real implementation, you would use vector similarity search
      // For now, we'll do a simple text search
      const query = symptoms.join(' ');
      return data?.filter(item => 
        item.content.toLowerCase().includes(query.toLowerCase())
      ) || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCrops(), fetchDiseases()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    crops,
    diseases,
    loading,
    error,
    searchCrops,
    searchDiseases,
    getCropImages,
    getCropDiseases,
    getDiseasesForCrop,
    diagnoseFromImage,
    searchSimilarCases,
    refreshData: () => {
      fetchCrops();
      fetchDiseases();
    }
  };
};