import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
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
} from "lucide-react-native";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useOfflineStorage } from "@/hooks/useOfflineStorage";
import { supabase } from "@/integrations/supabase/client";

interface SettingsProps {
  navigation: any;
}

export default function Settings({ navigation }: SettingsProps) {
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
    Alert.alert(
      t('toast.languageUpdated'),
      `${t('settings.audioLanguage')}: ${audioLanguages.find(lang => lang.value === value)?.label}`
    );
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
    
    Alert.alert(
      t('toast.languageUpdated'),
      `${t('settings.language')}: ${displayLanguages.find(lang => lang.value === value)?.label}`
    );
  };

  // Handler for offline mode toggle
  const handleOfflineModeChange = (checked: boolean) => {
    setOfflineMode(checked);
    localStorage.setItem('offline-mode', checked.toString());
    
    if (checked) {
      // Enable offline mode
      Alert.alert(t('toast.offlineModeEnabled'), t('toast.offlineDesc'));
    } else {
      // Disable offline mode and clear cache
      clearOfflineData();
      Alert.alert(t('toast.offlineModeDisabled'), t('toast.onlineDesc'));
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
    
    Alert.alert(
      t('toast.themeUpdated'),
      `${t('toast.switchedTo')} ${checked ? 'dark' : 'light'} ${t('toast.mode')}`
    );
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
      Alert.alert(t('settings.offlineMode'), t('toast.offlineDesc'));
      return;
    }

    setIsDownloadingCache(true);
    
    try {
      await downloadCache();
      Alert.alert(t('toast.cacheDownloaded'), t('toast.cacheDesc'));
    } catch (error) {
      Alert.alert("Download Failed", "Failed to download offline cache. Please try again.");
    } finally {
      setIsDownloadingCache(false);
    }
  };

  const handleAssignAdminRole = async () => {
    if (!adminEmail.trim()) {
      Alert.alert("Error", "Please enter an email address");
      return;
    }

    setAssigningRole(true);
    try {
      const { data, error } = await supabase.functions.invoke('assign-role', {
        body: { userEmail: adminEmail.trim(), role: 'admin' }
      });

      if (error) throw error;

      Alert.alert("Admin Role Assigned", `Successfully assigned admin role to ${adminEmail}`);
      setAdminEmail('');
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to assign admin role");
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
          action: () => {
            Alert.alert(
              "Select Language",
              "Choose your preferred language",
              displayLanguages.map(lang => ({
                text: lang.label,
                onPress: () => handleDisplayLanguageChange(lang.value)
              }))
            );
          }
        },
        {
          icon: Volume2,
          label: t('settings.audioLanguage'),
          description: audioLanguages.find(lang => lang.value === audioLanguage)?.label || "English",
          action: () => {
            Alert.alert(
              "Select Audio Language",
              "Choose your preferred audio language",
              audioLanguages.map(lang => ({
                text: lang.label,
                onPress: () => handleAudioLanguageChange(lang.value)
              }))
            );
          }
        },
        {
          icon: Moon,
          label: t('settings.darkMode'),
          description: t('settings.darkModeDesc'),
          control: darkMode,
          onToggle: handleDarkModeChange
        },
        {
          icon: Wifi,
          label: t('settings.offlineMode'),
          description: t('settings.offlineModeDesc'),
          control: offlineMode,
          onToggle: handleOfflineModeChange
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
          showArrow: false
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
            Alert.alert("Subscription", "Premium features coming soon!");
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
          action: () => {
            Alert.prompt("Assign Admin Role", "Enter email address:", handleAssignAdminRole);
          }
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
            Alert.alert(t('toast.helpSupport'), t('toast.contactUs'));
          },
          showArrow: true
        },
        {
          icon: Shield,
          label: t('settings.privacyPolicy'),
          description: t('settings.privacyPolicyDesc'),
          action: () => {
            Alert.alert(t('toast.privacyTitle'), t('toast.privacyDesc'));
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
        {/* User Info Header */}
        <View style={styles.userCard}>
          <View style={styles.userContent}>
            <View style={styles.userAvatar}>
              <User size={32} color="#22c55e" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {profile?.full_name || user?.email?.split('@')[0] || t('settings.farmer')}
              </Text>
              <Text style={styles.userEmail}>
                {profile?.phone_number || user?.email || 'farmer@example.com'}
              </Text>
              <View style={styles.userMeta}>
                <View style={styles.userMetaItem}>
                  <MapPin size={12} color="#6b7280" />
                  <Text style={styles.userMetaText}>{profile?.region || t('settings.addLocation')}</Text>
                </View>
                {profile?.farming_experience && (
                  <View style={styles.userMetaItem}>
                    <Sprout size={12} color="#6b7280" />
                    <Text style={styles.userMetaText}>{profile.farming_experience} {t('settings.farmer')}</Text>
                  </View>
                )}
              </View>
              {profile?.primary_crops && profile.primary_crops.length > 0 && (
                <View style={styles.cropsList}>
                  {profile.primary_crops.slice(0, 3).map((crop) => (
                    <View key={crop} style={styles.cropBadge}>
                      <Text style={styles.cropBadgeText}>{crop}</Text>
                    </View>
                  ))}
                  {profile.primary_crops.length > 3 && (
                    <View style={styles.cropBadgeOutline}>
                      <Text style={styles.cropBadgeOutlineText}>+{profile.primary_crops.length - 3} more</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>
              {group.title}
            </Text>
            
            <View style={styles.settingsCard}>
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <TouchableOpacity
                    key={itemIndex}
                    style={[
                      styles.settingsItem,
                      item.highlight && styles.highlightItem,
                      itemIndex < group.items.length - 1 && styles.settingsItemBorder
                    ]}
                    onPress={item.action}
                    disabled={!item.action}
                  >
                    <View style={styles.settingsItemLeft}>
                      <View style={[styles.settingsIcon, item.highlight && styles.highlightIcon]}>
                        <Icon size={16} color={item.highlight ? "#22c55e" : "#6b7280"} />
                      </View>
                      <View style={styles.settingsText}>
                        <Text style={[styles.settingsLabel, item.highlight && styles.highlightLabel]}>
                          {item.label}
                        </Text>
                        <Text style={styles.settingsDescription}>
                          {item.description}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.settingsItemRight}>
                      {typeof item.control === 'boolean' && item.onToggle ? (
                        <Switch
                          value={item.control}
                          onValueChange={item.onToggle}
                          trackColor={{ false: '#e5e7eb', true: '#22c55e' }}
                          thumbColor={item.control ? '#ffffff' : '#f3f4f6'}
                        />
                      ) : null}
                      {item.showArrow && (
                        <ChevronRight size={16} color="#6b7280" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.appInfoCard}>
          <View style={styles.appInfoContent}>
            <Text style={styles.appInfoTitle}>AgroEng AI</Text>
            <Text style={styles.appInfoVersion}>{t('settings.version')}</Text>
            <Text style={styles.appInfoMade}>
              {t('settings.madeWith')}
            </Text>
            {profile?.region && (
              <Text style={styles.appInfoServing}>
                {t('settings.serving')} {profile.region}
              </Text>
            )}
          </View>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}