const { nxPreset } = require('@nx/jest/preset');

module.exports = {
  ...nxPreset,
  moduleFileExtensions: ['ts', 'js'],
  testEnvironment: 'jsdom',
};
