const path = require('path');
const webpack = require('webpack');
const WebpackStatsDiffPlugin = require('../../src');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PATHS = {
  build: path.resolve(__dirname, 'dist')
};

module.exports = () => ({
  entry: {
    entryA: './src/Main.js',
    entryB: './src/About.js',
    entryC: './src/EntryC.js'
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, '../../node_modules')]
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]'
          }
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      }
    ]
  },
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    path: PATHS.build
  },
  stats: {
    chunks: false,
    maxModules: 0
  },
  plugins: [
    new CleanWebpackPlugin([PATHS.build], { beforeEmit: true }),
    new ExtractTextPlugin('[name].[contenthash].css'),
    process.env.COMMONS_CHUNKS === 'true' &&
      new webpack.optimize.CommonsChunkPlugin({
        name: 'commons',
        filename: 'commons.js'
      }),
    (process.env.COMPARE_PREVIOUS === 'true' || process.env.STATS_FILE) &&
      new WebpackStatsDiffPlugin({
        oldStatsFile: process.env.STATS_FILE
      })
  ].filter(Boolean)
});
