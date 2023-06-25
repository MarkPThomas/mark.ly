import { pathsToModuleNameMapper } from 'ts-jest/dist';
const { compilerOptions } = require('./tsconfig.json');


export default {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'apollo-gql/resolvers/*.ts',
    '!apollo-gql/resolvers/*.ispecs.ts',
    '!apollo-gql/resolvers/*.specs.ts',
    'apollo-gql/resolvers/**/*.ts',
    '!apollo-gql/resolvers/**/*.ispecs.ts',
    '!apollo-gql/resolvers/**/*.specs.ts',
    'apollo-gql/resolvers/**/**/*.ts',
    '!apollo-gql/resolvers/**/**/*.ispecs.ts',
    '!apollo-gql/resolvers/**/**/*.specs.ts',
    'middleware/*.ts',
    '!middleware/*.ispecs.ts',
    '!middleware/*.specs.ts',
    'opportunity/*.ts',
    '!opportunity/*.ispecs.ts',
    '!opportunity/*.specs.ts',
    'services/*.ts'
  ],
  coverageProvider: 'v8',
  coverageDirectory: 'testResults/coverage',
  coverageThreshold: {
    global: {
      branches: 54,
      functions: 32,
      lines: 43,
      statements: 43
    }
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      isolatedModules: true
    }
  },


  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  setupFiles: ['./setup-test-matchers.ts'],
  testEnvironment: 'node',
  testMatch: ['**/**/?(*.)+(aspecs|aspec).ts'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  }
};



