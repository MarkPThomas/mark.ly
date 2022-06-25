export default {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '!config.ts',
    '!db-connection.ts',
    '!index.ts',
    '!logger/ts',
    '!*.config.ts',
    '!*.json',
    '!**/**/**/*.d.ts',
    '!**/**/**/*.mock.ts',
    '!**/**/**/*config.ts',
    '!**/**/**/*ispecs.ts',
    '!coverage/**/*',
    '!db/connection.ts',
    '!db/orm-config.ts',
    '!db/test-config.ts',
    '!db/types.ts',
    '!db/migration/*',
    '!db/models/*',
    '!db/repositories-orm/**/*',
    '!enums/**/*',
    '!interfaces/**/*',
    '!models/**/*',
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
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