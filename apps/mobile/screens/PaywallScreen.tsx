import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  Platform,
  Linking,
  SafeAreaView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

type SubscriptionPlan = {
  id: string;
  name: string;
  price: string;
  period: string;
  pricePerMonth: string;
  isPopular: boolean;
  features: string[];
  productId: string;
};

type PaywallScreenRouteParams = {
  feature?: 'scan' | 'history' | 'favorites' | 'premium';
  currentPlan?: string;
};

export function PaywallScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { feature, currentPlan } = route.params as PaywallScreenRouteParams;
  const { user, isGuest, subscription, restorePurchases } = useAuth();
  
  const [selectedPlan, setSelectedPlan] = useState<string>('yearly');
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Subscription plans data
  const plans: Record<string, SubscriptionPlan> = {
    monthly: {
      id: 'premium_monthly',
      name: 'Premium',
      price: '$9.99',
      period: 'per month',
      pricePerMonth: '$9.99',
      isPopular: false,
      features: [
        'Unlimited plant disease scans',
        'Unlimited history storage',
        'Unlimited favorites',
        'Priority support',
        'Weekly plant care tips'
      ],
      productId: Platform.OS === 'ios' ? 'com.agroeng.premium.monthly' : 'premium_monthly'
    },
    yearly: {
      id: 'premium_yearly',
      name: 'Premium',
      price: '$59.99',
      period: 'per year',
      pricePerMonth: '$4.99',
      isPopular: true,
      features: [
        'Unlimited plant disease scans',
        'Unlimited history storage',
        'Unlimited favorites',
        'Priority support',
        'Weekly plant care tips',
        'Save 50% compared to monthly'
      ],
      productId: Platform.OS === 'ios' ? 'com.agroeng.premium.yearly' : 'premium_yearly'
    },
    lifetime: {
      id: 'premium_lifetime',
      name: 'Lifetime',
      price: '$149.99',
      period: 'one-time payment',
      pricePerMonth: 'One-time',
      isPopular: false,
      features: [
        'All Premium features',
        'Pay once, use forever',
        'No subscription',
        'Priority support',
        'Exclusive content',
        'Best value'
      ],
      productId: Platform.OS === 'ios' ? 'com.agroeng.premium.lifetime' : 'premium_lifetime'
    }
  };

  // Get the feature message based on what triggered the paywall
  const getFeatureMessage = () => {
    switch (feature) {
      case 'scan':
        return 'You\'ve used all your free scans. Upgrade to continue identifying plant diseases.';
      case 'history':
        return 'Save more of your plant scans by upgrading to Premium.';
      case 'favorites':
        return 'Save more plants to your favorites with a Premium subscription.';
      case 'premium':
      default:
        return 'Upgrade to unlock all Premium features and get the most out of AgroEng.';
    }
  };

  // Handle subscription purchase
  const handleSubscribe = async (planId: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call your payment processing service
      // For now, we'll simulate a successful purchase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // After successful purchase, you would typically:
      // 1. Update the user's subscription status in your backend
      // 2. Update the app state to reflect the new subscription
      // 3. Navigate to a success screen or back to the previous screen
      
      Alert.alert(
        'Subscription Successful',
        'Thank you for subscribing to AgroEng Premium! Your subscription is now active.',
        [
          { 
            text: 'Continue',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Subscription error:', error);
      setError('Failed to complete the purchase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle restore purchases
  const handleRestorePurchases = async () => {
    if (isRestoring) return;
    
    setIsRestoring(true);
    setError(null);
    
    try {
      const success = await restorePurchases();
      
      if (success) {
        Alert.alert(
          'Restore Successful',
          'Your previous purchases have been restored.',
          [{ text: 'OK' }]
        );
      } else {
        setError('No previous purchases found or restore failed.');
      }
    } catch (error) {
      console.error('Restore error:', error);
      setError('Failed to restore purchases. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  };

  // Handle terms and privacy links
  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => 
      console.error('Failed to open URL:', err)
    );
  };

  // Get the current plan display name
  const getCurrentPlanName = () => {
    if (!currentPlan) return 'Free';
    return plans[currentPlan]?.name || 'Free';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          >
            <Image 
              source={require('../../assets/close.png')} 
              style={styles.closeIcon} 
            />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/logo.png')} 
              style={styles.logo} 
            />
          </View>
          
          <View style={{ width: 40 }} />
        </View>
        
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Go Premium</Text>
          <Text style={styles.heroSubtitle}>{getFeatureMessage()}</Text>
          
          {currentPlan && (
            <View style={styles.currentPlanBadge}>
              <Text style={styles.currentPlanText}>
                Current Plan: {getCurrentPlanName()}
              </Text>
            </View>
          )}
        </View>
        
        {/* Toggle between monthly/yearly */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Billed {selectedPlan === 'yearly' ? 'Annually' : 'Monthly'}</Text>
          <TouchableOpacity 
            style={styles.toggle}
            onPress={() => setSelectedPlan(prev => prev === 'yearly' ? 'monthly' : 'yearly')}
            disabled={isLoading}
          >
            <View 
              style={[
                styles.toggleOption, 
                selectedPlan === 'monthly' && styles.toggleOptionActive
              ]}
            >
              <Text 
                style={[
                  styles.toggleText,
                  selectedPlan === 'monthly' && styles.toggleTextActive
                ]}
              >
                Monthly
              </Text>
            </View>
            <View 
              style={[
                styles.toggleOption, 
                selectedPlan === 'yearly' && styles.toggleOptionActive
              ]}
            >
              <Text 
                style={[
                  styles.toggleText,
                  selectedPlan === 'yearly' && styles.toggleTextActive
                ]}
              >
                Yearly
              </Text>
              <View style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>Save 50%</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Plans */}
        <View style={styles.plansContainer}>
          {Object.entries(plans)
            .filter(([key]) => key === selectedPlan || key === 'lifetime')
            .map(([key, plan]) => (
              <View 
                key={key} 
                style={[
                  styles.planCard,
                  plan.isPopular && styles.popularPlanCard,
                  key === 'lifetime' && styles.lifetimeCard
                ]}
              >
                {plan.isPopular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                  </View>
                )}
                
                {key === 'lifetime' && (
                  <View style={styles.lifetimeBadge}>
                    <Text style={styles.lifetimeBadgeText}>BEST VALUE</Text>
                  </View>
                )}
                
                <Text style={styles.planName}>{plan.name}</Text>
                
                <View style={styles.planPriceContainer}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planPeriod}>/{plan.period}</Text>
                </View>
                
                {plan.pricePerMonth !== 'One-time' && (
                  <Text style={styles.planPriceMonth}>
                    {plan.pricePerMonth} per month
                  </Text>
                )}
                
                <View style={styles.planFeatures}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Image 
                        source={require('../../assets/check-circle.png')} 
                        style={styles.featureIcon} 
                      />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
                
                <TouchableOpacity 
                  style={[
                    styles.subscribeButton,
                    (isLoading || isRestoring) && styles.subscribeButtonDisabled
                  ]}
                  onPress={() => handleSubscribe(plan.id)}
                  disabled={isLoading || isRestoring}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.subscribeButtonText}>
                      {key === 'lifetime' ? 'Get Lifetime Access' : 'Subscribe Now'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ))}
        </View>
        
        {/* Restore Purchases */}
        <TouchableOpacity 
          style={styles.restoreButton}
          onPress={handleRestorePurchases}
          disabled={isRestoring || isLoading}
        >
          <Text style={styles.restoreButtonText}>
            {isRestoring ? 'Restoring...' : 'Restore Purchases'}
          </Text>
        </TouchableOpacity>
        
        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By subscribing, you agree to our{' '}
            <Text 
              style={styles.footerLink}
              onPress={() => openLink('https://yourapp.com/terms')}
            >
              Terms of Service
            </Text>{' '}
            and{' '}
            <Text 
              style={styles.footerLink}
              onPress={() => openLink('https://yourapp.com/privacy')}
            >
              Privacy Policy
            </Text>. 
            Your subscription will automatically renew unless canceled at least 24 hours before the end of the current period. 
            You can manage your subscription in your account settings.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    width: 24,
    height: 24,
    tintColor: '#666',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  hero: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  currentPlanBadge: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  currentPlanText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '500',
  },
  toggleContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    width: '100%',
    maxWidth: 300,
    position: 'relative',
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  toggleOptionActive: {
    backgroundColor: '#4CAF50',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  toggleTextActive: {
    color: '#fff',
  },
  saveBadge: {
    position: 'absolute',
    top: -18,
    right: 0,
    backgroundColor: '#FFC107',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  saveBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  plansContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    position: 'relative',
    overflow: 'hidden',
  },
  popularPlanCard: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  lifetimeCard: {
    borderColor: '#2196F3',
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 8,
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  lifetimeBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#2196F3',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 8,
  },
  lifetimeBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  planPriceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 40,
  },
  planPeriod: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
    marginBottom: 4,
  },
  planPriceMonth: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  planFeatures: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    width: 20,
    height: 20,
    tintColor: '#4CAF50',
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeButtonDisabled: {
    opacity: 0.7,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  restoreButton: {
    alignSelf: 'center',
    padding: 12,
    marginBottom: 24,
  },
  restoreButtonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#9E9E9E',
    textAlign: 'center',
    lineHeight: 16,
  },
  footerLink: {
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
});
