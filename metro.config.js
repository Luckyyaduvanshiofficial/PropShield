// Learn more: https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Optimize for large projects to prevent ENOMEM errors
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    compress: {
      // Reduce memory usage during minification
      drop_console: false,
    },
  },
};

// Increase watcher performance
config.watchFolders = [__dirname];

// Optimize resolver cache
config.resetCache = false;

// Limit concurrent workers to reduce memory usage
config.maxWorkers = 2;

module.exports = config;
