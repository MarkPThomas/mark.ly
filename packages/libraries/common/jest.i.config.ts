export default {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '!coverage/**/*',
    'database/**/*',
    'database/**/*',
    'errors/**/*',
    '!enums/**/*',
    '!interfaces/**/*',
    '!logger/**/*',
    'middleware/**/*',
    '!models/**/*',
    'utils/**/*',
    '!config.ts',
    '!connection.ts',
    '!**/index.ts',
    '!*.config.ts',
    '!*.json',
    '!**/**/**/*.d.ts',
    '!**/**/**/*.mock.ts',
    '!**/**/**/*config.ts',
    '!**/**/**/*ispecs.ts',
    '!**/**/**/*specs.ts',
    '!*.spec.ts',
    '!database/connection.ts',
    '!database/orm-config.ts',
    '!database/test-config.ts',
    '!database/types.ts',
    '!database/migrations/*',
    '!database/models/*',
    '!database/repositories-orm/**/*', ,
    '!utils/axios.ts',
    '!utils/terminateProcess.ts'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  setupFiles: ['./setup-test-matchers.ts'],
  testEnvironment: 'node',
  testMatch: [
    '**/**/?(*.)+(ispecs|ispec).ts'
  ],
  transform: {
    '^.+\\ts?$': 'ts-jest'
  }
}