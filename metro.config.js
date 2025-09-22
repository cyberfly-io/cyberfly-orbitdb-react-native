const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const customConfig = {
  resolver: {
    // Enable package exports to properly resolve modern ES modules
    unstable_enablePackageExports: true,
    extraNodeModules: {
      crypto: require.resolve('react-native-quick-crypto'),
      stream: require.resolve('stream-browserify'),
      os: require.resolve('os-browserify'),
      path: require.resolve('path-browserify'),
      net: require.resolve('react-native-tcp-socket'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      process: require.resolve('process/browser'),
      util: require.resolve('util'),
      fs: require.resolve('react-native-fs'),
      // Node.js built-in module polyfills
      'node:crypto': require.resolve('react-native-quick-crypto'),
      'node:process': require.resolve('process/browser'),
      'node:os': require.resolve('os-browserify'),
      'node:path': require.resolve('path-browserify'),
      'node:stream': require.resolve('stream-browserify'),
      'node:util': require.resolve('util'),
      'node:fs': require.resolve('react-native-fs'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), customConfig);
