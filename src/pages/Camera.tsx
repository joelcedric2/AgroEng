import React, { useState, useRef } from "react";
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
import { Camera as CameraIcon, Upload, RotateCcw, CheckCircle, Loader2 } from "lucide-react-native";
import { useScans } from "@/hooks/useScans";
import * as ImagePicker from 'expo-image-picker';

interface CameraProps {
  navigation: any;
}

export default function Camera({ navigation }: CameraProps) {
  const { createScan } = useScans();
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleImageCapture = async (useCamera: boolean = true) => {
    try {
      let result;
      
      if (useCamera) {
        // Request camera permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Camera permission is required to take photos');
          return;
        }
        
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        // Request media library permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Photo library permission is required to select images');
          return;
        }
        
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  };

  const processImage = async () => {
    if (!capturedImage) return;
    
    setIsProcessing(true);
    
    try {
      // Create scan record in database
      const scanData = {
        image_url: capturedImage,
        plant_type: "Unknown", // Will be determined by AI
        issue_detected: "Processing...",
        severity: "medium" as const,
        confidence_score: 0
      };
      
      const scan = await createScan(scanData);
      
      // Simulate AI processing (replace with real AI API call)
      setTimeout(() => {
        setIsProcessing(false);
        navigation.navigate('Diagnosis', { 
          scanId: scan?.id,
          image: capturedImage,
          plant: "Tomato",
          issue: "Leaf Blight (Fungal)",
          cause: "Caused by overwatering and poor ventilation"
        });
      }, 3000);
    } catch (error) {
      setIsProcessing(false);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  if (isProcessing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.processingContainer}>
          <View style={styles.processingContent}>
            <View style={styles.processingIcon}>
              <Loader2 size={48} color="#22c55e" />
            </View>
            <Text style={styles.processingTitle}>Analyzing Your Plant</Text>
            <Text style={styles.processingDescription}>
              Our AI is examining the image for diseases, pests, and health indicators...
            </Text>
            <View style={styles.processingSteps}>
              <Text style={styles.processingStep}>✓ Image uploaded successfully</Text>
              <Text style={styles.processingStep}>✓ Plant detected</Text>
              <Text style={styles.processingStep}>⏳ Running health analysis...</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {!capturedImage ? (
            <>
              {/* Camera Instructions */}
              <View style={styles.instructionsCard}>
                <View style={styles.instructionsContent}>
                  <View style={styles.instructionsIcon}>
                    <CameraIcon size={32} color="#22c55e" />
                  </View>
                  <Text style={styles.instructionsTitle}>Take a Clear Photo</Text>
                  <Text style={styles.instructionsDescription}>
                    Make sure the leaf or plant is well-lit and the issue is clearly visible. 
                    Hold your phone steady for the best results.
                  </Text>
                </View>
              </View>

              {/* Camera Viewfinder Simulation */}
              <View style={styles.viewfinderCard}>
                <View style={styles.viewfinderContent}>
                  <CameraIcon size={64} color="#9ca3af" />
                  <Text style={styles.viewfinderText}>Camera viewfinder</Text>
                  <Text style={styles.viewfinderSubtext}>
                    Position your plant in the center of the frame
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={() => handleImageCapture(true)}
                >
                  <CameraIcon size={24} color="#ffffff" />
                  <Text style={styles.primaryButtonText}>Capture Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.secondaryButton}
                  onPress={() => handleImageCapture(false)}
                >
                  <Upload size={20} color="#22c55e" />
                  <Text style={styles.secondaryButtonText}>Upload from Gallery</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {/* Captured Image Preview */}
              <View style={styles.imagePreviewCard}>
                <Image 
                  source={{ uri: capturedImage }}
                  style={styles.capturedImage}
                  resizeMode="cover"
                />
              </View>

              {/* Image Actions */}
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={processImage}
                >
                  <CheckCircle size={24} color="#ffffff" />
                  <Text style={styles.primaryButtonText}>Analyze This Image</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.secondaryButton}
                  onPress={retakePhoto}
                >
                  <RotateCcw size={20} color="#22c55e" />
                  <Text style={styles.secondaryButtonText}>Retake Photo</Text>
                </TouchableOpacity>
              </View>

              {/* Tips for better results */}
              <View style={styles.tipCard}>
                <View style={styles.tipHeader}>
                  <View style={styles.tipIconContainer}>
                    <Text style={styles.tipEmoji}>💡</Text>
                  </View>
                  <View style={styles.tipTextContainer}>
                    <Text style={styles.tipTitle}>Pro Tip</Text>
                    <Text style={styles.tipDescription}>
                      For best results, make sure the affected area is clearly visible and well-lit. 
                      Avoid shadows and blur.
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}
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
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  processingContent: {
    alignItems: 'center',
  },
  processingIcon: {
    width: 96,
    height: 96,
    backgroundColor: '#dcfce7',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  processingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  processingDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  processingSteps: {
    alignItems: 'center',
  },
  processingStep: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  instructionsCard: {
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
  instructionsContent: {
    alignItems: 'center',
  },
  instructionsIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#dcfce7',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  instructionsDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  viewfinderCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#22c55e',
    borderStyle: 'dashed',
    aspectRatio: 1,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewfinderContent: {
    alignItems: 'center',
  },
  viewfinderText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  viewfinderSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  imagePreviewCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  capturedImage: {
    width: '100%',
    aspectRatio: 1,
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
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22c55e',
    marginLeft: 8,
  },
  tipCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipIconContainer: {
    width: 24,
    height: 24,
    backgroundColor: '#fbbf24',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  tipEmoji: {
    fontSize: 12,
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
});