import { jest } from '@jest/globals';

require('react-native-gesture-handler/jestSetup');

jest.mock('@hot-updater/react-native', () => ({
  HotUpdater: {
    checkForUpdate: jest.fn(),
    updateBundle: jest.fn(),
    reload: jest.fn(),
  },
}));
