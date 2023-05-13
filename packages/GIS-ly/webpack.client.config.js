const path = require('path');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const sharedConfig = require('./webpack.shared.config.js');

const devMode = process.env.NODE_ENV !== 'production';
const clientPort = 8080;

const config = {
  target: 'web',

  entry: './ui/src/index.tsx',

  output: {
    path: path.join(__dirname, './dist/client'),
    filename: 'scripts/bundle.js',
    publicPath: `http://localhost:${clientPort}/`,
    hashFunction: 'xxhash64',
  },

  devServer: {
    port: clientPort,
    liveReload: true,
  },

  devtool: devMode ? 'source-map' : 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.css?$/i,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader'
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        // More information here https://webpack.js.org/guides/asset-modules/
        type: 'asset',
      },
    ],
  },

  plugins: [].concat(devMode ? [] : [
    new MiniCssExtractPlugin({
      filename: 'styles/bundle.css',
    }),
  ]),
};

module.exports = merge(sharedConfig, config);
