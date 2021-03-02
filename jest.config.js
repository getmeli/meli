module.exports = {
  setupFilesAfterEnv: [
    '<rootDir>/setupTests.js',
  ],
  rootDir: '.',
  testEnvironment: 'node',
  roots: [
    '<rootDir>/src',
  ],
  testRegex: '.(e2e-)?\\.spec\\.(ts|js)$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
  ],
  // allows absolute imports from src
  // moduleDirectories: [
  //   'node_modules',
  //   'src',
  // ],
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/**/*.(e2e-)?\\.spec\\.ts',
    '!src/**/*.(e2e-)?\\.spec\\.tsx',
  ],
  // https://github.com/istanbuljs/istanbuljs/tree/master/packages/istanbul-reports/lib
  coverageReporters: [
    'text-summary',
    'html',
    'lcovonly',
  ],
  globals: {
    // normally set by webpack.DefinePlugin
    BUILD_INFO: {
      version: '0.1.0',
      buildDate: '2020-02-01T15:19:54.093Z',
      commitHash: 'babb2a47d9f3849ff0f697b2df7f44cc9f3b121f',
    },
    SENTRY_RELEASE: 'meli@test',
    SENTRY_DSN: 'https://dsn.meli',
  },
};
