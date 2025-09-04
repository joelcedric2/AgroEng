import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export type Entitlements = {
  user_id: string;
  plan: 'free' | 'premium' | 'pro';
  is_guest: boolean;
  scan_credits: number;
  tips_unlimited: boolean;
  advanced_ai: boolean;
  treatment_plans: boolean;
  offline_full: boolean;
};

export const useEntitlements = () => {
  return useQuery<Entitlements | null>({
    queryKey: ['entitlements'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;
      
      const { data, error } = await supabase
        .from('entitlements')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
        
      if (error) throw error;
      return data;
    },
  });
};

export const useCanUseScan = () => {
  const { data: entitlements } = useEntitlements();
  
  if (!entitlements) return { canUse: false, reason: 'not_authenticated' };
  if (entitlements.scan_credits <= 0 && entitlements.plan === 'free') {
    return { canUse: false, reason: 'no_credits' };
  }
  return { canUse: true, reason: null };
};

export const useConsumeScanCredit = () => {
  const queryClient = useQueryClient();
  
  return async (): Promise<{ success: boolean; remainingCredits?: number }> => {
    try {
      const { data, error } = await supabase.rpc('decrement_scan_credit');
      
      if (error) throw error;
      if (!data || data[0]?.remaining === -1) {
        return { success: false };
      }
      
      // Invalidate the entitlements query to refetch
      await queryClient.invalidateQueries({ queryKey: ['entitlements'] });
      
      return { success: true, remainingCredits: data[0]?.remaining };
    } catch (error) {
      console.error('Error consuming scan credit:', error);
      return { success: false };
    }
  };
};

export const useApplyLoginBonus = () => {
  const queryClient = useQueryClient();
  
  return async (): Promise<{ success: boolean }> => {
    try {
      const { error } = await supabase.rpc('apply_login_bonus');
      
      if (error) throw error;
      
      // Invalidate the entitlements query to refetch
      await queryClient.invalidateQueries({ queryKey: ['entitlements'] });
      
      return { success: true };
    } catch (error) {
      console.error('Error applying login bonus:', error);
      return { success: false };
    }
  };
};

export const useIsFeatureEnabled = (feature: keyof Omit<Entitlements, 'user_id' | 'plan' | 'is_guest' | 'scan_credits'>) => {
  const { data: entitlements } = useEntitlements();
  
  if (!entitlements) return false;
  return entitlements[feature] === true;
};
