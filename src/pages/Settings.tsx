import { useState } from "react";
import { PageLayout } from "@/components/ui/page-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Globe, 
  Bell, 
  Moon, 
  Wifi, 
  ChevronRight, 
  CreditCard,
  HelpCircle,
  Shield,
  Languages,
  Volume2,
  Download,
  MapPin,
  Sprout
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { ProfileEditor } from "@/components/ProfileEditor";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";
import { SubscriptionLimits } from "@/components/SubscriptionLimits";
import { useSubscription } from "@/hooks/useSubscription";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useOfflineStorage } from "@/hooks/useOfflineStorage";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { language, setLanguage, t } = useLanguage();
  const { subscribed, subscriptionTier } = useSubscription();
  const { 
    isOffline, 
    offlineData, 
    downloadCache, 
    cacheSize, 
    syncOfflineData,
    clearOfflineData 
  } = useOfflineStorage();
  
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (localStorage.getItem('theme') === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [offlineMode, setOfflineMode] = useState(() => {
    return localStorage.getItem('offline-mode') === 'true';
  });
  const [audioLanguage, setAudioLanguage] = useState(profile?.audio_language || language);
  const [isDownloadingCache, setIsDownloadingCache] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showSubscriptionPlans, setShowSubscriptionPlans] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [assigningRole, setAssigningRole] = useState(false);

  const displayLanguages = [
    { value: "english", label: "English" },
    { value: "french", label: "French" },
    { value: "hausa", label: "Hausa" },
    { value: "yoruba", label: "Yoruba" },
    { value: "igbo", label: "Igbo" },
    { value: "swahili", label: "Swahili" },
    { value: "wolof", label: "Wolof" },
    { value: "bambara", label: "Bambara" },
    { value: "fula", label: "Fula" },
    { value: "twi", label: "Twi" },
  ];

  // Update audio language when profile loads or app language changes
  useEffect(() => {
    if (profile?.audio_language) {
      setAudioLanguage(profile.audio_language);
    } else {
      // If no manual audio language set, sync with app language
      setAudioLanguage(language);
    }
  }, [profile, language]);

  // Handler to update audio language in profile
  const handleAudioLanguageChange = async (value: string) => {
    setAudioLanguage(value);
    await updateProfile({ audio_language: value });
    toast({
      title: t('toast.languageUpdated'),
      description: `${t('settings.audioLanguage')}: ${audioLanguages.find(lang => lang.value === value)?.label}`,
    });
  };

  // Handler to update display language
  const handleDisplayLanguageChange = (value: string) => {
    const newLanguage = value as any;
    setLanguage(newLanguage);
    
    // Auto-update audio language to match unless user has manually set it differently
    if (!profile?.audio_language || audioLanguage === language) {
      setAudioLanguage(newLanguage);
      updateProfile({ audio_language: newLanguage });
    }
    
    toast({
      title: t('toast.languageUpdated'),
      description: `${t('settings.language')}: ${displayLanguages.find(lang => lang.value === value)?.label}`,
    });
  };

  // Handler for offline mode toggle
  const handleOfflineModeChange = (checked: boolean) => {
    setOfflineMode(checked);
    localStorage.setItem('offline-mode', checked.toString());
    
    if (checked) {
      // Enable offline mode
      toast({
        title: t('toast.offlineModeEnabled'),
        description: t('toast.offlineDesc'),
      });
    } else {
      // Disable offline mode and clear cache
      clearOfflineData();
      toast({
        title: t('toast.offlineModeDisabled'),
        description: t('toast.onlineDesc'),
      });
    }
  };

  // Handler for dark mode toggle
  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked);
    const theme = checked ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    
    // Apply theme to document
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast({
      title: t('toast.themeUpdated'),
      description: `${t('toast.switchedTo')} ${checked ? 'dark' : 'light'} ${t('toast.mode')}`,
    });
  };

  const audioLanguages = [
    { value: "english", label: "English" },
    { value: "french", label: "French" },
    { value: "hausa", label: "Hausa" },
    { value: "yoruba", label: "Yoruba" },
    { value: "igbo", label: "Igbo" },
    { value: "fula", label: "Fula" },
    { value: "twi", label: "Twi" },
    { value: "akan", label: "Akan" },
    { value: "ga", label: "Ga" },
    { value: "ewe", label: "Ewe" },
    { value: "dagbani", label: "Dagbani" },
    { value: "bambara", label: "Bambara" },
    { value: "dioula", label: "Dioula" },
    { value: "krio", label: "Krio" },
    { value: "temne", label: "Temne" },
    { value: "wolof", label: "Wolof" },
    { value: "serer", label: "Serer" },
    { value: "soninke", label: "Soninke" },
    { value: "gurmanchema", label: "Gurmanchéma" },
    { value: "mossi", label: "Mossi" },
    { value: "zarma", label: "Zarma" },
    { value: "kanuri", label: "Kanuri" },
    { value: "baatonum", label: "Baatonum" },
    { value: "lingala", label: "Lingala" },
    { value: "kikongo", label: "Kikongo" },
    { value: "swahili", label: "Swahili" },
    { value: "tshiluba", label: "Tshiluba" },
    { value: "fang", label: "Fang" },
    { value: "sango", label: "Sango" },
    { value: "gbaya", label: "Gbaya" },
    { value: "ngambay", label: "Ngambay" },
    { value: "beti", label: "Beti" },
    { value: "bassa", label: "Bassa" },
    { value: "duala", label: "Duala" },
    { value: "bakweri", label: "Bakweri" },
    { value: "pidgin", label: "Pidgin English" },
    { value: "bamileke", label: "Bamileke" },
    { value: "fulfulde", label: "Fulfulde" },
    { value: "toupouri", label: "Toupouri" },
    { value: "sara", label: "Sara" },
    { value: "mambila", label: "Mambila" },
    { value: "mandara", label: "Mandara" },
    { value: "makaa", label: "Makaa" }
  ];

  const handleDownloadCache = async () => {
    if (!offlineMode) {
      toast({
        title: t('settings.offlineMode'),
        description: t('toast.offlineDesc'),
      });
      return;
    }

    setIsDownloadingCache(true);
    
    try {
      await downloadCache();
      toast({
        title: t('toast.cacheDownloaded'),
        description: t('toast.cacheDesc'),
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download offline cache. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloadingCache(false);
    }
  };

  const handleAssignAdminRole = async () => {
    if (!adminEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    setAssigningRole(true);
    try {
      const { data, error } = await supabase.functions.invoke('assign-role', {
        body: { userEmail: adminEmail.trim(), role: 'admin' }
      });

      if (error) throw error;

      toast({
        title: "Admin Role Assigned",
        description: `Successfully assigned admin role to ${adminEmail}`,
      });
      setAdminEmail('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign admin role",
        variant: "destructive"
      });
    } finally {
      setAssigningRole(false);
    }
  };

  const settingsGroups = [
    {
      title: t('settings.profile'),
      items: [
        {
          icon: User,
          label: t('settings.editProfile'),
          description: profile ? `${profile.full_name || t('settings.completeProfile')} • ${profile.region || t('settings.addLocation')}` : t('settings.setupProfile'),
          action: () => {
            setShowProfileEditor(true);
          },
          showArrow: true
        }
      ]
    },
    {
      title: t('settings.appSettings'),
      items: [
        {
          icon: Languages,
          label: t('settings.language'),
          description: displayLanguages.find(lang => lang.value === language)?.label || "English",
          control: (
            <Select value={language} onValueChange={handleDisplayLanguageChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-lg z-50">
                {displayLanguages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        },
        {
          icon: Volume2,
          label: t('settings.audioLanguage'),
          description: audioLanguages.find(lang => lang.value === audioLanguage)?.label || "English",
          control: (
            <Select value={audioLanguage} onValueChange={handleAudioLanguageChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-lg z-50">
                {audioLanguages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        },
        {
          icon: Moon,
          label: t('settings.darkMode'),
          description: t('settings.darkModeDesc'),
          control: (
            <Switch 
              checked={darkMode} 
              onCheckedChange={handleDarkModeChange}
            />
          )
        },
        {
          icon: Wifi,
          label: t('settings.offlineMode'),
          description: t('settings.offlineModeDesc'),
          control: (
            <Switch 
              checked={offlineMode} 
              onCheckedChange={handleOfflineModeChange}
            />
          )
        }
      ]
    },
    {
      title: t('settings.offlineFeatures'),
      items: [
        {
          icon: Download,
          label: t('settings.downloadCache'),
          description: `${t('settings.downloadCacheDesc')} (${cacheSize})`,
          action: handleDownloadCache,
          showArrow: false,
          control: isDownloadingCache ? (
            <div className="text-sm text-muted-foreground">{t('settings.downloading')}</div>
          ) : (
            <Button variant="outline" size="sm" onClick={handleDownloadCache} disabled={!offlineMode}>
              {t('settings.download')}
            </Button>
          )
        }
      ]
    },
    {
      title: t('settings.subscription'),
      items: [
        {
          icon: CreditCard,
          label: "Upgrade Plan",
          description: t('settings.premiumDesc'),
          action: () => {
            setShowSubscriptionPlans(true);
          },
          showArrow: true,
          highlight: true
        }
      ]
    },
    // Admin section - only show for admin users
    ...(isAdmin ? [{
      title: "Admin Controls",
      items: [
        {
          icon: Shield,
          label: "Assign Admin Role",
          description: "Grant admin access to users",
          control: (
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter email address"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-48"
              />
              <Button 
                onClick={handleAssignAdminRole}
                disabled={assigningRole || !adminEmail.trim()}
                size="sm"
              >
                {assigningRole ? "Assigning..." : "Assign"}
              </Button>
            </div>
          )
        }
      ]
    }] : []),
    {
      title: t('settings.support'),
      items: [
        {
          icon: HelpCircle,
          label: t('settings.helpSupport'),
          description: t('settings.helpSupportDesc'),
          action: () => {
            toast({
              title: t('toast.helpSupport'),
              description: t('toast.contactUs'),
            });
          },
          showArrow: true
        },
        {
          icon: Shield,
          label: t('settings.privacyPolicy'),
          description: t('settings.privacyPolicyDesc'),
          action: () => {
            toast({
              title: t('toast.privacyTitle'),
              description: t('toast.privacyDesc'),
            });
          },
          showArrow: true
        }
      ]
    }
  ];

  
  // Apply dark mode on component mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  if (showProfileEditor) {
    return (
      <PageLayout title={t('settings.title')} showNavigation={true}>
        <div className="p-4">
          <ProfileEditor onClose={() => setShowProfileEditor(false)} />
        </div>
      </PageLayout>
    );
  }

  if (showSubscriptionPlans) {
    return (
      <PageLayout title={t('Subscription Plans')} showNavigation={false}>
        <div className="p-4">
          <Button 
            variant="outline" 
            onClick={() => setShowSubscriptionPlans(false)}
            className="mb-4"
          >
            ← {t('Back to Settings')}
          </Button>
          <SubscriptionPlans />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={t('settings.title')} showNavigation={true}>
      <div className="p-4 space-y-6">
        {/* User Info Header */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">
                {profile?.full_name || user?.email?.split('@')[0] || t('settings.farmer')}
              </h3>
              <p className="text-muted-foreground">
                {profile?.phone_number || user?.email || 'farmer@example.com'}
              </p>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{profile?.region || t('settings.addLocation')}</span>
                </div>
                {profile?.farming_experience && (
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Sprout className="h-3 w-3" />
                    <span className="capitalize">{profile.farming_experience} {t('settings.farmer')}</span>
                  </div>
                )}
              </div>
              {profile?.primary_crops && profile.primary_crops.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {profile.primary_crops.slice(0, 3).map((crop) => (
                    <Badge key={crop} variant="secondary" className="text-xs">
                      {crop}
                    </Badge>
                  ))}
                  {profile.primary_crops.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{profile.primary_crops.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              {group.title}
            </h3>
            
            <Card className="divide-y divide-border">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <div
                    key={itemIndex}
                    className={`p-4 flex items-center justify-between ${
                      item.action ? 'cursor-pointer hover:bg-muted/50' : ''
                    } ${item.highlight ? 'bg-gradient-to-r from-primary/5 to-accent/5' : ''}`}
                    onClick={item.action}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${
                        item.highlight ? 'bg-primary/20' : 'bg-muted/50'
                      }`}>
                        <Icon className={`h-4 w-4 ${
                          item.highlight ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <p className={`font-medium ${
                          item.highlight ? 'text-primary' : ''
                        }`}>
                          {item.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {item.control}
                      {item.showArrow && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />
                      )}
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
        ))}


        {/* App Info */}
        <Card className="p-4 text-center bg-muted/30">
          <div className="space-y-2">
            <h4 className="font-semibold">AgroEng AI</h4>
            <p className="text-sm text-muted-foreground">{t('settings.version')}</p>
            <p className="text-xs text-muted-foreground">
              {t('settings.madeWith')}
            </p>
            {profile?.region && (
              <p className="text-xs text-muted-foreground">
                {t('settings.serving')} {profile.region}
              </p>
            )}
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}