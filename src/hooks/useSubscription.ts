import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionState {
  subscribed: boolean;
  subscriptionTier: string | null;
  subscriptionEnd: string | null;
  loading: boolean;
  error: string | null;
}

export const useSubscription = () => {
  const { user, session } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    subscribed: false,
    subscriptionTier: null,
    subscriptionEnd: null,
    loading: false,
    error: null
  });

  const checkSubscription = async () => {
    if (!user || !session) {
      setState(prev => ({ ...prev, subscribed: false, loading: false }));
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      setState({
        subscribed: data.subscribed || false,
        subscriptionTier: data.subscription_tier || null,
        subscriptionEnd: data.subscription_end || null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to check subscription'
      }));
    }
  };

  const createCheckout = async (priceId: string, planName: string) => {
    if (!session) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId, planName },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;
      
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
      throw error;
    }
  };

  const manageSubscription = async () => {
    if (!session) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;
      
      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      throw error;
    }
  };

  // Check subscription when user or session changes
  useEffect(() => {
    if (user && session) {
      checkSubscription();
    }
  }, [user, session]);

  // Auto-refresh subscription every 30 seconds when user is active
  useEffect(() => {
    if (!user || !session) return;

    const interval = setInterval(() => {
      checkSubscription();
    }, 30000);

    return () => clearInterval(interval);
  }, [user, session]);

  return {
    ...state,
    checkSubscription,
    createCheckout,
    manageSubscription
  };
};