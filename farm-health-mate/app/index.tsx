import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // Redirect to onboarding immediately
    router.replace('/onboarding');
  }, []);

  return null;
}