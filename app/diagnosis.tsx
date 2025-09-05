import React, { useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

export default function DiagnosisScreen() {
  const params = useLocalSearchParams();
  const { image, plant = "Tomato", issue = "Leaf Blight (Fungal)", cause = "Caused by overwatering and poor ventilation" } = params;

  // Mock healthy plant image URL
  const healthyPlantImage = "https://images.unsplash.com/photo-1592479286881-62c8a1e07a4c?w=400&h=400&fit=crop";

  // Crowdsourcing state
  const [crowdsourceCrop, setCrowdsourceCrop] = useState("");
  const [crowdsourceProblem, setCrowdsourceProblem] = useState("");
  
  // Feedback state
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [feedbackPositive, setFeedbackPositive] = useState<boolean | null>(null);

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
    setCrowdsourceCrop("");
    setCrowdsourceProblem("");
  };

  const handleFeedback = (isPositive: boolean) => {
    setFeedbackPositive(isPositive);
    setFeedbackGiven(true);
    
    if (isPositive) {
      Alert.alert("Thank you!", "We're glad the diagnosis was helpful.");
    }
  };

  const playAudioExplanation = () => {
    setIsPlaying(true);
    
    // Simulate audio playback
    setTimeout(() => {
      setIsPlaying(false);
      Alert.alert("Audio explanation played", "In a real app, this would play TTS audio in your selected language.");
    }, 3000);
  };

  const navigateToSolutions = () => {
    router.push({
      pathname: '/solutions',
      params: { plant, issue, cause, image }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.title}>Diagnosis Results</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>Here's What We Found</Text>
          <Text style={styles.resultsSubtitle}>
            Analysis complete - here are your results
          </Text>
        </View>

        {/* Visual Comparison */}
        <View style={styles.comparisonCard}>
          <Text style={styles.comparisonTitle}>Visual Comparison</Text>
          <View style={styles.imageComparison}>
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: image as string || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop' }} 
                style={[styles.comparisonImage, styles.yourPlantImage]}
              />
              <Text style={styles.yourPlantLabel}>Your Plant</Text>
            </View>
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: healthyPlantImage }} 
                style={[styles.comparisonImage, styles.healthyPlantImage]}
              />
              <Text style={styles.healthyPlantLabel}>Healthy Reference</Text>
            </View>
          </View>
        </View>

        {/* Diagnosis Information */}
        <View style={styles.diagnosisCard}>
          <View style={styles.diagnosisItem}>
            <View style={styles.diagnosisIcon}>
              <Ionicons name="leaf" size={20} color="#22c55e" />
            </View>
            <View style={styles.diagnosisContent}>
              <Text style={styles.diagnosisLabel}>Plant Identified</Text>
              <Text style={styles.diagnosisValue}>{plant}</Text>
            </View>
          </View>

          <View style={styles.diagnosisItem}>
            <View style={[styles.diagnosisIcon, { backgroundColor: '#fef2f2' }]}>
              <Ionicons name="warning" size={20} color="#ef4444" />
            </View>
            <View style={styles.diagnosisContent}>
              <Text style={styles.diagnosisLabel}>Issue Detected</Text>
              <Text style={[styles.diagnosisValue, { color: '#ef4444' }]}>{issue}</Text>
            </View>
          </View>

          <View style={styles.diagnosisItem}>
            <View style={[styles.diagnosisIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="bulb" size={20} color="#f59e0b" />
            </View>
            <View style={styles.diagnosisContent}>
              <Text style={styles.diagnosisLabel}>Likely Cause</Text>
              <Text style={styles.diagnosisValue}>{cause}</Text>
            </View>
          </View>
        </View>

        {/* Severity Indicator */}
        <View style={styles.severityCard}>
          <View style={styles.severityContent}>
            <View style={styles.severityLeft}>
              <View style={styles.severityIcon}>
                <Ionicons name="warning" size={20} color="#f59e0b" />
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
          <TouchableOpacity style={styles.primaryButton} onPress={navigateToSolutions}>
            <LinearGradient
              colors={['#22c55e', '#16a34a']}
              style={styles.primaryButtonGradient}
            >
              <Ionicons name="arrow-forward" size={24} color="#ffffff" />
              <Text style={styles.primaryButtonText}>View Treatment Solutions</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.secondaryButtons}>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push('/(tabs)/camera')}
            >
              <Text style={styles.secondaryButtonText}>Scan Another Plant</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push('/(tabs)/tips')}
            >
              <Ionicons name="book-outline" size={16} color="#22c55e" />
              <Text style={styles.secondaryButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Audio Explanation */}
        <View style={styles.audioCard}>
          <View style={styles.audioContent}>
            <View style={styles.audioLeft}>
              <View style={styles.audioIcon}>
                <Ionicons name="volume-medium" size={20} color="#22c55e" />
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
              <Ionicons name="volume-medium" size={16} color="#22c55e" />
              <Text style={styles.audioButtonText}>
                {isPlaying ? "Playing..." : "Listen"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Crowdsourcing Section */}
        <View style={styles.crowdsourceCard}>
          <View style={styles.crowdsourceHeader}>
            <View style={styles.crowdsourceIcon}>
              <Ionicons name="people" size={20} color="#22c55e" />
            </View>
            <Text style={styles.crowdsourceTitle}>Help Improve AgroEng AI</Text>
          </View>
          
          <View style={styles.crowdsourceContent}>
            <Text style={styles.crowdsourceLabel}>What crop is this? *</Text>
            <TouchableOpacity style={styles.selectButton}>
              <Text style={styles.selectButtonText}>
                {crowdsourceCrop || "Select crop type"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#6b7280" />
            </TouchableOpacity>
            
            <Text style={styles.crowdsourceLabel}>What problem do you see? (Optional)</Text>
            <TouchableOpacity style={styles.selectButton}>
              <Text style={styles.selectButtonText}>
                {crowdsourceProblem || "Select or describe the problem"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#6b7280" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleCrowdsourceSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Feedback Loop */}
        {!feedbackGiven && (
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>Did the diagnosis help you?</Text>
            <View style={styles.feedbackButtons}>
              <TouchableOpacity 
                style={styles.feedbackButtonYes}
                onPress={() => handleFeedback(true)}
              >
                <Ionicons name="thumbs-up" size={20} color="#ffffff" />
                <Text style={styles.feedbackButtonYesText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.feedbackButtonNo}
                onPress={() => handleFeedback(false)}
              >
                <Ionicons name="thumbs-down" size={20} color="#6b7280" />
                <Text style={styles.feedbackButtonNoText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Accuracy Note */}
        <View style={styles.accuracyCard}>
          <View style={styles.accuracyContent}>
            <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
            <View style={styles.accuracyText}>
              <Text style={styles.accuracyTitle}>AI Confidence: 94%</Text>
              <Text style={styles.accuracySubtitle}>
                This diagnosis is based on visual analysis. For severe cases, consult a local agricultural expert.
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  placeholder: {
    width: 24,
  },
  resultsHeader: {
    backgroundColor: '#f0fdf4',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  resultsSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  comparisonCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  imageComparison: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  comparisonImage: {
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
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  diagnosisItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  diagnosisIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f0fdf4',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  diagnosisContent: {
    flex: 1,
  },
  diagnosisLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  diagnosisValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  severityCard: {
    backgroundColor: '#fef3c7',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fde68a',
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
  severityIcon: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  severityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 2,
  },
  severitySubtitle: {
    fontSize: 12,
    color: '#92400e',
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
    color: '#92400e',
  },
  actionButtons: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginLeft: 4,
  },
  audioCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  audioIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  audioTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  audioSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  audioButtonText: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '500',
    marginLeft: 4,
  },
  crowdsourceCard: {
    backgroundColor: '#f0fdf4',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  crowdsourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  crowdsourceIcon: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  crowdsourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  crowdsourceContent: {
    gap: 16,
  },
  crowdsourceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  selectButtonText: {
    fontSize: 14,
    color: crowdsourceCrop ? '#1f2937' : '#9ca3af',
  },
  submitButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#22c55e',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
  },
  feedbackCard: {
    backgroundColor: '#f0fdf4',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  feedbackButtonYes: {
    flex: 1,
    backgroundColor: '#22c55e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  feedbackButtonYesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  feedbackButtonNo: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  feedbackButtonNoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginLeft: 8,
  },
  accuracyCard: {
    backgroundColor: '#f9fafb',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    padding: 16,
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
    fontSize: 12,
    fontWeight: '600',
    color: '#22c55e',
    marginBottom: 2,
  },
  accuracySubtitle: {
    fontSize: 10,
    color: '#6b7280',
    lineHeight: 14,
  },
  bottomSpacing: {
    height: 20,
  },
});