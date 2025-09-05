import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AlertTriangle, CheckCircle, ArrowRight, BookOpen, Volume2, Users, ThumbsUp, ThumbsDown, Leaf, Brain } from "lucide-react-native";

export default function Diagnosis() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get data from navigation params
  const { image, plant = "Tomato", issue = "Leaf Blight (Fungal)", cause } = route.params || {};

  // Mock healthy plant image URL
  const healthyPlantImage = "https://images.unsplash.com/photo-1592479286881-62c8a1e07a4c?w=400&h=400&fit=crop";

  // Crowdsourcing state
  const [crowdsourceCrop, setCrowdsourceCrop] = useState("");
  const [crowdsourceProblem, setCrowdsourceProblem] = useState("");
  
  // Feedback state
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [feedbackPositive, setFeedbackPositive] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");

  // Audio explanation
  const [isPlaying, setIsPlaying] = useState(false);

  const crops = [
    "Cassava", "Yam", "Maize", "Tomato", "Okra", "Groundnut", 
    "Sweet Potato", "Plantain", "Rice", "Cowpea", "Pepper", "Onion"
  ];

  const commonProblems = [
    "Leaf spot", "Yellowing", "Wilting", "Root rot", "Pest damage", 
    "Nutrient deficiency", "Fungal infection", "Bacterial infection"
  ];

  const handleCrowdsourceSubmit = () => {
    if (!crowdsourceCrop) {
      Alert.alert("Please select a crop", "Help us improve by identifying the crop type.");
      return;
    }
    
    Alert.alert("Thanks for your help!", "Your feedback helps improve our AI accuracy.");
    
    // Reset form
    setCrowdsourceCrop("");
    setCrowdsourceProblem("");
  };

  const handleFeedback = (isPositive) => {
    setFeedbackPositive(isPositive);
    setFeedbackGiven(true);
    
    if (isPositive) {
      Alert.alert("Thank you!", "We're glad the diagnosis was helpful.");
    }
  };

  const submitFeedback = () => {
    Alert.alert("Feedback received!", "Thank you for helping us improve our service.");
    setFeedbackText("");
  };

  const playAudioExplanation = () => {
    setIsPlaying(true);
    
    // Simulate audio playback
    setTimeout(() => {
      setIsPlaying(false);
      Alert.alert("Audio explanation played", "In a real app, this would play TTS audio in your selected language.");
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Results Header */}
          <View style={styles.headerCard}>
            <Text style={styles.headerTitle}>Here's What We Found</Text>
            <Text style={styles.headerSubtitle}>
              Analysis complete - here are your results
            </Text>
          </View>

          {/* Side-by-side Image Comparison */}
          <View style={styles.comparisonCard}>
            <Text style={styles.comparisonTitle}>Visual Comparison</Text>
            <View style={styles.imageGrid}>
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: image || 'https://via.placeholder.com/200' }}
                  style={[styles.plantImage, styles.yourPlantImage]}
                />
                <Text style={styles.yourPlantLabel}>Your Plant</Text>
              </View>
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: healthyPlantImage }}
                  style={[styles.plantImage, styles.healthyPlantImage]}
                />
                <Text style={styles.healthyPlantLabel}>Healthy Reference</Text>
              </View>
            </View>
          </View>

          {/* Diagnosis Information */}
          <View style={styles.diagnosisCard}>
            <View style={styles.diagnosisItem}>
              <View style={styles.diagnosisIconContainer}>
                <Leaf size={20} color="#22c55e" />
              </View>
              <View style={styles.diagnosisText}>
                <Text style={styles.diagnosisLabel}>Plant Identified</Text>
                <Text style={styles.diagnosisValue}>{plant}</Text>
              </View>
            </View>

            <View style={styles.diagnosisItem}>
              <View style={[styles.diagnosisIconContainer, styles.warningIcon]}>
                <AlertTriangle size={16} color="#ef4444" />
              </View>
              <View style={styles.diagnosisText}>
                <Text style={styles.diagnosisLabel}>Issue Detected</Text>
                <Text style={[styles.diagnosisValue, styles.issueText]}>{issue}</Text>
              </View>
            </View>

            {cause && (
              <View style={styles.diagnosisItem}>
                <View style={[styles.diagnosisIconContainer, styles.causeIcon]}>
                  <Brain size={16} color="#f59e0b" />
                </View>
                <View style={styles.diagnosisText}>
                  <Text style={styles.diagnosisLabel}>Likely Cause</Text>
                  <Text style={styles.diagnosisValue}>{cause}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Severity Indicator */}
          <View style={styles.severityCard}>
            <View style={styles.severityContent}>
              <View style={styles.severityLeft}>
                <View style={styles.severityIconContainer}>
                  <AlertTriangle size={16} color="#f59e0b" />
                </View>
                <View>
                  <Text style={styles.severityTitle}>Moderate Severity</Text>
                  <Text style={styles.severitySubtitle}>Action needed within 1-2 days</Text>
                </View>
              </View>
              <View style={styles.severityRight}>
                <Text style={styles.severityScore}>7/10</Text>
                <Text style={styles.severityLabel}>Urgency</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Solutions', { 
                plant, issue, cause, image 
              })}
            >
              <ArrowRight size={24} color="#ffffff" />
              <Text style={styles.primaryButtonText}>View Treatment Solutions</Text>
            </TouchableOpacity>
            
            <View style={styles.secondaryButtons}>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('Camera')}
              >
                <Text style={styles.secondaryButtonText}>Scan Another Plant</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('Tips')}
              >
                <BookOpen size={16} color="#6b7280" />
                <Text style={styles.secondaryButtonText}>Learn More</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Audio Explanation */}
          <View style={styles.audioCard}>
            <View style={styles.audioContent}>
              <View style={styles.audioLeft}>
                <View style={styles.audioIconContainer}>
                  <Volume2 size={16} color="#22c55e" />
                </View>
                <View>
                  <Text style={styles.audioTitle}>Audio Explanation</Text>
                  <Text style={styles.audioSubtitle}>
                    Listen to diagnosis in your language
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.audioButton}
                onPress={playAudioExplanation}
                disabled={isPlaying}
              >
                <Volume2 size={16} color="#22c55e" />
                <Text style={styles.audioButtonText}>
                  {isPlaying ? "Playing..." : "Listen"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Accuracy Note */}
          <View style={styles.accuracyCard}>
            <View style={styles.accuracyContent}>
              <CheckCircle size={20} color="#22c55e" />
              <View style={styles.accuracyText}>
                <Text style={styles.accuracyTitle}>AI Confidence: 94%</Text>
                <Text style={styles.accuracySubtitle}>
                  This diagnosis is based on visual analysis. For severe cases, consult a local agricultural expert.
                </Text>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  comparisonCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  imageGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  plantImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  yourPlantImage: {
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  healthyPlantImage: {
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  yourPlantLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ef4444',
    textAlign: 'center',
  },
  healthyPlantLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22c55e',
    textAlign: 'center',
  },
  diagnosisCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  diagnosisItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  diagnosisIconContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#dcfce7',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  warningIcon: {
    backgroundColor: '#fef2f2',
  },
  causeIcon: {
    backgroundColor: '#fef3c7',
  },
  diagnosisText: {
    flex: 1,
  },
  diagnosisLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  diagnosisValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  issueText: {
    color: '#ef4444',
  },
  severityCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  severityContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  severityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  severityIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#fbbf24',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  severityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f59e0b',
    marginBottom: 4,
  },
  severitySubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  severityRight: {
    alignItems: 'center',
  },
  severityScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  severityLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  actionButtons: {
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    marginHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginLeft: 4,
  },
  audioCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  audioContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  audioLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  audioIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#dcfce7',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  audioTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  audioSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  audioButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  audioButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22c55e',
    marginLeft: 4,
  },
  accuracyCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  accuracyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accuracyText: {
    marginLeft: 12,
    flex: 1,
  },
  accuracyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
    marginBottom: 4,
  },
  accuracySubtitle: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
});