import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useEntitlements } from '../hooks/useEntitlements';
import { PaywallSheet } from './PaywallSheet';

type FeatureGateProps = {
  children: ReactNode;
  /**
   * The feature to check access for. If not provided, will check if the user has any paid plan.
   */
  feature?: keyof Omit<ReturnType<typeof useEntitlements>['data'] & object, 'user_id' | 'plan' | 'is_guest' | 'scan_credits'>;
  /**
   * Custom message to show when the feature is locked
   */
  lockedMessage?: string;
  /**
   * Whether to show the upgrade button
   * @default true
   */
  showUpgradeButton?: boolean;
  /**
   * Custom component to render when the feature is locked
   */
  lockedComponent?: ReactNode;
};

export const FeatureGate: React.FC<FeatureGateProps> = ({
  children,
  feature,
  lockedMessage = 'Upgrade to access this feature',
  showUpgradeButton = true,
  lockedComponent,
}) => {
  const { data: entitlements, isLoading } = useEntitlements();
  const [showPaywall, setShowPaywall] = React.useState(false);

  // If we're still loading, don't show anything
  if (isLoading) {
    return null;
  }

  // If no entitlements, user is likely not authenticated
  if (!entitlements) {
    return (
      <View style={styles.lockedContainer}>
        <Text style={styles.lockedText}>Please sign in to access this feature</Text>
        {showUpgradeButton && (
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => {
              // This would typically navigate to the auth screen
              // For now, we'll just show the paywall
              setShowPaywall(true);
            }}
          >
            <Text style={styles.upgradeButtonText}>Sign In</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Check if the user has access to the feature
  const hasAccess = feature ? entitlements[feature] === true : entitlements.plan !== 'free';

  // If they have access, render the children
  if (hasAccess) {
    return <>{children}</>;
  }

  // If a custom locked component was provided, render that
  if (lockedComponent) {
    return <>{lockedComponent}</>;
  }

  // Otherwise, show the default locked state
  return (
    <>
      <View style={styles.lockedContainer}>
        <Text style={styles.lockedText}>{lockedMessage}</Text>
        {showUpgradeButton && (
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => setShowPaywall(true)}
          >
            <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <PaywallSheet
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSuccess={() => setShowPaywall(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    margin: 10,
  },
  lockedText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  upgradeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
