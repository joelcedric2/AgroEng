import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

type Plan = {
  id: 'premium' | 'pro';
  name: string;
  price: string;
  pricePerMonth: string;
  features: string[];
  popular?: boolean;
};

const PLANS: Plan[] = [
  {
    id: 'premium',
    name: 'Premium',
    price: '$2.99',
    pricePerMonth: '$2.99/month',
    features: [
      'Unlimited disease scans',
      'Advanced AI diagnosis',
      'Treatment plans',
      'Offline access',
      'Priority support',
    ],
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$5.99',
    pricePerMonth: '$5.99/month',
    features: [
      'Everything in Premium',
      'Unlimited offline storage',
      'Early access to new features',
      'Dedicated support',
      'Team management',
    ],
  },
];

interface PaywallSheetProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PaywallSheet: React.FC<PaywallSheetProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan['id']>('premium');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!session?.user?.id) {
      setError('You must be logged in to subscribe');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would redirect to Stripe Checkout
      // For now, we'll simulate a successful subscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the user's plan in the database
      const updates = {
        plan: selectedPlan,
        is_guest: false,
        // Reset guest usage counters when upgrading
        ...(session.user.app_metadata?.is_guest && {
          scans_used: 0,
          history_used: 0,
          favorites_used: 0
        })
      };
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session.user.id);
        
      if (updateError) throw updateError;
      
      // Refresh the session to get the latest plan
      const { data: { session: newSession } } = await supabase.auth.refreshSession();
      
      if (!newSession) {
        throw new Error('Failed to refresh session after subscription');
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Subscription error:', error);
      setError('Failed to process subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a message for guest users
  const isGuest = session?.user?.app_metadata?.is_guest === true;

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isGuest ? 'Unlock Full Access' : 'Upgrade to Premium'}
          </Text>
          <Text style={styles.subtitle}>
            {isGuest 
              ? 'Subscribe to continue using all features without limits' 
              : 'Get unlimited access to all features'}
          </Text>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.plansContainer}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <View style={styles.plansGrid}>
            {PLANS.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.planCardSelected,
                  plan.popular && styles.popularBadge,
                ]}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.8}
              >
                {plan.popular && (
                  <View style={styles.popularTag}>
                    <Text style={styles.popularTagText}>MOST POPULAR</Text>
                  </View>
                )}
                
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.planPriceSubtitle}>{plan.pricePerMonth}</Text>
                
                <View style={styles.featuresList}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.radioButton}>
                  {selectedPlan === plan.id && (
                    <View style={styles.radioButtonSelected} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.subscribeButton, isLoading && styles.subscribeButtonDisabled]}
              onPress={handleSubscribe}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.subscribeButtonText}>
                  Subscribe to {selectedPlan === 'premium' ? 'Premium' : 'Pro'}
                </Text>
              )}
            </TouchableOpacity>
            
            <Text style={styles.legalText}>
              Your subscription will automatically renew unless canceled at least 24 hours before the end of the current period. You can manage your subscription in your account settings.
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 30,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
  },
  plansContainer: {
    padding: 20,
  },
  plansGrid: {
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  planCardSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#f0f9f0',
  },
  popularBadge: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginTop: 20,
    position: 'relative',
    overflow: 'visible',
  },
  popularTag: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
  },
  popularTagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
    textAlign: 'center',
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 5,
  },
  planPriceSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresList: {
    marginTop: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 20,
    right: 20,
  },
  radioButtonSelected: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
  },
  footer: {
    paddingHorizontal: 10,
  },
  subscribeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  subscribeButtonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  legalText: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 14,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    color: '#f44336',
    textAlign: 'center',
  },
});
