import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../../contexts/SettingsContext';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'zh', name: '中文' },
];

const SettingsScreen = () => {
  const {
    language,
    audioLanguage,
    theme,
    isDarkMode,
    setLanguage,
    setAudioLanguage,
    setTheme,
    t,
  } = useSettings();

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    },
    header: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333' : '#e0e0e0',
      backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
    },
    section: {
      marginTop: 20,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: isDarkMode ? '#333' : '#e0e0e0',
    },
    sectionHeader: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333' : '#e0e0e0',
    },
    sectionHeaderText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#9e9e9e' : '#757575',
      textTransform: 'uppercase',
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333' : '#e0e0e0',
    },
    settingInfo: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#212121',
      marginBottom: 4,
    },
    settingSubtitle: {
      fontSize: 14,
      color: isDarkMode ? '#9e9e9e' : '#757575',
    },
    languageSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333' : '#e0e0e0',
    },
    languageSelectorText: {
      flex: 1,
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#212121',
    },
    languageSelectorValue: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    languageValue: {
      marginRight: 8,
      color: isDarkMode ? '#9e9e9e' : '#757575',
    },
    upgradeButton: {
      backgroundColor: '#22C55E',
      margin: 16,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    upgradeButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
    supportItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333' : '#e0e0e0',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    supportText: {
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#212121',
    },
    version: {
      textAlign: 'center',
      padding: 20,
      color: isDarkMode ? '#9e9e9e' : '#9e9e9e',
    },
  });

  const getLanguageName = (code: string) => {
    return LANGUAGES.find(lang => lang.code === code)?.name || code;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{t('settings')}</Text>
      </View>

      <ScrollView>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{t('appearance')}</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('dark_mode')}</Text>
              <Text style={styles.settingSubtitle}>
                {isDarkMode ? t('dark_mode_on') : t('dark_mode_off')}
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity 
            style={styles.languageSelector}
            onPress={() => {
              // Navigate to language selection
              // This would be a modal or separate screen in a real app
            }}
          >
            <Text style={styles.languageSelectorText}>{t('language')}</Text>
            <View style={styles.languageSelectorValue}>
              <Text style={styles.languageValue}>{getLanguageName(language)}</Text>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={isDarkMode ? '#9e9e9e' : '#757575'} 
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.languageSelector}
            onPress={() => {
              // Navigate to audio language selection
            }}
          >
            <Text style={styles.languageSelectorText}>{t('audio_language')}</Text>
            <View style={styles.languageSelectorValue}>
              <Text style={styles.languageValue}>{getLanguageName(audioLanguage)}</Text>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={isDarkMode ? '#9e9e9e' : '#757575'} 
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{t('account')}</Text>
          </View>
          
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>{t('upgrade_to_premium')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{t('support')}</Text>
          </View>
          
          <TouchableOpacity style={styles.supportItem}>
            <Text style={styles.supportText}>{t('help_center')}</Text>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={isDarkMode ? '#9e9e9e' : '#757575'} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.supportItem}>
            <Text style={styles.supportText}>{t('privacy_policy')}</Text>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={isDarkMode ? '#9e9e9e' : '#757575'} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.supportItem}>
            <Text style={styles.supportText}>{t('terms_of_service')}</Text>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={isDarkMode ? '#9e9e9e' : '#757575'} 
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>v1.0.0</Text>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
