export default {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  transform: {},
  globals: {
    'jest/globals': true
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^sequelize$': '<rootDir>/tests/__mocks__/sequelize.js',
  },
  setupFiles: ['./jest.setup.js']
};
