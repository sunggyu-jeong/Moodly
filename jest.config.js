module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
