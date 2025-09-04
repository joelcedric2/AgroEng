import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  RefreshControl,
  ActivityIndicator,
  Linking
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

type TipCategory = 'all' | 'diseases' | 'pests' | 'fertilizers' | 'irrigation';

type Tip = {
  id: string;
  title: string;
  category: TipCategory;
  image: string;
  readTime: string;
  isPremium: boolean;
  content: string;
  relatedTips?: string[];
  externalLink?: string;
};

// Helper functions for generating daily tips
const getDailyTipTitle = (index: number): string => {
  const titles = [
    'Maximizing Your Garden\'s Potential',
    'Sustainable Farming Practices',
    'Pest Management 101',
    'Water Conservation Tips',
    'Soil Health Essentials'
  ];
  return titles[(index - 1) % titles.length];
};

const getDailyTipContent = (index: number): string => {
  const contents = [
    'Learn how to optimize your garden layout and plant selection to maximize yield and minimize effort. Proper spacing, companion planting, and crop rotation can significantly improve your results.',
    'Discover sustainable farming techniques that reduce environmental impact while maintaining productivity. From organic fertilizers to integrated pest management, small changes can make a big difference.',
    'Effective pest management starts with identification. Learn to recognize common garden pests and implement natural control methods before resorting to chemical solutions.',
    'Smart watering practices not only conserve water but also promote healthier plants. Learn about drip irrigation, mulching, and the best times to water for optimal absorption.',
    'Healthy soil is the foundation of a productive garden. Understand the importance of soil testing, organic matter, and proper pH levels for thriving plants.'
  ];
  return contents[(index - 1) % contents.length];
};

const getRandomCategory = (): TipCategory => {
  const categories: TipCategory[] = ['diseases', 'pests', 'fertilizers', 'irrigation'];
  return categories[Math.floor(Math.random() * categories.length)];
};

const getRandomImageUrl = (seed: string): string => {
  const baseUrl = 'https://source.unsplash.com/random/400x300/?agriculture';
  return `${baseUrl}&${seed}=${Math.floor(Math.random() * 1000)}`;
};

export function TipsScreen() {
  const [activeCategory, setActiveCategory] = useState<TipCategory>('all');
  const [tips, setTips] = useState<Tip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  
  const navigation = useNavigation();
  // No longer need to check for guest status since first 3 tips are free

    // Fetch daily tips - first 3 are always free
  useEffect(() => {
    const fetchDailyTips = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get today's date to generate consistent daily tips
        const today = new Date().toDateString();
        const dailyTips: Tip[] = [
          {
            id: `${today}-1`,
            title: `Daily Tip: ${getDailyTipTitle(1)}`,
            category: getRandomCategory(),
            image: getRandomImageUrl('tip1'),
            readTime: '3 min read',
            isPremium: false, // First tip is always free
            content: getDailyTipContent(1),
          },
          {
            id: `${today}-2`,
            title: `Daily Tip: ${getDailyTipTitle(2)}`,
            category: getRandomCategory(),
            image: getRandomImageUrl('tip2'),
            readTime: '4 min read',
            isPremium: false, // Second tip is always free
            content: getDailyTipContent(2),
          },
          {
            id: `${today}-3`,
            title: `Daily Tip: ${getDailyTipTitle(3)}`,
            category: getRandomCategory(),
            image: getRandomImageUrl('tip3'),
            readTime: '5 min read',
            isPremium: false, // Third tip is always free
            content: getDailyTipContent(3),
          },
          // Additional premium tips can be added here
        ];
        
        setTips(dailyTips);
      } catch (error) {
        console.error('Error fetching tips:', error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };
    
    fetchDailyTips();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Refresh logic would go here
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const toggleTipExpansion = (tipId: string) => {
    if (expandedTip === tipId) {
      setExpandedTip(null);
    } else {
      setExpandedTip(tipId);
    }
  };

  const handleTipPress = (tip: Tip) => {
    // Always allow access to tips for all users
    toggleTipExpansion(tip.id);
  };

  const handleExternalLink = async (url?: string) => {
    if (!url) return;
    
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  const filteredTips = activeCategory === 'all' 
    ? tips 
    : tips.filter(tip => tip.category === activeCategory);

  const renderCategoryButton = (category: TipCategory, label: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        activeCategory === category && styles.activeCategoryButton
      ]}
      onPress={() => setActiveCategory(category)}
    >
      <Text 
        style={[
          styles.categoryButtonText,
          activeCategory === category && styles.activeCategoryButtonText
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderTipCard = (tip: Tip) => (
    <View 
      key={tip.id} 
      style={styles.tipCard}
    >
      
      <Image 
        source={{ uri: tip.image }} 
        style={styles.tipImage}
        defaultSource={require('../../assets/placeholder-image.png')}
      />
      
      <View style={styles.tipContent}>
        <View style={styles.tipHeader}>
          <Text style={styles.tipCategory}>
            {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
          </Text>
          <Text style={styles.tipReadTime}>• {tip.readTime}</Text>
        </View>
        
        <Text style={styles.tipTitle}>{tip.title}</Text>
        
        {expandedTip === tip.id ? (
          <View>
            <Text style={styles.tipContentText}>{tip.content}</Text>
            
            {tip.relatedTips && tip.relatedTips.length > 0 && (
              <View style={styles.relatedContainer}>
                <Text style={styles.relatedTitle}>Related Tips:</Text>
                {tip.relatedTips.map(relatedTipId => {
                  const relatedTip = tips.find(t => t.id === relatedTipId);
                  if (!relatedTip) return null;
                  
                  return (
                    <TouchableOpacity 
                      key={relatedTip.id}
                      style={styles.relatedTip}
                      onPress={() => handleTipPress(relatedTip)}
                    >
                      <Text style={styles.relatedTipText}>{relatedTip.title}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            
            {tip.externalLink && (
              <TouchableOpacity 
                style={styles.externalLink}
                onPress={() => handleExternalLink(tip.externalLink)}
              >
                <Text style={styles.externalLinkText}>Read more</Text>
                <Image 
                  source={require('../../assets/external-link.png')}
                  style={styles.externalLinkIcon}
                />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.collapseButton}
              onPress={() => toggleTipExpansion(tip.id)}
            >
              <Text style={styles.collapseButtonText}>Show less</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.expandButton}
            onPress={() => handleTipPress(tip)}
          >
            <Text style={styles.expandButtonText}>
              {tip.isPremium && isGuest ? 'Upgrade to read' : 'Read more'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading tips...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {renderCategoryButton('all', 'All')}
          {renderCategoryButton('diseases', 'Diseases')}
          {renderCategoryButton('pests', 'Pests')}
          {renderCategoryButton('fertilizers', 'Fertilizers')}
          {renderCategoryButton('irrigation', 'Irrigation')}
        </ScrollView>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
        }
      >
        <View style={styles.tipsContainer}>
          {filteredTips.length > 0 ? (
            filteredTips.map(renderTipCard)
          ) : (
            <View style={styles.emptyState}>
              <Image 
                source={require('../../assets/no-results.png')} 
                style={styles.emptyStateImage}
              />
              <Text style={styles.emptyStateTitle}>No Tips Found</Text>
              <Text style={styles.emptyStateText}>
                We couldn't find any tips in this category. Try another filter or check back later for updates.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      {isGuest && (
        <View style={styles.guestBanner}>
          <Text style={styles.guestText}>
            Sign up to unlock all premium tips and features
          </Text>
          <TouchableOpacity 
            style={styles.upgradeButton}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  categoriesContainer: {
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoriesScroll: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: '#E8F5E9',
  },
  categoryButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  activeCategoryButtonText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  tipsContainer: {
    padding: 16,
  },
  tipCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  premiumTipCard: {
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  premiumBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    zIndex: 1,
  },
  premiumBadgeText: {
    color: '#FFA000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tipImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  tipContent: {
    padding: 16,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipCategory: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipReadTime: {
    fontSize: 12,
    color: '#9E9E9E',
    marginLeft: 8,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    lineHeight: 24,
  },
  tipContentText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 22,
    marginBottom: 16,
  },
  relatedContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  relatedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  relatedTip: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  relatedTipText: {
    fontSize: 14,
    color: '#1976D2',
  },
  externalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  externalLinkText: {
    color: '#1976D2',
    fontSize: 14,
    marginRight: 4,
  },
  externalLinkIcon: {
    width: 14,
    height: 14,
    tintColor: '#1976D2',
  },
  expandButton: {
    marginTop: 8,
    paddingVertical: 8,
  },
  expandButtonText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 14,
  },
  collapseButton: {
    marginTop: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  collapseButtonText: {
    color: '#9E9E9E',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    opacity: 0.7,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
    marginBottom: 24,
  },
  guestBanner: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#FFB74D',
    alignItems: 'center',
  },
  guestText: {
    color: '#E65100',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  upgradeButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  upgradeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
