import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'english' | 'french' | 'hausa' | 'yoruba' | 'igbo' | 'swahili' | 'wolof' | 'bambara' | 'fula' | 'twi';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation object
const translations: Record<Language, Record<string, string>> = {
  english: {
    // Navigation
    'nav.home': 'Home',
    'nav.camera': 'Camera',
    'nav.history': 'History',
    'nav.tips': 'Tips',
    'nav.settings': 'Settings',
    
    // Settings Page
    'settings.title': 'Settings',
    'settings.profile': 'Profile',
    'settings.editProfile': 'Edit Profile',
    'settings.completeProfile': 'Complete your profile',
    'settings.addLocation': 'Add location',
    'settings.setupProfile': 'Set up your farming profile',
    'settings.appSettings': 'App Settings',
    'settings.language': 'Language',
    'settings.audioLanguage': 'Audio Language',
    'settings.darkMode': 'Dark Mode',
    'settings.darkModeDesc': 'Switch to dark theme',
    'settings.offlineMode': 'Offline Mode',
    'settings.offlineModeDesc': 'Cache content for offline use',
    'settings.offlineFeatures': 'Offline Features',
    'settings.downloadCache': 'Download Offline Cache',
    'settings.downloadCacheDesc': 'Download common crops for your region',
    'settings.downloading': 'Downloading...',
    'settings.download': 'Download',
    'settings.subscription': 'Subscription',
    'settings.upgradeTopremium': 'Upgrade to Premium',
    'settings.premiumDesc': 'Unlimited scans, advanced features',
    'settings.support': 'Support',
    'settings.helpSupport': 'Help & Support',
    'settings.helpSupportDesc': 'FAQs, contact support',
    'settings.privacyPolicy': 'Privacy Policy',
    'settings.privacyPolicyDesc': 'How we protect your data',
    'settings.usage': 'This Month\'s Usage',
    'settings.scansUsed': 'Scans Used',
    'settings.freeRemaining': 'Free Remaining',
    'settings.upgradeUnlimited': 'Upgrade for Unlimited Scans',
    'settings.farmer': 'farmer',
    'settings.managing': 'Managing',
    'settings.hectares': 'hectares',
    'settings.version': 'Version 1.0.0',
    'settings.madeWith': 'Made with 💚 for farmers worldwide',
    'settings.serving': 'Serving farmers in',
    
    // Pricing
    'pricing.title': 'Choose Your Plan',
    'pricing.backToSettings': '← Back to Settings',
    'pricing.freePlan': '🆓 Free Plan',
    'pricing.premiumPlan': '💳 Premium Plan',
    'pricing.access': 'Access:',
    'pricing.benefits': 'Benefits:',
    'pricing.currentPlan': 'Current Plan',
    'pricing.upgradeNow': 'Upgrade Now',
    'pricing.paymentMethods': 'Payment Methods (Region-Friendly)',
    'pricing.airtime': 'Airtime Billing',
    'pricing.airtimeDesc': 'via Flutterwave/Maviance',
    'pricing.offlineCodes': 'Offline Codes',
    'pricing.offlineCodesDesc': 'NGO/Cooperative vouchers',
    
    // Free Plan Features
    'pricing.free.scans': '✅ 3 AI scans per day',
    'pricing.free.diagnosis': '✅ View diagnosis + solutions',
    'pricing.free.voice': '✅ Voice explanation (1 language)',
    'pricing.free.history': '✅ View last 5 scan history entries',
    'pricing.free.noOffline': '🚫 No offline queueing',
    'pricing.free.noGuides': '🚫 No access to advanced guides',
    'pricing.free.limitedCrops': '🚫 Limited crop support',
    
    // Premium Plan Features
    'pricing.premium.unlimited': '🔓 Unlimited scans',
    'pricing.premium.offline': '📶 Full offline diagnosis + history access',
    'pricing.premium.voice': '🗣 Voice/audio explanations in multiple local languages',
    'pricing.premium.crops': '🌾 Diagnosis + remedy guides for more crops',
    'pricing.premium.tips': '🧠 Daily expert tips based on region & season',
    'pricing.premium.support': '📤 Priority support or community access',
    
    // Toasts and Messages
    'toast.languageUpdated': 'Language Updated',
    'toast.themeUpdated': 'Theme Updated',
    'toast.switchedTo': 'Switched to',
    'toast.mode': 'mode',
    'toast.cacheDownloaded': 'Cache Downloaded!',
    'toast.cacheDesc': '10 most common crops for your region are now available offline.',
    'toast.offlineModeEnabled': 'Offline Mode Enabled',
    'toast.offlineModeDisabled': 'Offline Mode Disabled',
    'toast.offlineDesc': 'Content will be cached for offline use',
    'toast.onlineDesc': 'Content will not be cached offline',
    'toast.premiumUpgrade': 'Premium Upgrade',
    'toast.stripeIntegration': 'Stripe integration coming soon!',
    'toast.helpSupport': 'Help & Support',
    'toast.contactUs': 'Contact us at support@agroeng.ai or WhatsApp +1234567890',
    'toast.privacyTitle': 'Privacy Policy',
    'toast.privacyDesc': 'Your data is secure and never shared with third parties.',
    'toast.premiumFeatures': 'Get unlimited scans and advanced features!',
  },
  
  french: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.camera': 'Caméra',
    'nav.history': 'Historique',
    'nav.tips': 'Conseils',
    'nav.settings': 'Paramètres',
    
    // Settings Page
    'settings.title': 'Paramètres',
    'settings.profile': 'Profil',
    'settings.editProfile': 'Modifier le profil',
    'settings.completeProfile': 'Complétez votre profil',
    'settings.addLocation': 'Ajouter un lieu',
    'settings.setupProfile': 'Configurez votre profil d\'agriculteur',
    'settings.appSettings': 'Paramètres de l\'application',
    'settings.language': 'Langue',
    'settings.audioLanguage': 'Langue audio',
    'settings.darkMode': 'Mode sombre',
    'settings.darkModeDesc': 'Basculer vers le thème sombre',
    'settings.offlineMode': 'Mode hors ligne',
    'settings.offlineModeDesc': 'Mettre en cache le contenu pour une utilisation hors ligne',
    'settings.offlineFeatures': 'Fonctionnalités hors ligne',
    'settings.downloadCache': 'Télécharger le cache hors ligne',
    'settings.downloadCacheDesc': 'Télécharger les cultures communes de votre région',
    'settings.downloading': 'Téléchargement...',
    'settings.download': 'Télécharger',
    'settings.subscription': 'Abonnement',
    'settings.upgradeToProfile': 'Passer à Premium',
    'settings.premiumDesc': 'Scans illimités, fonctionnalités avancées',
    'settings.support': 'Support',
    'settings.helpSupport': 'Aide et support',
    'settings.helpSupportDesc': 'FAQ, contacter le support',
    'settings.privacyPolicy': 'Politique de confidentialité',
    'settings.privacyPolicyDesc': 'Comment nous protégeons vos données',
    'settings.usage': 'Utilisation ce mois-ci',
    'settings.scansUsed': 'Scans utilisés',
    'settings.freeRemaining': 'Gratuits restants',
    'settings.upgradeUnlimited': 'Passer à Premium pour des scans illimités',
    'settings.farmer': 'agriculteur',
    'settings.managing': 'Gérant',
    'settings.hectares': 'hectares',
    'settings.version': 'Version 1.0.0',
    'settings.madeWith': 'Fait avec 💚 pour les agriculteurs du monde entier',
    'settings.serving': 'Au service des agriculteurs de',
    
    // Add other French translations...
    'pricing.title': 'Choisissez votre plan',
    'pricing.backToSettings': '← Retour aux paramètres',
    'pricing.freePlan': '🆓 Plan gratuit',
    'pricing.premiumPlan': '💳 Plan Premium',
    'pricing.access': 'Accès:',
    'pricing.benefits': 'Avantages:',
    'pricing.currentPlan': 'Plan actuel',
    'pricing.upgradeNow': 'Mettre à niveau maintenant',
    'pricing.paymentMethods': 'Méthodes de paiement (adaptées à la région)',
    
    // Toasts
    'toast.languageUpdated': 'Langue mise à jour',
    'toast.themeUpdated': 'Thème mis à jour',
    'toast.switchedTo': 'Basculé vers',
    'toast.mode': 'mode',
    'toast.cacheDownloaded': 'Cache téléchargé!',
    'toast.cacheDesc': '10 cultures les plus communes de votre région sont maintenant disponibles hors ligne.',
    'toast.offlineModeEnabled': 'Mode hors ligne activé',
    'toast.offlineModeDisabled': 'Mode hors ligne désactivé',
    'toast.offlineDesc': 'Le contenu sera mis en cache pour une utilisation hors ligne',
    'toast.onlineDesc': 'Le contenu ne sera pas mis en cache hors ligne',
  },
  
  hausa: {
    // Navigation
    'nav.home': 'Gida',
    'nav.camera': 'Kamara',
    'nav.history': 'Tarihi',
    'nav.tips': 'Shawarwari',
    'nav.settings': 'Saiti',
    
    // Settings Page
    'settings.title': 'Saiti',
    'settings.profile': 'Bayani',
    'settings.editProfile': 'Gyara bayani',
    'settings.completeProfile': 'Kammala bayanin ku',
    'settings.addLocation': 'Ƙara wuri',
    'settings.setupProfile': 'Saita bayanin manomi',
    'settings.appSettings': 'Saitunan app',
    'settings.language': 'Harshe',
    'settings.audioLanguage': 'Harshen sauti',
    'settings.darkMode': 'Yanayin duhu',
    'settings.darkModeDesc': 'Koma zuwa jarin duhu',
    'settings.offlineMode': 'Yanayin kashe intanet',
    'settings.offlineModeDesc': 'Adana abun ciki don amfani ba tare da intanet ba',
    'settings.offlineFeatures': 'Abubuwan aikin ba tare da intanet ba',
    'settings.downloadCache': 'Zazzage cache na ba tare da intanet ba',
    'settings.downloadCacheDesc': 'Zazzage amfanin gona na yankin ku',
    'settings.downloading': 'Ana zazzagewa...',
    'settings.download': 'Zazzage',
    'settings.subscription': 'Biyan kuɗi',
    'settings.upgradeToProfile': 'Haɓaka zuwa Premium',
    'settings.premiumDesc': 'Scan marar iyaka, fasali na ci gaba',
    'settings.support': 'Tallafi',
    'settings.helpSupport': 'Taimako da tallafi',
    'settings.helpSupportDesc': 'FAQ, tuntuɓi tallafi',
    'settings.privacyPolicy': 'Manufar sirri',
    'settings.privacyPolicyDesc': 'Yadda muke kare bayananku',
    'settings.usage': 'Amfani na wannan wata',
    'settings.scansUsed': 'Scan da aka yi amfani',
    'settings.freeRemaining': 'Kyauta da suka rage',
    'settings.upgradeUnlimited': 'Haɓaka don Scan marar iyaka',
    'settings.farmer': 'manomi',
    'settings.managing': 'Sarrafa',
    'settings.hectares': 'hektoci',
    'settings.version': 'Sigar 1.0.0',
    'settings.madeWith': 'An yi shi da 💚 don manoma a duniya',
    'settings.serving': 'Hidimar manoma a',
    
    // Add other Hausa translations...
    'toast.languageUpdated': 'An sabunta harshe',
    'toast.themeUpdated': 'An sabunta jari',
    'toast.switchedTo': 'An komawa zuwa',
    'toast.mode': 'yanayi',
    'toast.cacheDownloaded': 'An zazzage cache!',
    'toast.offlineModeEnabled': 'An kunna yanayin kashe intanet',
    'toast.offlineModeDisabled': 'An kashe yanayin kashe intanet',
  },
  
  // Add basic translations for other languages
  yoruba: {
    'nav.home': 'Ile',
    'nav.camera': 'Kamẹra',
    'nav.history': 'Itan',
    'nav.tips': 'Awọn imọran',
    'nav.settings': 'Eto',
    'settings.title': 'Eto',
    'settings.language': 'Ede',
    'settings.audioLanguage': 'Ede ohun',
    'toast.languageUpdated': 'Ede ti yipada',
    'toast.themeUpdated': 'Akopọ ti yipada',
  },
  
  igbo: {
    'nav.home': 'Ụlọ',
    'nav.camera': 'Igwefoto',
    'nav.history': 'Akụkọ ihe mere eme',
    'nav.tips': 'Ndụmọdụ',
    'nav.settings': 'Ntọala',
    'settings.title': 'Ntọala',
    'settings.language': 'Asụsụ',
    'settings.audioLanguage': 'Asụsụ olu',
    'toast.languageUpdated': 'Emelitela asụsụ',
    'toast.themeUpdated': 'Emelitela isiokwu',
  },
  
  swahili: {
    'nav.home': 'Nyumbani',
    'nav.camera': 'Kamera',
    'nav.history': 'Historia',
    'nav.tips': 'Vidokezo',
    'nav.settings': 'Mipangilio',
    'settings.title': 'Mipangilio',
    'settings.language': 'Lugha',
    'settings.audioLanguage': 'Lugha ya sauti',
    'toast.languageUpdated': 'Lugha imesasishwa',
    'toast.themeUpdated': 'Mandhari imesasishwa',
  },
  
  wolof: {
    'nav.home': 'Kër',
    'nav.camera': 'Kameeray',
    'nav.history': 'Jaar',
    'nav.tips': 'Jaar-jaar',
    'nav.settings': 'Doxalin',
    'settings.title': 'Doxalin',
    'settings.language': 'Làkk',
    'settings.audioLanguage': 'Làkk bu baat',
    'toast.languageUpdated': 'Làkk bi soppi na',
  },
  
  bambara: {
    'nav.home': 'So',
    'nav.camera': 'Kamera',
    'nav.history': 'Tariku',
    'nav.tips': 'Ladilikanw',
    'nav.settings': 'Labencogo',
    'settings.title': 'Labencogo',
    'settings.language': 'Kan',
    'settings.audioLanguage': 'Kan kumakan',
    'toast.languageUpdated': 'Kan ye caman',
  },
  
  fula: {
    'nav.home': 'Suudu',
    'nav.camera': 'Kamera',
    'nav.history': 'Taariikh',
    'nav.tips': 'Faamde',
    'nav.settings': 'Teelte',
    'settings.title': 'Teelte',
    'settings.language': 'Ɗemngal',
    'settings.audioLanguage': 'Ɗemngal daande',
    'toast.languageUpdated': 'Ɗemngal waylu',
  },
  
  twi: {
    'nav.home': 'Fie',
    'nav.camera': 'Mfoni',
    'nav.history': 'Abakɔsɛm',
    'nav.tips': 'Afotuo',
    'nav.settings': 'Nhyehyɛe',
    'settings.title': 'Nhyehyɛe',
    'settings.language': 'Kasa',
    'settings.audioLanguage': 'Kasa a wɔde ka',
    'toast.languageUpdated': 'Wɔasesa kasa no',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'english';
  });

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('app-language', newLanguage);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.english[key] || key;
  };

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};