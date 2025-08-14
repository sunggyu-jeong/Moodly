export const ONBOARDING_ICONS = {
  onboardingStep1: require('./onboarding-step1.png'),
  onboardingStep2: require('./onboarding-step2.png'),
  onboardingStep3: require('./onboarding-step3.png'),
  onboardingStep4: require('./onboarding-step4.png'),
} as const;

export type OnboardingIconKeys = keyof typeof ONBOARDING_ICONS;
