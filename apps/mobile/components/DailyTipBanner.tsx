import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type DailyTipBannerProps = {
  tip: {
    id: string;
    title: string;
    body: string;
  } | null;
  onDismiss: () => void;
};

const DailyTipBanner: React.FC<DailyTipBannerProps> = ({ tip, onDismiss }) => {
  const [visible, setVisible] = useState(!!tip);
  const slideAnim = React.useRef(new Animated.Value(-100)).current;
  const navigation = useNavigation();

  useEffect(() => {
    if (tip) {
      setVisible(true);
      slideIn();
      
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        slideOut();
      }, 5000);
      
      return () => clearTimeout(timer);
    } else {
      slideOut();
    }
  }, [tip]);

  const slideIn = () => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  };

  const slideOut = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      onDismiss();
    });
  };

  const handlePress = () => {
    if (tip) {
      // Navigate to the tip detail screen
      navigation.navigate('TipDetail', { tipId: tip.id });
      slideOut();
    }
  };

  if (!visible || !tip) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <TouchableOpacity 
        style={styles.content}
        activeOpacity={0.9}
        onPress={handlePress}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {tip.title}
          </Text>
          <Text style={styles.body} numberOfLines={1}>
            {tip.body}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={slideOut}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="close" size={20} color="#fff" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingTop: 40, // Account for status bar
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  body: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
  },
  closeButton: {
    padding: 5,
  },
});

export default DailyTipBanner;
