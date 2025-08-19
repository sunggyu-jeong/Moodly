export const AUTH_PROVIDERS = {
  GOOGLE: 'google',
  APPLE: 'apple',
} as const;

export type AuthProvider = (typeof AUTH_PROVIDERS)[keyof typeof AUTH_PROVIDERS];
