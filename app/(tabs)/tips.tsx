import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const dailyTips = [
  {
    id: 1,
    title: "Morning Watering Best Practices",
    category: "watering",
    content: "Water your plants early in the morning (6-8 AM) to reduce evaporation and prevent fungal diseases. This gives plants time to absorb water before the heat of the day.",
    difficulty: "Beginner"
  },
  {
    id: 2,
    title: "Identifying Early Pest Signs",
    category: "pests",
    content: "Check the underside of leaves weekly for small holes, discoloration, or tiny insects. Early detection allows for easier, more organic treatment options.",
    difficulty: "Intermediate"
  },
  {
    id: 3,
    title: "Crop Rotation Benefits",
    category: "soil",
    content: "Rotate plant families each season to prevent soil depletion and disease buildup. Follow heavy feeders with light feeders or nitrogen-fixing plants.",
    difficulty: "Advanced"
  }
];

const cropGuides = [
  {
    name: "Tomato",
    icon: "🍅",
    commonIssues: ["Blight", "Aphids", "Fruit Rot"],
    tips: "Stake tall varieties, prune suckers, watch for early blight symptoms"
  },
  {
    name: "Maize",
    icon: "🌽",
    commonIssues: ["Armyworm", "Rust", "Poor Pollination"],
    tips: "Plant in blocks for better pollination, monitor for armyworm damage"
  },
  {
    name: "Cassava",
    icon: "🥕",
    commonIssues: ["Mosaic Virus", "Mealybugs", "Root Rot"],
    tips: "Use disease-free cuttings, avoid waterlogged soils"
  }
];

const howToGuides = [
  {
    title: "How to Test Soil pH",
    steps: ["Collect soil samples", "Mix with distilled water", "Use pH strips", "Record readings"],
    difficulty: "Beginner",
    estimatedTime: "30 minutes",
    tools: ["pH test kit", "Clean containers", "Distilled water"]
  },
  {
    title: "Companion Planting Setup",
    steps: ["Research compatible plants", "Plan garden layout", "Plant combinations", "Monitor interactions"],
    difficulty: "Intermediate",
    estimatedTime: "2-3 hours",
    tools: ["Garden planner", "Seeds", "Measuring tape"]
  }
];

export default function TipsScreen() {
  const [selectedTab, setSelectedTab] = useState('daily');
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const getIconForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'watering': return 'water-outline';
      case 'pests': return 'bug-outline';
      case 'soil': return 'sunny-outline';
      default: return 'bulb-outline';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return '#22c55e';
      case "Intermediate": return '#f59e0b';
      case "Advanced": return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleVoiceAssistant = () => {
    setIsRecording(!isRecording);
    // Simulate voice recording
    setTimeout(() => {
      setIsRecording(false);
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tips & Education</Text>
        </View>

        {/* Voice Assistant */}
        <View style={styles.voiceCard}>
          <View style={styles.voiceContent}>
            <View style={styles.voiceInfo}>
              <Ionicons name="mic" size={20} color="#22c55e" />
              <View style={styles.voiceText}>
                <Text style={styles.voiceTitle}>Voice Assistant</Text>
                <Text style={styles.voiceDescription}>
                  Ask about your crops or describe what you see
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.voiceButton, { backgroundColor: isRecording ? '#ef4444' : '#22c55e' }]}
              onPress={handleVoiceAssistant}
            >
              <Ionicons 
                name={isRecording ? "mic-off" : "mic"} 
                size={20} 
                color="#ffffff" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'daily' && styles.activeTab]}
            onPress={() => setSelectedTab('daily')}
          >
            <Text style={[styles.tabText, selectedTab === 'daily' && styles.activeTabText]}>
              Daily Tips
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'crops' && styles.activeTab]}
            onPress={() => setSelectedTab('crops')}
          >
            <Text style={[styles.tabText, selectedTab === 'crops' && styles.activeTabText]}>
              Crop Guides
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'guides' && styles.activeTab]}
            onPress={() => setSelectedTab('guides')}
          >
            <Text style={[styles.tabText, selectedTab === 'guides' && styles.activeTabText]}>
              How-To
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content based on selected tab */}
        {selectedTab === 'daily' && (
          <View style={styles.contentSection}>
            {dailyTips.map((tip) => (
              <View key={tip.id} style={styles.tipCard}>
                <View style={styles.tipHeader}>
                  <View style={styles.tipIconContainer}>
                    <Ionicons 
                      name={getIconForCategory(tip.category) as any} 
                      size={20} 
                      color="#22c55e" 
                    />
                  </View>
                  <View style={styles.tipTitleContainer}>
                    <Text style={styles.tipTitle}>{tip.title}</Text>
                    <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(tip.difficulty) + '20' }]}>
                      <Text style={[styles.difficultyText, { color: getDifficultyColor(tip.difficulty) }]}>
                        {tip.difficulty}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.audioButton}>
                    <Ionicons name="volume-medium" size={16} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.tipContent}>{tip.content}</Text>
                
                <TouchableOpacity
                  style={styles.learnMoreButton}
                  onPress={() => setSelectedTip(selectedTip === tip.id ? null : tip.id)}
                >
                  <Ionicons name="book-outline" size={16} color="#22c55e" />
                  <Text style={styles.learnMoreText}>
                    {selectedTip === tip.id ? "Show Less" : "Learn More"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {selectedTab === 'crops' && (
          <View style={styles.contentSection}>
            {cropGuides.map((crop, index) => (
              <View key={index} style={styles.cropCard}>
                <View style={styles.cropHeader}>
                  <Text style={styles.cropIcon}>{crop.icon}</Text>
                  <Text style={styles.cropName}>{crop.name}</Text>
                  <TouchableOpacity style={styles.audioButton}>
                    <Ionicons name="volume-medium" size={16} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.cropIssues}>
                  <Text style={styles.cropIssuesTitle}>Common Issues:</Text>
                  <View style={styles.issuesList}>
                    {crop.commonIssues.map((issue, i) => (
                      <View key={i} style={styles.issueBadge}>
                        <Text style={styles.issueText}>{issue}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                
                <View style={styles.cropTips}>
                  <Text style={styles.cropTipsTitle}>Key Tips:</Text>
                  <Text style={styles.cropTipsText}>{crop.tips}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {selectedTab === 'guides' && (
          <View style={styles.contentSection}>
            {howToGuides.map((guide, index) => (
              <View key={index} style={styles.guideCard}>
                <View style={styles.guideHeader}>
                  <Ionicons name="book-outline" size={20} color="#22c55e" />
                  <Text style={styles.guideTitle}>{guide.title}</Text>
                  <TouchableOpacity style={styles.audioButton}>
                    <Ionicons name="volume-medium" size={16} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.guideMeta}>
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(guide.difficulty) + '20' }]}>
                    <Text style={[styles.difficultyText, { color: getDifficultyColor(guide.difficulty) }]}>
                      {guide.difficulty}
                    </Text>
                  </View>
                  <View style={styles.timeBadge}>
                    <Text style={styles.timeText}>{guide.estimatedTime}</Text>
                  </View>
                </View>

                <View style={styles.guideTools}>
                  <Text style={styles.guideToolsTitle}>Tools Required:</Text>
                  <View style={styles.toolsList}>
                    {guide.tools.map((tool, i) => (
                      <View key={i} style={styles.toolBadge}>
                        <Text style={styles.toolText}>{tool}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.guideSteps}>
                  <Text style={styles.guideStepsTitle}>Steps:</Text>
                  {guide.steps.map((step, i) => (
                    <Text key={i} style={styles.stepText}>
                      {i + 1}. {step}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  voiceCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#22c55e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  voiceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voiceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  voiceText: {
    marginLeft: 12,
    flex: 1,
  },
  voiceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  voiceDescription: {
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
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
    shadowOffset: { width: 0, height: 1 },
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
    fontWeight: '600',
  },
  contentSection: {
    paddingHorizontal: 16,
  },
  tipCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipTitleContainer: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  audioButton: {
    padding: 8,
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
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    color: '#22c55e',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 12,
  },
  cropCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cropHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cropIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  cropIssues: {
    marginBottom: 12,
  },
  cropIssuesTitle: {
    fontSize: 12,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  issueText: {
    fontSize: 10,
    color: '#374151',
  },
  cropTips: {
    marginTop: 8,
  },
  cropTipsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  cropTipsText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
  },
  guideCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    marginLeft: 12,
  },
  guideMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  timeBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
  },
  guideTools: {
    marginBottom: 12,
  },
  guideToolsTitle: {
    fontSize: 12,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  toolText: {
    fontSize: 10,
    color: '#374151',
  },
  guideSteps: {
    marginTop: 8,
  },
  guideStepsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
    marginBottom: 4,
  },
  bottomSpacing: {
    height: 20,
  },
});