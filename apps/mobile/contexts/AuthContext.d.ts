declare module 'contexts/AuthContext' {
  import { ReactNode } from 'react';
  
  interface UserProfile {
    id: string;
    email: string | null;
    is_guest: boolean;
    plan: 'free' | 'premium' | 'pro';
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
    updateUsage: (feature: 'scan' | 'saveHistory' | 'saveFavorite') => Promise<void>;
  }

  interface AuthContextType {
    session: any; // Replace with actual session type if available
    user: UserProfile | null;
    isLoading: boolean;
    isGuest: boolean;
    isSubscribed: boolean;
    guestFeatures: GuestFeatures;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    refreshSession: () => Promise<void>;
    error: Error | null;
  }

  export const useAuth: () => AuthContextType;
  
  export interface AuthProviderProps {
    children: ReactNode;
  }
  
  export const AuthProvider: React.FC<AuthProviderProps>;
}
