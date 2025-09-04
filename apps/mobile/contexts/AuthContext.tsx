import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import * as SecureStore from 'expo-secure-store';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEntitlements } from '../hooks/useEntitlements';

// Guest limits
const GUEST_LIMITS = {
  maxScans: 5,
  maxHistory: 5,
  maxFavorites: 5,
} as const;

type PlanType = 'free' | 'premium' | 'pro';

interface UserProfile {
  id: string;
  email: string | null;
  is_guest: boolean;
  plan: PlanType;
  scans_used: number;
  history_used: number;
  favorites_used: number;
  created_at: string;
  updated_at: string;
  has_received_bonus?: boolean;
}

interface GuestFeatures {
  remainingScans: number;
  canPerformAction: (feature: 'scan' | 'saveHistory' | 'saveFavorite') => boolean;
  incrementUsage: (feature: 'scan' | 'saveHistory' | 'saveFavorite') => Promise<void>;
}

interface AuthContextType {
  session: Session | null;
  user: UserProfile | null;
  isLoading: boolean;
  isGuest: boolean;
  isSubscribed: boolean;
  guestFeatures: GuestFeatures;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetGuestUsage: () => void;
  refreshSession: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<{ error: Error | null }>;
}

// Secure storage keys
const GUEST_USAGE_KEY = 'guest_usage';
const GUEST_ID_KEY = 'guest_id';

// Default guest user
const DEFAULT_GUEST_USER: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'> = {
  email: null,
  is_guest: true,
  plan: 'free',
  scans_used: 0,
  history_used: 0,
  favorites_used: 0,
  has_received_bonus: false,
};

// Helper to generate a guest ID
const generateGuestId = () => `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const queryClient = useQueryClient();
  const { data: entitlements } = useEntitlements();

  // Update user when session changes
  useEffect(() => {
    if (!session?.user) {
      setUser(null);
      return;
    }

    const isGuest = session.user.app_metadata?.is_guest === true;
    const userEmail = session.user.email || null;

    setUser({
      id: session.user.id,
      email: userEmail,
      is_guest: isGuest,
      plan: 'free',
      scans_used: 0,
      history_used: 0,
      favorites_used: 0,
      created_at: '',
      updated_at: '',
      has_received_bonus: false,
    });
  }, [session]);

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentSession = await supabase.auth.getSession();
        setSession(currentSession.data.session);

        // If no session, create a guest session
        if (!currentSession.data.session) {
          await supabase.auth.signOut();
          const { data, error } = await supabase.functions.invoke<{ session: Session }>('create-guest');
          if (data?.session) {
            setSession(data.session);
          } else if (error) {
            console.error('Error creating guest session:', error);
          } else {
            console.error('Unexpected response format from create-guest:', data);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);

      // If signed out, create a new guest session
      if (event === 'SIGNED_OUT') {
        supabase.functions.invoke<{ session: Session }>('create-guest')
          .then(({ data }) => {
            if (data?.session) {
              setSession(data.session);
            }
          })
          .catch(error => {
            console.error('Error creating guest session:', error);
          });
      }

      // Invalidate queries that depend on auth state
      queryClient.invalidateQueries({ queryKey: ['entitlements'] });
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [queryClient]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        return { error };
      }

      if (data?.session) {
        setSession(data.session);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) return { error };

      if (data?.session) {
        setSession(data.session);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetGuestUsage = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(GUEST_USAGE_KEY);
      await SecureStore.deleteItemAsync(GUEST_ID_KEY);
    } catch (error) {
      console.error('Error resetting guest usage:', error);
    }
  }, []);

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        throw error;
      }

      if (data?.session) {
        setSession(data.session);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  const guestFeatures: GuestFeatures = {
    remainingScans: Math.max(0, GUEST_LIMITS.maxScans - (user?.scans_used ?? 0)),
    canPerformAction: (feature: 'scan' | 'saveHistory' | 'saveFavorite') => {
      if (!user?.is_guest) return true;
      
      switch (feature) {
        case 'scan':
          return (user.scans_used ?? 0) < GUEST_LIMITS.maxScans;
        case 'saveHistory':
          return (user.history_used ?? 0) < GUEST_LIMITS.maxHistory;
        case 'saveFavorite':
          return (user.favorites_used ?? 0) < GUEST_LIMITS.maxFavorites;
        default:
          return false;
      }
    },
    incrementUsage: async (feature: 'scan' | 'saveHistory' | 'saveFavorite') => {
      if (!user?.is_guest) return;
      
      const updates: Partial<UserProfile> = {
        updated_at: new Date().toISOString(),
      };
      
      switch (feature) {
        case 'scan':
          updates.scans_used = (user.scans_used || 0) + 1;
          break;
        case 'saveHistory':
          updates.history_used = (user.history_used || 0) + 1;
          break;
        case 'saveFavorite':
          updates.favorites_used = (user.favorites_used || 0) + 1;
          break;
      }
      
      await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
    },
  };

  const isSubscribed = user?.plan !== 'free';
  
  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        isGuest: user?.is_guest ?? false,
        isSubscribed,
        guestFeatures,
        signIn,
        signUp,
        signOut,
        resetGuestUsage,
        refreshSession,
        resendVerificationEmail: async (email: string) => {
          const { error } = await supabase.auth.resend({
            type: 'signup',
            email,
            options: {
              emailRedirectTo: 'agroeng://email-confirm',
            },
          });
          return { error };
        },
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

