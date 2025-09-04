import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { CameraView, CameraType } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useGuestFeatures } from '../hooks/useGuestFeatures';

type ScanResult = {
  disease: string;
  confidence: number;
  treatment: string;
  timestamp: number;
};

export function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const navigation = useNavigation();
  const { isGuest } = useAuth();
  const { canPerformAction, recordAction } = useGuestFeatures();

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await CameraView.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleTakePicture = async () => {
    if (!cameraRef.current) return;
    
    // Check if guest has scans remaining
    if (isGuest && !canPerformAction('scan')) {
      Alert.alert(
        'Scan Limit Reached',
        'You have reached your free scan limit. Please sign up to continue scanning.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Sign Up', 
            onPress: () => navigation.navigate('SignUp')
          }
        ]
      );
      return;
    }
    
    setIsScanning(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
        exif: false
      });
      
      setCapturedImage(photo.uri);
      await processImage(photo.base64);
      
      // Record the scan action for guest users
      if (isGuest) {
        recordAction('scan');
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const processImage = async (base64Image: string) => {
    setIsProcessing(true);
    
    try {
      // TODO: Replace with actual API call to your backend
      // This is a mock implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result - replace with actual API response
      const mockResult: ScanResult = {
        disease: 'Early Blight',
        confidence: 0.87,
        treatment: 'Apply copper-based fungicides and remove affected leaves to prevent spread.',
        timestamp: Date.now(),
      };
      
      setScanResult(mockResult);
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScan = () => {
    setCapturedImage(null);
    setScanResult(null);
  };

  const toggleCameraType = () => {
    setCameraType(current => 
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  if (hasPermission === null) {
    return <View style={styles.loadingContainer}><Text>Requesting camera permission...</Text></View>;
  }
  
  if (hasPermission === false) {
    return <View style={styles.loadingContainer}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      {!capturedImage ? (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            type={cameraType}
            ref={cameraRef}
          >
            <View style={styles.overlay}>
              <View style={styles.scanFrame}>
                <View style={styles.cornerTopLeft} />
                <View style={styles.cornerTopRight} />
                <View style={styles.cornerBottomLeft} />
                <View style={styles.cornerBottomRight} />
              </View>
              <Text style={styles.scanText}>Position plant within the frame</Text>
            </View>
          </CameraView>
          
          <View style={styles.controls}>
            <TouchableOpacity 
              style={styles.flipButton}
              onPress={toggleCameraType}
              disabled={isScanning}
            >
              <Image 
                source={require('../../assets/flip-camera.png')}
                style={styles.flipIcon}
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.captureButton, isScanning && styles.captureButtonDisabled]}
              onPress={handleTakePicture}
              disabled={isScanning}
            >
              {isScanning ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.innerCaptureButton} />
              )}
            </TouchableOpacity>
            
            <View style={styles.placeholder} />
          </View>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <Image 
            source={{ uri: capturedImage }} 
            style={styles.capturedImage}
            resizeMode="contain"
          />
          
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.processingText}>Analyzing plant health...</Text>
            </View>
          ) : scanResult ? (
            <View style={styles.resultDetails}>
              <Text style={styles.resultTitle}>Scan Results</Text>
              
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Disease Detected:</Text>
                <Text style={styles.resultValue}>{scanResult.disease}</Text>
              </View>
              
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Confidence:</Text>
                <Text style={styles.resultValue}>
                  {(scanResult.confidence * 100).toFixed(0)}%
                </Text>
              </View>
              
              <View style={styles.treatmentContainer}>
                <Text style={styles.treatmentTitle}>Recommended Treatment:</Text>
                <Text style={styles.treatmentText}>{scanResult.treatment}</Text>
              </View>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.secondaryButton}
                  onPress={resetScan}
                >
                  <Text style={styles.secondaryButtonText}>Scan Again</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={() => {
                    // TODO: Save to history
                    Alert.alert('Success', 'Scan saved to your history');
                  }}
                >
                  <Text style={styles.primaryButtonText}>Save to History</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      )}
      
      {isGuest && (
        <View style={styles.guestBanner}>
          <Text style={styles.guestText}>
            Guest: {canPerformAction('scan') ? 'Scans remaining: ' + canPerformAction('scan') : 'No scans left'}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.upgradeText}>Upgrade to Pro</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  scanFrame: {
    width: 280,
    height: 280,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 16,
    position: 'relative',
    marginBottom: 24,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#4CAF50',
  },
  cornerTopLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 16,
  },
  cornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 16,
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 16,
  },
  scanText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#000',
  },
  flipButton: {
    padding: 12,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  flipIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonDisabled: {
    opacity: 0.7,
  },
  innerCaptureButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
  },
  placeholder: {
    width: 50,
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  capturedImage: {
    width: '100%',
    height: '40%',
    backgroundColor: '#000',
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  resultDetails: {
    flex: 1,
    padding: 20,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  treatmentContainer: {
    marginTop: 20,
    backgroundColor: '#F1F8E9',
    padding: 16,
    borderRadius: 8,
  },
  treatmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  treatmentText: {
    fontSize: 14,
    color: '#1B5E20',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 12,
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  guestBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#FFB74D',
  },
  guestText: {
    color: '#E65100',
    fontSize: 14,
  },
  upgradeText: {
    color: '#E65100',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
