const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const appPath = path.resolve(__dirname, '../');
const catchePath = path.resolve(__dirname, '../cache');
const version = require('../package.json').version;

module.exports = {
  mode: 'development',
  entry: {
    main: path.resolve(appPath, './src/app.jsx'),
  },
  output: {
    path: catchePath,
    filename: '[name].js',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: catchePath,
    hot: true,
    host: 'localhost',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(appPath, './index.html'),
      filename: path.resolve(catchePath, './index.html'),
    }),
  ],
};
