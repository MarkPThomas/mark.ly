const path = require('path');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const sharedConfig = require('../../webpack.shared.config.js');

const clientPort = 8080;

const config = {
  target: 'web',

  entry: './src/index.tsx',

  output: {
    path: path.join(__dirname, './build/src'),
    filename: 'scripts/bundle.js',
    publicPath: `http://localhost:${clientPort}/`,
    hashFunction: 'xxhash64',
  },

  devServer: {
    port: clientPort,
    liveReload: true,
  },

  module: {
    rules: [
      {
        test: /\.css?$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/bundle.css',
    }),
  ],
};

module.exports = merge(sharedConfig, config);
