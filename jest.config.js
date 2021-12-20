module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/*.test.ts'],
  runner: "groups",
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  verbose: true,
  testTimeout: 20000
}