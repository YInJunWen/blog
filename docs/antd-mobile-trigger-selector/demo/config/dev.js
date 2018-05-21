const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const appPath = path.resolve(__dirname, '../');
const baseConfig = require('./base');

module.exports = {
  mode: 'development',
  ...baseConfig,
  plugins: [
    // new webpack.optimize.CommonsChunkPlugin({
    //   names: 'common',
    // }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(appPath, './index.html'),
      filename: path.resolve(appPath, './dist/index.html'),
    }),
  ],
};
