const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.module.rules.push({
    test: /\.js$/,
    loader: 'babel-loader',
    options: {
      presets: ['babel-preset-expo'],
    },
    include: [
      /node_modules\/react-native-reanimated/
    ],
  });

  return config;
};