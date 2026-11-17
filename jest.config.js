export default {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/*.test.ts'],
  runner: "groups",
  moduleNameMapper: {
    '^@actions/core$': '<rootDir>/__tests__/mocks/actionsCore.ts',
    '^@actions/exec$': '<rootDir>/node_modules/@actions/exec/lib/exec.js',
    '^@actions/io/lib/io-util$': '<rootDir>/node_modules/@actions/io/lib/io-util.js',
    '^@actions/io$': '<rootDir>/node_modules/@actions/io/lib/io.js',
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { useESM: false, tsconfig: { module: 'CommonJS', allowJs: true } }]
  },
  // Allow the ESM action-toolkit packages through ts-jest under pnpm's .pnpm layout.
  transformIgnorePatterns: [
    '/node_modules/.pnpm/(?!(?:@actions\\+io|@actions\\+exec)@)',
    '/node_modules/(?!\\.pnpm|@actions/io|@actions/exec)'
  ],
  verbose: true,
  testTimeout: 20000
}
