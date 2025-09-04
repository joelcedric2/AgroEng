import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// Import screens
import Onboarding from '../onboarding';
import Auth from '../auth';
import Home from '../(tabs)/home';
import Camera from '../(tabs)/camera';
import Diagnosis from '../pages/diagnosis';
import Solutions from '../pages/solutions';
import History from '../(tabs)/history';
import Tips from '../pages/tips';
import Settings from '../(tabs)/settings';
import AdminDashboard from '../pages/admin';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="onboarding"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="onboarding" component={Onboarding} />
        <Stack.Screen name="auth" component={Auth} />
        <Stack.Screen name="home" component={Home} />
        <Stack.Screen name="camera" component={Camera} />
        <Stack.Screen name="diagnosis" component={Diagnosis} />
        <Stack.Screen name="solutions" component={Solutions} />
        <Stack.Screen name="history" component={History} />
        <Stack.Screen name="tips" component={Tips} />
        <Stack.Screen name="settings" component={Settings} />
        <Stack.Screen name="admin" component={AdminDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
