import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

type Language = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'zh';
type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsContextType {
  language: Language;
  audioLanguage: Language;
  theme: ThemeMode;
  isDarkMode: boolean;
  setLanguage: (lang: Language) => Promise<void>;
  setAudioLanguage: (lang: Language) => Promise<void>;
  setTheme: (mode: ThemeMode) => Promise<void>;
  t: (key: string) => string;
}

const STORAGE_KEYS = {
  LANGUAGE: '@agroeng_language',
  AUDIO_LANGUAGE: '@agroeng_audio_language',
  THEME: '@agroeng_theme',
};

// Default translations (you can move this to separate files)
const translations: Record<Language, Record<string, string>> = {
  en: {
    settings: 'Settings',
    dark_mode: 'Dark Mode',
    language: 'Language',
    audio_language: 'Audio Language',
    // Add more translations as needed
  },
  es: {
    settings: 'Configuración',
    dark_mode: 'Modo Oscuro',
    language: 'Idioma',
    audio_language: 'Idioma de Audio',
  },
  fr: {
    settings: 'Paramètres',
    dark_mode: 'Mode Sombre',
    language: 'Langue',
    audio_language: 'Langue Audio',
  },
  de: {
    settings: 'Einstellungen',
    dark_mode: 'Dunkelmodus',
    language: 'Sprache',
    audio_language: 'Audiosprache',
  },
  hi: {
    settings: 'सेटिंग्स',
    dark_mode: 'डार्क मोड',
    language: 'भाषा',
    audio_language: 'ऑडियो भाषा',
  },
  zh: {
    settings: '设置',
    dark_mode: '深色模式',
    language: '语言',
    audio_language: '音频语言',
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [language, setLanguageState] = useState<Language>('en');
  const [audioLanguage, setAudioLanguageState] = useState<Language>('en');
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load settings from storage on initial render
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [savedLang, savedAudioLang, savedTheme] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
          AsyncStorage.getItem(STORAGE_KEYS.AUDIO_LANGUAGE),
          AsyncStorage.getItem(STORAGE_KEYS.THEME),
        ]);

        if (savedLang) setLanguageState(savedLang as Language);
        if (savedAudioLang) setAudioLanguageState(savedAudioLang as Language);
        if (savedTheme) setThemeState(savedTheme as ThemeMode);

        // If no language is set, try to use device language
        if (!savedLang) {
          const deviceLanguage = Localization.locale.split('-')[0] as Language;
          if (translations[deviceLanguage]) {
            setLanguageState(deviceLanguage);
          }
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadSettings();
  }, []);

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
      setLanguageState(lang);
      // Update audio language to match if it was the same as the previous language
      if (audioLanguage === language) {
        await setAudioLanguage(lang);
      }
    } catch (error) {
      console.error('Failed to save language', error);
    }
  };

  const setAudioLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUDIO_LANGUAGE, lang);
      setAudioLanguageState(lang);
    } catch (error) {
      console.error('Failed to save audio language', error);
    }
  };

  const setTheme = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, mode);
      setThemeState(mode);
    } catch (error) {
      console.error('Failed to save theme', error);
    }
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  // Determine if dark mode is active
  const isDarkMode = theme === 'system' 
    ? systemColorScheme === 'dark' 
    : theme === 'dark';

  if (!isInitialized) {
    return null; // Or a loading indicator
  }

  return (
    <SettingsContext.Provider
      value={{
        language,
        audioLanguage,
        theme,
        isDarkMode,
        setLanguage,
        setAudioLanguage,
        setTheme,
        t,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Helper hook for text-to-speech with language support
export const useTextToSpeech = () => {
  const { audioLanguage } = useSettings();
  
  const speak = async (text: string) => {
    if (!text) return;
    
    try {
      if (Platform.OS === 'web') {
        // Web implementation
        if ('speechSynthesis' in window) {
          const speech = new SpeechSynthesisUtterance(text);
          speech.lang = audioLanguage;
          
          const voices = window.speechSynthesis.getVoices();
          const voice = voices.find(v => v.lang.startsWith(audioLanguage)) || voices[0];
          
          if (voice) {
            speech.voice = voice;
          }
          
          window.speechSynthesis.speak(speech);
        }
      } else {
        // Native implementation (you can integrate expo-speech here if needed)
        console.log('Text to speech not implemented for native yet');
      }
    } catch (error) {
      console.error('Error with speech synthesis:', error);
    }
  };
  
  return { speak };
};
