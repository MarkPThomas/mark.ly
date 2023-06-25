import { pathsToModuleNameMapper } from 'ts-jest/dist';
const { compilerOptions } = require('./tsconfig.json');


export default {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'apollo-gql/resolvers/*.ts',
    '!apollo-gql/resolvers/*.ispecs.ts',
    '!apollo-gql/resolvers/*.aspecs.ts',
    'apollo-gql/resolvers/**/*.ts',
    '!apollo-gql/resolvers/**/*.ispecs.ts',
    '!apollo-gql/resolvers/**/*.aspecs.ts',
    'apollo-gql/resolvers/**/**/*.ts',
    '!apollo-gql/resolvers/**/**/*.ispecs.ts',
    '!apollo-gql/resolvers/**/**/*.aspecs.ts',
    'middleware/*.ts',
    '!middleware/*.ispecs.ts',
    '!middleware/*.aspecs.ts',
    'opportunity/*.ts',
    '!opportunity/*.ispecs.ts',
    '!opportunity/*.aspecs.ts',
    'services/*.ts'
  ],
  coverageProvider: 'v8',
  coverageDirectory: 'testResults/coverage',
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 56,
      lines: 32,
      statements: 32
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
  testMatch: ['**/**/?(*.)+(test|specs|spec).ts'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  }
};



