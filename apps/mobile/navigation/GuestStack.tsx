import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { VerifyEmailScreen } from '../screens/VerifyEmailScreen';

export type GuestStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  VerifyEmail: { email: string };
};

const Stack = createNativeStackNavigator<GuestStackParamList>();

export function GuestStack() {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
      initialRouteName="Onboarding"
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
    </Stack.Navigator>
  );
}
