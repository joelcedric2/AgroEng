import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '../contexts/AuthContext';

interface GuestFeatures {
  remainingScans: number;
  canPerformAction: (feature: 'scan' | 'saveHistory' | 'saveFavorite') => boolean;
  updateUsage: (feature: 'scan' | 'saveHistory' | 'saveFavorite') => Promise<void>;
  isGuest: boolean;
}

export const useGuestFeatures = (): GuestFeatures => {
  const context = useContext(AuthContext) as AuthContextType;
  const { guestFeatures, user, isGuest } = context;

  const updateUsage = async (feature: 'scan' | 'saveHistory' | 'saveFavorite') => {
    if (!isGuest || !user) return;

    // In a real app, you would update this on the server
    // For now, we'll just update the local state
    // This is a simplified example - in a real app, you'd want to persist this
    console.log(`Guest used feature: ${feature}`);
  };

  const canPerformAction = (feature: 'scan' | 'saveHistory' | 'saveFavorite') => {
    if (!isGuest) return true;
    return guestFeatures.canPerformAction(feature);
  };

  return {
    ...guestFeatures,
    canPerformAction,
    updateUsage,
    isGuest: isGuest ?? false,
  } as const;
};

// Example usage in a component:
/*
const MyComponent = () => {
  const { canPerformAction, updateUsage, remainingScans } = useGuestFeatures();

  const handleScan = async () => {
    if (!canPerformAction('scan')) {
      // Show upgrade prompt
      return;
    }
    
    // Perform the scan
    await updateUsage('scan');
    // ... rest of scan logic
  };

  return (
    <View>
      <Text>Remaining scans: {remainingScans}</Text>
      <Button onPress={handleScan} title="Scan Plant" />
    </View>
  );
};
*/
