import path from 'path';
import { webpackNodeExternals } from 'webpack-node-externals';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';

module.exports = {
  target: 'node',

  entry: './index.ts',

  output: {
    path: path.join(__dirname, './build'),
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

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
    ],
    resolve: [new TsconfigPathsPlugin({ extensions: [".ts", ".tsx", ".js"] })]
  },

};
