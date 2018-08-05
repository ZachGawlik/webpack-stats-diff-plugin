const path = require('path');
const WebpackStatsDiffPlugin = require('../../src');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PATHS = {
  build: path.resolve(__dirname, 'dist')
};

module.exports = (env = {}) => {
  return {
    mode: 'production',
    entry: {
      entryA: './src/Main.js',
      entryB: './src/About.js',
      entryC: './src/EntryC.js'
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
          use: [MiniCssExtractPlugin.loader, 'css-loader']
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
      new CleanWebpackPlugin([PATHS.build]),
      new MiniCssExtractPlugin({
        filename: '[name].[chunkhash].css',
        chunkFilename: '[name].[chunkhash].css'
      }),
      (process.env.COMPARE_PREVIOUS === 'true' || process.env.STATS_FILE) &&
        new WebpackStatsDiffPlugin({
          oldStatsFile: process.env.STATS_FILE
        })
    ].filter(Boolean),
    optimization: {
      splitChunks: {
        chunks: process.env.CHUNKS_ALL === 'true' ? 'all' : 'async'
      }
    }
  };
};
