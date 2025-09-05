import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { BookOpen, Lightbulb, Bug, Droplets, Sun, Volume2, Mic, MicOff, RefreshCw, Cherry, Wheat, Carrot, Leaf } from "lucide-react-native";
import { useAITips } from "@/hooks/useAITips";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useSpeechToText } from "@/hooks/useSpeechToText";

interface TipsProps {
  navigation: any;
}

const getIconForCategory = (category: string) => {
  switch (category.toLowerCase()) {
    case 'watering': return Droplets;
    case 'pests': return Bug;
    case 'soil': return Sun;
    case 'planting': return BookOpen;
    default: return Lightbulb;
  }
};

export default function Tips({ navigation }: TipsProps) {
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('daily');
  
  const { dailyTips, cropGuides, seasonalAlerts, howToGuides, loading: aiLoading, regenerateContent } = useAITips();
  const { speak, loading: ttsLoading, isPlaying } = useTextToSpeech();
  const { isRecording, loading: sttLoading, startRecording, stopRecording } = useSpeechToText();

  const handleAudioPlay = (text: string, id: string) => {
    speak(text, id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "#22c55e";
      case "Intermediate": return "#f59e0b";
      case "Advanced": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getDifficultyBgColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "#f0fdf4";
      case "Intermediate": return "#fffbeb";
      case "Advanced": return "#fef2f2";
      default: return "#f3f4f6";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tips & Education</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Voice Assistant */}
          <View style={styles.voiceCard}>
            <View style={styles.voiceContent}>
              <View style={styles.voiceLeft}>
                <View style={styles.voiceIcon}>
                  <Mic size={20} color="#22c55e" />
                </View>
                <View>
                  <Text style={styles.voiceTitle}>Voice Assistant</Text>
                  <Text style={styles.voiceSubtitle}>
                    Ask about your crops or describe what you see
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={isRecording ? stopRecording : startRecording}
                disabled={sttLoading}
                style={[styles.voiceButton, isRecording ? styles.recordingButton : styles.idleButton]}
              >
                {sttLoading ? (
                  <Text style={styles.voiceButtonText}>...</Text>
                ) : isRecording ? (
                  <MicOff size={16} color="#ffffff" />
                ) : (
                  <Mic size={16} color="#ffffff" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Seasonal Alerts */}
          <View style={styles.alertsSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Lightbulb size={20} color="#f59e0b" />
                <Text style={styles.sectionTitle}>Seasonal Alerts</Text>
              </View>
              <TouchableOpacity
                onPress={() => regenerateContent('seasonal-alerts', 2)}
                disabled={aiLoading}
                style={styles.refreshButton}
              >
                <RefreshCw size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>
            {seasonalAlerts.map((alert, index) => (
              <View key={index} style={[
                styles.alertCard,
                alert.urgency === "high" ? styles.highUrgencyCard : styles.mediumUrgencyCard
              ]}>
                <View style={styles.alertContent}>
                  <View style={styles.alertText}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <Text style={styles.alertMessage}>{alert.message}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleAudioPlay(`${alert.title}. ${alert.message}`, `alert-${index}`)}
                    style={[styles.audioButton, isPlaying(`alert-${index}`) && styles.playingButton]}
                    disabled={ttsLoading}
                  >
                    <Volume2 size={16} color={isPlaying(`alert-${index}`) ? "#22c55e" : "#6b7280"} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <View style={styles.tabList}>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'daily' && styles.activeTab]}
                onPress={() => setActiveTab('daily')}
              >
                <Text style={[styles.tabText, activeTab === 'daily' && styles.activeTabText]}>
                  Daily Tips
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'crops' && styles.activeTab]}
                onPress={() => setActiveTab('crops')}
              >
                <Text style={[styles.tabText, activeTab === 'crops' && styles.activeTabText]}>
                  Crop Guides
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'guides' && styles.activeTab]}
                onPress={() => setActiveTab('guides')}
              >
                <Text style={[styles.tabText, activeTab === 'guides' && styles.activeTabText]}>
                  How-To
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tab Content */}
            {activeTab === 'daily' && (
              <View style={styles.tabContent}>
                <View style={styles.tabHeader}>
                  <Text style={styles.tabTitle}>AI-Generated Daily Tips</Text>
                  <TouchableOpacity
                    onPress={() => regenerateContent('daily-tips')}
                    disabled={aiLoading}
                    style={styles.refreshButton}
                  >
                    <RefreshCw size={16} color="#6b7280" />
                    <Text style={styles.refreshText}>New Tips</Text>
                  </TouchableOpacity>
                </View>
                
                {dailyTips.map((tip) => {
                  const Icon = getIconForCategory(tip.category);
                  const tipId = `tip-${tip.id}`;
                  return (
                    <View key={tip.id} style={styles.tipCard}>
                      <View style={styles.tipHeader}>
                        <View style={styles.tipLeft}>
                          <View style={styles.tipIconContainer}>
                            <Icon size={16} color="#22c55e" />
                          </View>
                          <View>
                            <Text style={styles.tipTitle}>{tip.title}</Text>
                            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyBgColor(tip.difficulty) }]}>
                              <Text style={[styles.difficultyText, { color: getDifficultyColor(tip.difficulty) }]}>
                                {tip.difficulty}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleAudioPlay(`${tip.title}. ${tip.content}`, tipId)}
                          style={[styles.audioButton, isPlaying(tipId) && styles.playingButton]}
                          disabled={ttsLoading}
                        >
                          <Volume2 size={16} color={isPlaying(tipId) ? "#22c55e" : "#6b7280"} />
                        </TouchableOpacity>
                      </View>
                      
                      <Text style={styles.tipContent}>
                        {tip.content}
                      </Text>
                      
                      <TouchableOpacity
                        style={styles.learnMoreButton}
                        onPress={() => setSelectedTip(selectedTip === tip.id ? null : tip.id)}
                      >
                        <BookOpen size={16} color="#22c55e" />
                        <Text style={styles.learnMoreText}>
                          {selectedTip === tip.id ? "Show Less" : "Learn More"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}

            {activeTab === 'crops' && (
              <View style={styles.tabContent}>
                <View style={styles.tabHeader}>
                  <Text style={styles.tabTitle}>AI-Generated Crop Guides</Text>
                  <TouchableOpacity
                    onPress={() => regenerateContent('crop-guides')}
                    disabled={aiLoading}
                    style={styles.refreshButton}
                  >
                    <RefreshCw size={16} color="#6b7280" />
                    <Text style={styles.refreshText}>New Guides</Text>
                  </TouchableOpacity>
                </View>
                
                {cropGuides.map((crop, index) => {
                  const guideId = `guide-${index}`;
                  return (
                    <View key={index} style={styles.cropCard}>
                      <View style={styles.cropHeader}>
                        <View style={styles.cropLeft}>
                          <View style={styles.cropIconContainer}>
                            {crop.icon === 'cherry' ? <Cherry size={24} color="#22c55e" /> :
                             crop.icon === 'wheat' ? <Wheat size={24} color="#22c55e" /> :
                             crop.icon === 'carrot' ? <Carrot size={24} color="#22c55e" /> :
                             <Leaf size={24} color="#22c55e" />}
                          </View>
                          <Text style={styles.cropName}>{crop.name}</Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleAudioPlay(`${crop.name} guide. Common issues: ${crop.commonIssues.join(', ')}. Tips: ${crop.tips}`, guideId)}
                          style={[styles.audioButton, isPlaying(guideId) && styles.playingButton]}
                          disabled={ttsLoading}
                        >
                          <Volume2 size={16} color={isPlaying(guideId) ? "#22c55e" : "#6b7280"} />
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.cropDetails}>
                        <View style={styles.cropSection}>
                          <Text style={styles.cropSectionTitle}>Common Issues:</Text>
                          <View style={styles.issuesList}>
                            {crop.commonIssues.map((issue, i) => (
                              <View key={i} style={styles.issueBadge}>
                                <Text style={styles.issueText}>{issue}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                        
                        <View style={styles.cropSection}>
                          <Text style={styles.cropSectionTitle}>Key Tips:</Text>
                          <Text style={styles.cropTips}>{crop.tips}</Text>
                        </View>

                        <TouchableOpacity
                          style={styles.learnMoreButton}
                          onPress={() => setSelectedGuide(selectedGuide === index ? null : index)}
                        >
                          <BookOpen size={16} color="#22c55e" />
                          <Text style={styles.learnMoreText}>
                            {selectedGuide === index ? "Show Less" : "Learn More"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {activeTab === 'guides' && (
              <View style={styles.tabContent}>
                <View style={styles.tabHeader}>
                  <Text style={styles.tabTitle}>AI-Generated How-To Guides</Text>
                  <TouchableOpacity
                    onPress={() => regenerateContent('how-to-guides', 4)}
                    disabled={aiLoading}
                    style={styles.refreshButton}
                  >
                    <RefreshCw size={16} color="#6b7280" />
                    <Text style={styles.refreshText}>New Guides</Text>
                  </TouchableOpacity>
                </View>
                
                {howToGuides.map((guide, index) => {
                  const howToId = `howto-${index}`;
                  const fullText = `${guide.title}. This ${guide.difficulty} level guide takes ${guide.estimatedTime}. Tools needed: ${guide.tools.join(', ')}. Steps: ${guide.steps.join('. ')}`;
                  
                  return (
                    <View key={index} style={styles.guideCard}>
                      <View style={styles.guideHeader}>
                        <View style={styles.guideLeft}>
                          <BookOpen size={20} color="#22c55e" />
                          <Text style={styles.guideTitle}>{guide.title}</Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleAudioPlay(fullText, howToId)}
                          style={[styles.audioButton, isPlaying(howToId) && styles.playingButton]}
                          disabled={ttsLoading}
                        >
                          <Volume2 size={16} color={isPlaying(howToId) ? "#22c55e" : "#6b7280"} />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.guideBadges}>
                        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyBgColor(guide.difficulty) }]}>
                          <Text style={[styles.difficultyText, { color: getDifficultyColor(guide.difficulty) }]}>
                            {guide.difficulty}
                          </Text>
                        </View>
                        <View style={styles.timeBadge}>
                          <Text style={styles.timeText}>{guide.estimatedTime}</Text>
                        </View>
                      </View>

                      <View style={styles.guideDetails}>
                        <View style={styles.guideSection}>
                          <Text style={styles.guideSectionTitle}>Tools Required:</Text>
                          <View style={styles.toolsList}>
                            {guide.tools.map((tool, i) => (
                              <View key={i} style={styles.toolBadge}>
                                <Text style={styles.toolText}>{tool}</Text>
                              </View>
                            ))}
                          </View>
                        </View>

                        <View style={styles.guideSection}>
                          <Text style={styles.guideSectionTitle}>Steps:</Text>
                          <View style={styles.stepsList}>
                            {guide.steps.map((step, i) => (
                              <View key={i} style={styles.stepItem}>
                                <Text style={styles.stepNumber}>{i + 1}.</Text>
                                <Text style={styles.stepText}>{step}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {/* Voice Features Info */}
          <View style={styles.featuresCard}>
            <View style={styles.featuresGrid}>
              <View style={styles.featureItem}>
                <Volume2 size={20} color="#06b6d4" />
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Voice Reading</Text>
                  <Text style={styles.featureDescription}>
                    Tap speaker icons to hear content
                  </Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <Mic size={20} color="#22c55e" />
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Voice Assistant</Text>
                  <Text style={styles.featureDescription}>
                    Ask questions or describe issues
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  voiceCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  voiceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voiceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  voiceIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#dcfce7',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  voiceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  voiceSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: '#ef4444',
  },
  idleButton: {
    backgroundColor: '#22c55e',
  },
  voiceButtonText: {
    color: '#ffffff',
    fontSize: 12,
  },
  alertsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  refreshText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  alertCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  highUrgencyCard: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  mediumUrgencyCard: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  alertContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  alertText: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  alertMessage: {
    fontSize: 14,
    color: '#6b7280',
  },
  audioButton: {
    padding: 8,
    borderRadius: 6,
  },
  playingButton: {
    backgroundColor: '#dcfce7',
  },
  tabContainer: {
    marginBottom: 24,
  },
  tabList: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#1f2937',
  },
  tabContent: {
    marginTop: 8,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tabTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  tipCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tipIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#dcfce7',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tipContent: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
    marginLeft: 8,
  },
  cropCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cropLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cropIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#dcfce7',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cropName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  cropDetails: {
    marginTop: 8,
  },
  cropSection: {
    marginBottom: 12,
  },
  cropSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  issuesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  issueBadge: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  issueText: {
    fontSize: 12,
    color: '#1f2937',
  },
  cropTips: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  guideCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  guideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  guideLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  guideBadges: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timeBadge: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginLeft: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#1f2937',
  },
  guideDetails: {
    marginTop: 8,
  },
  guideSection: {
    marginBottom: 12,
  },
  guideSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  toolsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toolBadge: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  toolText: {
    fontSize: 12,
    color: '#1f2937',
  },
  stepsList: {
    marginTop: 4,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
    marginRight: 8,
    minWidth: 20,
  },
  stepText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
    lineHeight: 20,
  },
  featuresCard: {
    backgroundColor: '#f0fdfa',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  featureText: {
    marginLeft: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
});