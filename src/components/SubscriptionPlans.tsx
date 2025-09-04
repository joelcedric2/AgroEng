import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Sparkles, Zap, Loader2 } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const plans = [
  {
    name: 'Free',
    priceId: null,
    price: '$0',
    period: '/month',
    description: 'Get started with basic plant care',
    features: [
      '5 scans per day',
      'Basic plant identification',
      'Simple care tips',
      'Limited offline access'
    ],
    icon: Sparkles,
    popular: false,
    tier: null
  },
  {
    name: 'Premium',
    priceId: 'price_1QbexeRuFpK1GBPJhF9Zj8yH', // Replace with your actual Stripe price ID
    price: '$2.99',
    period: '/month',
    description: 'Advanced features for serious gardeners',
    features: [
      'Unlimited scans',
      'Advanced AI diagnosis',
      'Detailed treatment plans',
      'Full offline access',
      'Expert recommendations',
      'Disease prevention tips'
    ],
    icon: Crown,
    popular: true,
    tier: 'Premium'
  },
  {
    name: 'Pro',
    priceId: 'price_1QbeyeRuFpK1GBPJxK3Lm9wN', // Replace with your actual Stripe price ID
    price: '$5.99',
    period: '/month',
    description: 'For professional farmers and garden centers',
    features: [
      'Everything in Premium',
      'Batch processing',
      'Export reports',
      'Priority support',
      'Advanced analytics',
      'Multi-language support',
      'Custom recommendations'
    ],
    icon: Zap,
    popular: false,
    tier: 'Enterprise'
  }
];

export const SubscriptionPlans = () => {
  const { subscribed, subscriptionTier, createCheckout, manageSubscription } = useSubscription();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, planName: string) => {
    if (!priceId) return;
    
    try {
      setLoading(priceId);
      await createCheckout(priceId, planName);
      toast({
        title: t('Redirecting to Stripe'),
        description: t('You will be redirected to complete your subscription.')
      });
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: t('Error'),
        description: t('Failed to start subscription process. Please try again.'),
        variant: 'destructive'
      });
    } finally {
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setLoading('manage');
      await manageSubscription();
      toast({
        title: t('Redirecting to Stripe'),
        description: t('You will be redirected to manage your subscription.')
      });
    } catch (error) {
      console.error('Manage subscription error:', error);
      toast({
        title: t('Error'),
        description: t('Failed to open subscription management. Please try again.'),
        variant: 'destructive'
      });
    } finally {
      setLoading(null);
    }
  };

  const isCurrentPlan = (planTier: string | null) => {
    if (!subscribed && !planTier) return true; // Free plan
    return subscribed && subscriptionTier === planTier;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          {t('Choose Your Plan')}
        </h2>
        <p className="text-muted-foreground text-lg">
          {t('Select the perfect plan for your plant care needs')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = isCurrentPlan(plan.tier);
          
          return (
            <Card 
              key={plan.name} 
              className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''} ${isCurrent ? 'ring-2 ring-primary' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  {t('Most Popular')}
                </Badge>
              )}
              
              {isCurrent && (
                <Badge className="absolute -top-3 right-4 bg-green-500 text-white">
                  {t('Current Plan')}
                </Badge>
              )}

              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">{t(plan.name)}</CardTitle>
                <div className="text-3xl font-bold text-primary">
                  {plan.price}
                  <span className="text-sm text-muted-foreground font-normal">
                    {t(plan.period)}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">{t(plan.description)}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span>{t(feature)}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  subscribed ? (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleManageSubscription}
                      disabled={loading === 'manage'}
                    >
                      {loading === 'manage' ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      {t('Manage Subscription')}
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      {t('Current Plan')}
                    </Button>
                  )
                ) : (
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => plan.priceId && handleSubscribe(plan.priceId, plan.name)}
                    disabled={!plan.priceId || loading === plan.priceId}
                  >
                    {loading === plan.priceId ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {plan.priceId ? t('Subscribe') : t('Current Plan')}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {subscribed && (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            {t('Need to make changes?')} {' '}
            <Button 
              variant="link" 
              className="p-0 h-auto text-primary"
              onClick={handleManageSubscription}
              disabled={loading === 'manage'}
            >
              {t('Manage your subscription')}
            </Button>
          </p>
        </div>
      )}
    </div>
  );
};