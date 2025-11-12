try {
  require('@testing-library/jest-native/extend-expect');
} catch (error) {
  console.log('jest-native not installed', error);
}

jest.mock('expo-application', () => ({
  getAndroidId: () => 'android-id-mock',
  getIosIdForVendorAsync: async () => 'ios-id-mock',
}));

jest.mock('expo-apple-authentication', () => ({
  isAvailableAsync: async () => true,
  AppleAuthenticationScope: { EMAIL: 'EMAIL', FULL_NAME: 'FULL_NAME' },
  signInAsync: async () => ({ identityToken: 'apple-token-mock' }),
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  statusCode: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    PLAY_SERVICE_NOT_AVAILABLE: 'PLAY_SERVICE_NOT_AVAILABLE',
  },
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn().mockResolvedValue(true),
    signIn: jest.fn().mockResolvedValue({}),
    getTokens: jest.fn().mockResolvedValue({ idToken: 'google-token-mock' }),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

const _error = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    const s = String(args[0] ?? '');
    if (s.includes('A non-serializable value')) return;
    _error(...args);
  };
});

afterAll(() => {
  console.error = _error;
});
