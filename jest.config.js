export default {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/*.test.ts'],
  runner: "groups",
  moduleNameMapper: {
    '^@actions/core$': '<rootDir>/__tests__/mocks/actionsCore.ts',
    '^@actions/io$': '<rootDir>/node_modules/@actions/io/lib/io.js',
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { useESM: false, tsconfig: { module: 'CommonJS', allowJs: true } }]
  },
  transformIgnorePatterns: ['/node_modules/(?!@actions/io/)'],
  verbose: true,
  testTimeout: 20000
}
