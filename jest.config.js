const { readFileSync } = require('fs');

const config = JSON.parse(readFileSync('./.swcrc'));

module.exports = {
  testEnvironment: 'node',
  roots: ['src'],
  collectCoverage: true,
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { ...config }],
  },
};
