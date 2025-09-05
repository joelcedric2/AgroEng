import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        if (photo) {
          setCapturedImage(photo.uri);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  const processImage = async () => {
    if (!capturedImage) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to a diagnosis results screen (you can create this later)
      Alert.alert(
        'Analysis Complete',
        'Plant: Tomato\nIssue: Leaf Blight (Fungal)\nCause: Overwatering and poor ventilation',
        [
          { text: 'View Solutions', onPress: () => console.log('Navigate to solutions') },
          { text: 'OK' }
        ]
      );
    }, 3000);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <View style={styles.permissionContent}>
          <Ionicons name="camera-outline" size={64} color="#6b7280" />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to help you diagnose your plants
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
            <Text style={styles.galleryButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isProcessing) {
    return (
      <SafeAreaView style={styles.processingContainer}>
        <LinearGradient
          colors={['#f8fafc', '#e2e8f0']}
          style={styles.processingGradient}
        >
          <View style={styles.processingContent}>
            <View style={styles.processingIconContainer}>
              <Ionicons name="scan" size={48} color="#22c55e" />
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
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!capturedImage ? (
        <>
          {/* Instructions Card */}
          <View style={styles.instructionsCard}>
            <View style={styles.instructionsContent}>
              <Ionicons name="camera" size={32} color="#22c55e" />
              <Text style={styles.instructionsTitle}>Take a Clear Photo</Text>
              <Text style={styles.instructionsText}>
                Make sure the leaf or plant is well-lit and the issue is clearly visible
              </Text>
            </View>
          </View>

          {/* Camera View */}
          <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
            <View style={styles.cameraOverlay}>
              {/* Camera Controls */}
              <View style={styles.cameraControls}>
                <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                  <Ionicons name="camera-reverse" size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>

              {/* Capture Area Guide */}
              <View style={styles.captureGuide}>
                <View style={styles.captureFrame} />
                <Text style={styles.captureText}>Position plant in frame</Text>
              </View>

              {/* Bottom Controls */}
              <View style={styles.bottomControls}>
                <TouchableOpacity style={styles.galleryBtn} onPress={pickImage}>
                  <Ionicons name="images" size={24} color="#ffffff" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
                
                <View style={styles.placeholder} />
              </View>
            </View>
          </CameraView>
        </>
      ) : (
        <View style={styles.previewContainer}>
          {/* Image Preview */}
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          
          {/* Action Buttons */}
          <View style={styles.previewActions}>
            <TouchableOpacity style={styles.analyzeButton} onPress={processImage}>
              <LinearGradient
                colors={['#22c55e', '#16a34a']}
                style={styles.analyzeGradient}
              >
                <Ionicons name="checkmark-circle" size={24} color="#ffffff" />
                <Text style={styles.analyzeText}>Analyze This Image</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
              <Ionicons name="refresh" size={20} color="#6b7280" />
              <Text style={styles.retakeText}>Retake Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Pro Tip */}
          <View style={styles.proTip}>
            <View style={styles.proTipIcon}>
              <Text style={styles.proTipEmoji}>💡</Text>
            </View>
            <View style={styles.proTipContent}>
              <Text style={styles.proTipTitle}>Pro Tip</Text>
              <Text style={styles.proTipText}>
                For best results, make sure the affected area is clearly visible and well-lit. Avoid shadows and blur.
              </Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContent: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  galleryButton: {
    borderWidth: 1,
    borderColor: '#22c55e',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  galleryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22c55e',
  },
  instructionsCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
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
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 12,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  camera: {
    flex: 1,
    marginTop: 16,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  flipButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
  },
  captureGuide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#22c55e',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  captureText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  galleryBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 15,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#22c55e',
  },
  placeholder: {
    width: 50,
    height: 50,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  previewImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  previewActions: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  analyzeButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  analyzeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  analyzeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
  },
  retakeText: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 8,
    fontWeight: '600',
  },
  proTip: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  proTipIcon: {
    marginRight: 12,
  },
  proTipEmoji: {
    fontSize: 16,
  },
  proTipContent: {
    flex: 1,
  },
  proTipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 4,
  },
  proTipText: {
    fontSize: 12,
    color: '#92400e',
    lineHeight: 16,
  },
  processingContainer: {
    flex: 1,
  },
  processingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  processingContent: {
    alignItems: 'center',
  },
  processingIconContainer: {
    width: 96,
    height: 96,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  processingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  processingDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  processingSteps: {
    alignItems: 'flex-start',
  },
  processingStep: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
});