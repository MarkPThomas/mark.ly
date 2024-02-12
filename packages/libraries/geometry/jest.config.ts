// const { pathsToModuleNameMapper } = require('ts-jest');
// const { compilerOptions } = require('./tsconfig');

export default {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '!coverage/**/*',
    'src/**/*',
    '!**/index.ts',
    '!*.config.ts',
    '!*.json',
    '!**/**/**/*.d.ts',
    '!**/**/**/*.mock.ts',
    '!**/**/**/*config.ts',
    '!**/**/**/*ispecs.ts',
    '!**/**/**/*specs.ts',
    '!*.spec.ts',
  ],
  coverageThreshold: {
    "global": {
      "branches": 20,
      "functions": 30,
      "lines": 50,
      "statements": 50
    }
  },
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  moduleNameMapper: //pathsToModuleNameMapper(compilerOptions.paths, { prefix: `<rootDir>${compilerOptions.baseUrl}` }),
  // Currently failing to load/parse tsconfig.json.
  // Fix solution to this: https://stackoverflow.com/questions/52860868/typescript-paths-not-resolving-when-running-jest
  // Below is a manual stub for now.
  {
    'data-structures': '<rootDir>/../data-structures/src'
  },
  // modulePaths: [
  //   '<rootDir>'
  // ],
  // setupFiles: ['./setup-test-matchers.ts'],
  testEnvironment: 'jsdom',
  testMatch: [
    '**/**/?(*.)+(specs|spec).ts'
  ],
  transform: {
    '^.+\\ts?$': 'ts-jest'
  }
}