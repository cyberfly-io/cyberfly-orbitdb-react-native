module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module-resolver', {
      alias: {
        'crypto': 'react-native-quick-crypto',
        'CustomEvent': 'custom-event-polyfill',
        'node:crypto': 'react-native-quick-crypto',
        'stream': 'stream-browserify',
        'node:stream': 'stream-browserify',
        'net': 'react-native-tcp-socket',
        'node:net': 'react-native-tcp-socket',
        'os': 'os-browserify',
        'node:os': 'os-browserify',
        'path': 'path-browserify',
        'node:path': 'path-browserify',
        '#compare': './node_modules/uint8arrays/dist/src/compare.js',
          '#concat': './node_modules/uint8arrays/dist/src/concat.js',
          '#from-string': './node_modules/uint8arrays/dist/src/from-string.js',
          '#to-string': './node_modules/uint8arrays/dist/src/to-string.js',
          '#alloc': './node_modules/uint8arrays/dist/src/alloc.js',
          '#util/as-uint8array': './node_modules/uint8arrays/dist/src/util/as-uint8array.js',
      }
    }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    '@babel/plugin-transform-export-namespace-from',
  ]
};
