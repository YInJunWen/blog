const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const appPath = path.resolve(__dirname, '../');
const distPath = path.resolve(appPath, './dist');

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    vendor: 'jquery',
    main: path.resolve(appPath, './src/app.jsx'),
  },
  output: {
    path: path.resolve(distPath, './static'),
    filename: '[name]-[hash].js',
  },
  plugins: [
    new CleanWebpackPlugin(['dist/*'], {
      root: appPath,
      verbose: true,
      dry: false,
    }),
    // 最简单的配置
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   filename: 'vendor-common.js',
    // }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor'],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(appPath, './index.html'),
      filename: path.resolve(distPath, './index.html'),
    }),
  ],
};
