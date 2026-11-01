module.exports = {
  clearMocks: true,
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '^(_fns|handlers|helpers|hooks|modules|ui|utils|variables)/(.*)$':
      '<rootDir>/src/$1/$2',
  },
};
