import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Clock, Calendar, ShoppingCart, CheckCircle, AlertTriangle, Leaf, Sprout } from "lucide-react-native";

export default function Solutions() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { plant = "Tomato", issue = "Leaf Blight (Fungal)" } = route.params || {};

  const handleSaveSolution = () => {
    Alert.alert("Solution Saved!", "Treatment plan has been saved to your history.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.headerCard}>
            <Text style={styles.headerTitle}>Treatment Plan</Text>
            <Text style={styles.headerSubtitle}>{plant} - {issue}</Text>
          </View>

          {/* Short-term Solutions */}
          <View style={styles.solutionCard}>
            <View style={styles.solutionHeader}>
              <View style={styles.solutionIconContainer}>
                <Clock size={20} color="#f59e0b" />
              </View>
              <Text style={styles.solutionTitle}>Immediate Actions (1-2 days)</Text>
            </View>
            
            <View style={styles.solutionList}>
              <View style={styles.solutionItem}>
                <View style={styles.checkIconContainer}>
                  <CheckCircle size={16} color="#22c55e" />
                </View>
                <View style={styles.solutionText}>
                  <Text style={styles.solutionItemTitle}>Remove Infected Leaves</Text>
                  <Text style={styles.solutionItemDescription}>
                    Cut and dispose of all affected leaves to prevent spread. Clean tools with alcohol between cuts.
                  </Text>
                </View>
              </View>
              
              <View style={styles.solutionItem}>
                <View style={styles.checkIconContainer}>
                  <CheckCircle size={16} color="#22c55e" />
                </View>
                <View style={styles.solutionText}>
                  <Text style={styles.solutionItemTitle}>Apply Organic Fungicide</Text>
                  <Text style={styles.solutionItemDescription}>
                    Spray with neem oil or copper-based fungicide in early morning or evening.
                  </Text>
                </View>
              </View>
              
              <View style={styles.solutionItem}>
                <View style={styles.checkIconContainer}>
                  <CheckCircle size={16} color="#22c55e" />
                </View>
                <View style={styles.solutionText}>
                  <Text style={styles.solutionItemTitle}>Improve Air Circulation</Text>
                  <Text style={styles.solutionItemDescription}>
                    Space plants further apart and remove lower leaves touching the ground.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Long-term Solutions */}
          <View style={styles.solutionCard}>
            <View style={styles.solutionHeader}>
              <View style={[styles.solutionIconContainer, styles.primaryIcon]}>
                <Calendar size={20} color="#22c55e" />
              </View>
              <Text style={styles.solutionTitle}>Prevention & Long-term Care</Text>
            </View>
            
            <View style={styles.solutionList}>
              <View style={styles.solutionItem}>
                <View style={[styles.checkIconContainer, styles.primaryCheck]}>
                  <Leaf size={16} color="#22c55e" />
                </View>
                <View style={styles.solutionText}>
                  <Text style={styles.solutionItemTitle}>Adjust Watering Schedule</Text>
                  <Text style={styles.solutionItemDescription}>
                    Water at soil level in early morning. Avoid watering leaves directly.
                  </Text>
                </View>
              </View>
              
              <View style={styles.solutionItem}>
                <View style={[styles.checkIconContainer, styles.primaryCheck]}>
                  <Leaf size={16} color="#22c55e" />
                </View>
                <View style={styles.solutionText}>
                  <Text style={styles.solutionItemTitle}>Soil Management</Text>
                  <Text style={styles.solutionItemDescription}>
                    Add organic compost and ensure proper drainage to strengthen plant immunity.
                  </Text>
                </View>
              </View>
              
              <View style={styles.solutionItem}>
                <View style={[styles.checkIconContainer, styles.primaryCheck]}>
                  <Leaf size={16} color="#22c55e" />
                </View>
                <View style={styles.solutionText}>
                  <Text style={styles.solutionItemTitle}>Crop Rotation</Text>
                  <Text style={styles.solutionItemDescription}>
                    Plan to rotate with non-solanaceous crops next season to break disease cycle.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Local Remedies */}
          <View style={styles.localRemediesCard}>
            <View style={styles.solutionHeader}>
              <View style={[styles.solutionIconContainer, styles.successIcon]}>
                <Sprout size={20} color="#22c55e" />
              </View>
              <Text style={styles.solutionTitle}>Local Remedies</Text>
            </View>
            
            <View style={styles.solutionList}>
              <View style={styles.solutionItem}>
                <View style={[styles.checkIconContainer, styles.successCheck]}>
                  <CheckCircle size={16} color="#22c55e" />
                </View>
                <View style={styles.solutionText}>
                  <Text style={styles.solutionItemTitle}>Neem Oil Solution</Text>
                  <Text style={styles.solutionItemDescription}>
                    Mix 2 tablespoons of neem oil with 1 liter of water. Spray in early morning or evening.
                  </Text>
                </View>
              </View>
              
              <View style={styles.solutionItem}>
                <View style={[styles.checkIconContainer, styles.successCheck]}>
                  <CheckCircle size={16} color="#22c55e" />
                </View>
                <View style={styles.solutionText}>
                  <Text style={styles.solutionItemTitle}>Ash & Pepper Solution</Text>
                  <Text style={styles.solutionItemDescription}>
                    Mix wood ash with ground pepper and water to create natural pest deterrent spray.
                  </Text>
                </View>
              </View>
              
              <View style={styles.solutionItem}>
                <View style={[styles.checkIconContainer, styles.successCheck]}>
                  <CheckCircle size={16} color="#22c55e" />
                </View>
                <View style={styles.solutionText}>
                  <Text style={styles.solutionItemTitle}>Improve Plant Spacing</Text>
                  <Text style={styles.solutionItemDescription}>
                    Space plants 30-45cm apart to reduce humidity and improve air circulation naturally.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Product Suggestions */}
          <View style={styles.productCard}>
            <View style={styles.solutionHeader}>
              <View style={[styles.solutionIconContainer, styles.accentIcon]}>
                <ShoppingCart size={20} color="#06b6d4" />
              </View>
              <Text style={styles.solutionTitle}>Recommended Products</Text>
            </View>
            
            <View style={styles.productList}>
              <View style={styles.productItem}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>Neem Oil - 100ml</Text>
                  <Text style={styles.productDescription}>Organic fungicide & pesticide</Text>
                </View>
                <TouchableOpacity style={styles.productButton}>
                  <Text style={styles.productPrice}>$8.99</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.productItem}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>Copper Sulfate Spray</Text>
                  <Text style={styles.productDescription}>Preventive fungicide</Text>
                </View>
                <TouchableOpacity style={styles.productButton}>
                  <Text style={styles.productPrice}>$12.50</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveSolution}
            >
              <CheckCircle size={24} color="#ffffff" />
              <Text style={styles.saveButtonText}>Save Treatment Plan</Text>
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
                onPress={() => navigation.navigate('History')}
              >
                <Text style={styles.secondaryButtonText}>View History</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress Tracking */}
          <View style={styles.progressCard}>
            <View style={styles.progressContent}>
              <AlertTriangle size={20} color="#f59e0b" />
              <View style={styles.progressText}>
                <Text style={styles.progressTitle}>Treatment Progress</Text>
                <Text style={styles.progressSubtitle}>
                  Check your plant in 3-5 days. Take another photo to track improvement.
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
  solutionCard: {
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
  localRemediesCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  productCard: {
    backgroundColor: '#f0fdfa',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  solutionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  solutionIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  primaryIcon: {
    backgroundColor: '#dcfce7',
  },
  successIcon: {
    backgroundColor: '#dcfce7',
  },
  accentIcon: {
    backgroundColor: '#cffafe',
  },
  solutionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  solutionList: {
    marginTop: 8,
  },
  solutionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkIconContainer: {
    width: 24,
    height: 24,
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  primaryCheck: {
    backgroundColor: '#dcfce7',
  },
  successCheck: {
    backgroundColor: '#dcfce7',
  },
  solutionText: {
    flex: 1,
  },
  solutionItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  solutionItemDescription: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  productList: {
    marginTop: 8,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  productButton: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  productPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
  },
  actionButtons: {
    marginBottom: 24,
  },
  saveButton: {
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
  saveButtonText: {
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
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  progressCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    marginLeft: 12,
    flex: 1,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
});