module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required for react-native-gesture-handler
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            'contexts': './contexts',
            'components': './components',
            'screens': './screens',
            'hooks': './hooks',
            'lib': './lib',
          },
        },
      ],
    ],
  };
};
