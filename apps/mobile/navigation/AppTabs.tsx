import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { TipsScreen } from '../screens/TipsScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

type AppTabsParamList = {
  Home: undefined;
  Tips: undefined;
  Scan: undefined;
  History: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabsParamList>();

export function AppTabs() {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Tips') {
            iconName = 'bulb';
          } else if (route.name === 'Scan') {
            iconName = 'camera';
          } else if (route.name === 'History') {
            iconName = 'time';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tips" component={TipsScreen} />
      <Tab.Screen 
        name="Scan" 
        component={ScanScreen}
        options={{
          tabBarLabel: 'Scan',
          tabBarIcon: ({ color, size }) => (
            <View style={{
              backgroundColor: theme.colors.primary,
              width: 60,
              height: 60,
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 25,
              borderWidth: 4,
              borderColor: theme.colors.background,
            }}>
              <Ionicons name="camera" size={28} color="white" />
            </View>
          ),
        }}
      />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
