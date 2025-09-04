import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface Profile {
  id: string;
  email?: string | null;
  full_name?: string | null;
  phone_number?: string | null;
  region?: string | null;
  bio?: string | null;
  farming_experience?: string | null;
  primary_crops?: string[] | null;
  farm_size_hectares?: number | null;
  preferred_language?: string | null;
  audio_language?: string | null;
  timezone?: string | null;
  notification_preferences?: {
    tips: boolean;
    alerts: boolean;
    reminders: boolean;
  } | null;
  role: string;
  created_at: string;
  updated_at: string;
}

interface UpdateProfileData {
  full_name?: string;
  email?: string;
  phone_number?: string;
  region?: string;
  bio?: string;
  farming_experience?: string;
  primary_crops?: string[];
  farm_size_hectares?: number | null;
  preferred_language?: string;
  audio_language?: string;
  timezone?: string;
  notification_preferences?: {
    tips: boolean;
    alerts: boolean;
    reminders: boolean;
  };
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, this is expected for new users
          setProfile(null);
        } else {
          throw error;
        }
        } else {
          // Transform the data to match our interface
          const transformedData = {
            ...data,
            notification_preferences: data.notification_preferences as {
              tips: boolean;
              alerts: boolean;
              reminders: boolean;
            }
          };
          setProfile(transformedData);
        }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: UpdateProfileData): Promise<boolean> => {
    if (!user) return false;

    try {
      // Check if profile exists, if not create it
      if (!profile) {
        const { data, error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            ...updates
          })
          .select()
          .single();

        if (error) throw error;

        const transformedData = {
          ...data,
          notification_preferences: data.notification_preferences as {
            tips: boolean;
            alerts: boolean;
            reminders: boolean;
          }
        };
        setProfile(transformedData);
      } else {
        // Update existing profile
        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single();

        if (error) throw error;

        const transformedData = {
          ...data,
          notification_preferences: data.notification_preferences as {
            tips: boolean;
            alerts: boolean;
            reminders: boolean;
          }
        };
        setProfile(transformedData);
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      return true;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error updating profile",
        description: err.message,
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile: fetchProfile
  };
};