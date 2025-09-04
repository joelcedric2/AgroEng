import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { GuestStack } from './GuestStack';
import { AppTabs } from './AppTabs';

export function RootNavigator() {
  const { session, isLoading } = useAuth();
  
  if (isLoading) {
    // Show loading screen
    return null;
  }

  return (
    <NavigationContainer>
      {session ? <AppTabs /> : <GuestStack />}
    </NavigationContainer>
  );
}
