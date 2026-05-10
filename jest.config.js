export default {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/*.test.ts'],
  runner: "groups",
  moduleNameMapper: {
    '^@actions/core$': '<rootDir>/__tests__/mocks/actionsCore.ts',
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: false, tsconfig: { module: 'CommonJS' } }]
  },
  verbose: true,
  testTimeout: 20000
}
