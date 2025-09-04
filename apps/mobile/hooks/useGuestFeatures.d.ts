declare module 'hooks/useGuestFeatures' {
  interface GuestFeatures {
    remainingScans: number;
    canPerformAction: (feature: 'scan' | 'saveHistory' | 'saveFavorite') => boolean;
    updateUsage: (feature: 'scan' | 'saveHistory' | 'saveFavorite') => Promise<void>;
    isGuest: boolean;
  }

  const useGuestFeatures: () => GuestFeatures;
  
  export default useGuestFeatures;
}
