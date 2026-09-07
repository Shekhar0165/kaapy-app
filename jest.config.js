module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/__mocks__/async-storage.ts',
    '^lucide-react-native$': '<rootDir>/__mocks__/lucide-react-native.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|react-native-screens|react-native-safe-area-context|lucide-react-native)/)',
  ],
};
