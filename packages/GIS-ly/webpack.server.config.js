const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');
const { merge } = require('webpack-merge');
const sharedConfig = require('./webpack.shared.config.js');

let config = {
  target: 'node',

  entry: './server/index.ts',

  output: {
    path: path.join(__dirname, './dist/server'),
    filename: 'bundle.js',
    hashFunction: 'xxhash64',
  },

  externals: [webpackNodeExternals()],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
};

module.exports = merge(sharedConfig, config);
