import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import 'react-native-url-polyfill/auto';

// Create a custom storage adapter for SecureStore
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper function to get the current session
export const getSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

// Helper function to sign in with email/password
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (!error && data.session) {
    // Apply login bonus for first-time non-guest users
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_guest')
      .eq('id', data.session.user.id)
      .single();
      
    if (profile && !profile.is_guest) {
      await supabase.rpc('apply_login_bonus');
    }
  }
  
  return { data, error };
};

// Helper function to sign up with email/password
export const signUpWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        is_guest: false,
      },
    },
  });
};

// Helper function to sign out
export const signOut = async () => {
  return await supabase.auth.signOut();
};

// Function to create a guest session
export const createGuestSession = async () => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/create-guest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
      },
    });
    
    const { session, error } = await response.json();
    
    if (error) throw error;
    if (!session) throw new Error('No session returned');
    
    // Set the session in the client
    const { error: authError } = await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
    
    if (authError) throw authError;
    
    return { session };
  } catch (error) {
    console.error('Error creating guest session:', error);
    throw error;
  }
};

// Function to convert guest to registered user
export const convertGuestToUser = async (email: string, password: string) => {
  try {
    // First, update the user's email and password
    const { error: updateError } = await supabase.auth.updateUser({
      email,
      password,
    });
    
    if (updateError) throw updateError;
    
    // Then update the profile to mark as non-guest
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ is_guest: false })
      .eq('id', supabase.auth.user()?.id);
      
    if (profileError) throw profileError;
    
    // Apply login bonus
    await supabase.rpc('apply_login_bonus');
    
    return { success: true };
  } catch (error) {
    console.error('Error converting guest to user:', error);
    throw error;
  }
};
