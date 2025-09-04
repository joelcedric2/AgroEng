import { useEffect, useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Scan, Calendar, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';

interface UsageStats {
  scansToday: number;
  scansThisMonth: number;
}

const PLAN_LIMITS = {
  Free: {
    scansPerDay: 5,
    scansPerMonth: 150,
    offlineAccess: false,
    advancedFeatures: false
  },
  Premium: {
    scansPerDay: Infinity,
    scansPerMonth: Infinity,
    offlineAccess: true,
    advancedFeatures: true
  },
  Enterprise: {
    scansPerDay: Infinity,
    scansPerMonth: Infinity,
    offlineAccess: true,
    advancedFeatures: true
  }
};

interface SubscriptionLimitsProps {
  onUpgrade?: () => void;
}

export const SubscriptionLimits = ({ onUpgrade }: SubscriptionLimitsProps) => {
  const { subscribed, subscriptionTier, subscriptionEnd } = useSubscription();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [usage, setUsage] = useState<UsageStats>({ scansToday: 0, scansThisMonth: 0 });
  const [loading, setLoading] = useState(true);

  const currentPlan = subscribed && subscriptionTier ? subscriptionTier : 'Free';
  const limits = PLAN_LIMITS[currentPlan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.Free;

  useEffect(() => {
    const fetchUsage = async () => {
      if (!user) return;

      try {
        const today = new Date().toISOString().split('T')[0];
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        // Get scans for today
        const { data: todayScans, error: todayError } = await supabase
          .from('scans')
          .select('id')
          .eq('user_id', user.id)
          .gte('created_at', today);

        // Get scans for this month
        const { data: monthScans, error: monthError } = await supabase
          .from('scans')
          .select('id')
          .eq('user_id', user.id)
          .gte('created_at', startOfMonth.toISOString());

        if (todayError || monthError) {
          console.error('Error fetching usage:', todayError || monthError);
          return;
        }

        setUsage({
          scansToday: todayScans?.length || 0,
          scansThisMonth: monthScans?.length || 0
        });
      } catch (error) {
        console.error('Error fetching usage stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, [user]);

  const canScan = () => {
    if (subscribed) return true;
    return usage.scansToday < limits.scansPerDay;
  };

  const getDailyProgress = () => {
    if (limits.scansPerDay === Infinity) return 0;
    return (usage.scansToday / limits.scansPerDay) * 100;
  };

  const getMonthlyProgress = () => {
    if (limits.scansPerMonth === Infinity) return 0;
    return (usage.scansThisMonth / limits.scansPerMonth) * 100;
  };

  const isNearLimit = () => {
    return !subscribed && usage.scansToday >= limits.scansPerDay * 0.8;
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-2 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${isNearLimit() ? 'border-orange-200 bg-orange-50/50' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          {subscribed ? (
            <Crown className="w-5 h-5 text-primary" />
          ) : (
            <Scan className="w-5 h-5 text-muted-foreground" />
          )}
          {t('Your Plan')}: {t(currentPlan)}
        </CardTitle>
        
        {subscribed ? (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {t('Active')}
          </Badge>
        ) : (
          <Badge variant="outline">
            {t('Free')}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {!subscribed && (
          <>
            {/* Daily Scan Limit */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{t('Scans Today')}</span>
                <span className="font-medium">
                  {usage.scansToday} / {limits.scansPerDay}
                </span>
              </div>
              <Progress 
                value={getDailyProgress()} 
                className={`h-2 ${getDailyProgress() >= 100 ? 'bg-red-100' : ''}`}
              />
              {!canScan() && (
                <div className="flex items-center gap-2 text-orange-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{t('Daily limit reached. Upgrade for unlimited scans.')}</span>
                </div>
              )}
            </div>

            {/* Monthly Scan Limit */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{t('Scans This Month')}</span>
                <span className="font-medium">
                  {usage.scansThisMonth} / {limits.scansPerMonth}
                </span>
              </div>
              <Progress value={getMonthlyProgress()} className="h-2" />
            </div>
          </>
        )}

        {subscribed && subscriptionEnd && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {t('Renews on')} {format(new Date(subscriptionEnd), 'MMM dd, yyyy')}
            </span>
          </div>
        )}

        {!subscribed && (
          <div className="pt-2">
            <Button 
              onClick={onUpgrade}
              className="w-full"
              variant={isNearLimit() ? 'default' : 'outline'}
            >
              <Crown className="w-4 h-4 mr-2" />
              {t('Upgrade to Premium')}
            </Button>
          </div>
        )}

        {/* Feature List */}
        <div className="pt-4 border-t">
          <h4 className="font-medium text-sm mb-2">{t('Plan Features')}</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${limits.scansPerDay === Infinity ? 'bg-green-500' : 'bg-orange-500'}`} />
              {limits.scansPerDay === Infinity ? t('Unlimited scans') : t(`${limits.scansPerDay} scans per day`)}
            </li>
            <li className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${limits.offlineAccess ? 'bg-green-500' : 'bg-gray-300'}`} />
              {limits.offlineAccess ? t('Full offline access') : t('Limited offline access')}
            </li>
            <li className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${limits.advancedFeatures ? 'bg-green-500' : 'bg-gray-300'}`} />
              {limits.advancedFeatures ? t('Advanced AI features') : t('Basic features only')}
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

// Hook to check if user can perform actions
export const useSubscriptionLimits = () => {
  const { subscribed, subscriptionTier } = useSubscription();
  const { user } = useAuth();
  const [usage, setUsage] = useState<UsageStats>({ scansToday: 0, scansThisMonth: 0 });

  const currentPlan = subscribed && subscriptionTier ? subscriptionTier : 'Free';
  const limits = PLAN_LIMITS[currentPlan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.Free;

  useEffect(() => {
    const fetchUsage = async () => {
      if (!user) return;

      try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data: todayScans } = await supabase
          .from('scans')
          .select('id')
          .eq('user_id', user.id)
          .gte('created_at', today);

        setUsage(prev => ({
          ...prev,
          scansToday: todayScans?.length || 0
        }));
      } catch (error) {
        console.error('Error fetching usage:', error);
      }
    };

    fetchUsage();
  }, [user]);

  const canScan = () => {
    if (subscribed) return true;
    return usage.scansToday < limits.scansPerDay;
  };

  const canUseOfflineFeatures = () => {
    return limits.offlineAccess;
  };

  const canUseAdvancedFeatures = () => {
    return limits.advancedFeatures;
  };

  const incrementScanUsage = () => {
    setUsage(prev => ({
      ...prev,
      scansToday: prev.scansToday + 1
    }));
  };

  return {
    canScan,
    canUseOfflineFeatures,
    canUseAdvancedFeatures,
    incrementScanUsage,
    usage,
    limits,
    currentPlan
  };
};