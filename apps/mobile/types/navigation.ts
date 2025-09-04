export type RootStackParamList = {
  onboarding: undefined;
  auth: { screen?: 'login' | 'signup' | 'forgot-password' };
  home: undefined;
  camera: undefined;
  diagnosis: { id: string };
  solutions: undefined;
  'solution-detail': { solution: any }; // Replace 'any' with proper type
  'tip-detail': { tipId: string };
  history: undefined;
  tips: undefined;
  settings: undefined;
  admin: undefined;
};

export type TabParamList = {
  home: undefined;
  camera: undefined;
  history: undefined;
  tips: undefined;
  settings: undefined;
};
