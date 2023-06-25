import { pathsToModuleNameMapper } from 'ts-jest/dist';
const { compilerOptions } = require('./tsconfig.json');

export default {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '!app.ts',
    '!**/**/index.ts',
    '!**/**/**/types.ts',
    '!**/**/**/*.enum.ts',
    '!**/**/**/*.schema.ts',
    '!**/**/**/schema.ts',
    '!**/**/**/*.d.ts',
    '!**/**/**/*.interface.ts',
    '!**/**/**/*.specs.ts',
    '!**/**/**/*.ispecs.ts',
    '!**/**/**/*.aspecs.ts',
    '!**/**/**/*.utils.ts',
    '!**/**/**/*.legacy-*.ts',
    '!apollo-gql/app-frontend-url/mutations/*',
    '!apollo-gql/app-frontend-url/queries/*', ,
    '!apollo-gql/types/*',
    '!apollo-gql/resolvers/utils.ts',
    '!test/acceptance/mocks/*',
    '!test/mocks/*',
    '!test/utils/*',
    '!typings/*',
    '!logger.ts',
    '!config.ts',
    '!*.config.ts',
    '!db-connection.ts',
    '!*.json',
    '!coverage/**/*',
    '!common/*',
    '!middleware/*',
  ],
  coverageProvider: 'v8',
  coverageDirectory: 'testResults/coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 63,
      lines: 54,
      statements: 54
    }
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      isolatedModules: true
    },
    NODE_ENV: 'testing'
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  setupFiles: ['./setup-test-matchers.ts'],
  testEnvironment: 'node',
  testMatch: ['**/**/?(*.)+(ispecs|ispec).ts'],
  // testMatch: ['**/**/fileName.ispecs.ts', '**/**/fileName.specs.ts'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  }
};


