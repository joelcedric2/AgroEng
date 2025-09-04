import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';
import TabNavigator from './TabNavigator';
import Onboarding from '../app/onboarding';
import Auth from '../app/auth';
import Diagnosis from '../app/pages/diagnosis';
import Solutions from '../app/pages/solutions';
import AdminDashboard from '../app/pages/admin';
import TipDetailScreen from '../app/pages/tip-detail';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Show a loading screen while checking auth state
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
        initialRouteName={user ? 'home' : 'onboarding'}
      >
        {!user ? (
          // No user logged in
          <>
            <Stack.Screen name="onboarding" component={Onboarding} />
            <Stack.Screen name="auth" component={Auth} />
          </>
        ) : (
          // User is logged in
          <>
            <Stack.Screen name="home" component={TabNavigator} />
            <Stack.Screen 
              name="diagnosis" 
              component={Diagnosis} 
              options={{
                headerShown: true,
                title: 'Diagnosis Details',
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen 
              name="tip-detail" 
              component={TipDetailScreen}
              options={{
                headerShown: true,
                title: 'Daily Tip',
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen 
              name="solutions" 
              component={Solutions}
              options={{
                headerShown: true,
                title: 'Solutions',
                headerBackTitle: 'Back',
              }}
            />
            {user.isAdmin && (
              <Stack.Screen 
                name="admin" 
                component={AdminDashboard}
                options={{
                  headerShown: true,
                  title: 'Admin Dashboard',
                  headerBackTitle: 'Back',
                }}
              />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
