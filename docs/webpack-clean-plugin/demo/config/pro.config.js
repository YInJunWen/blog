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
    filename: `[name]-${new Date().getTime()}.js`,
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: appPath,
      exclude: ['static'],
      verbose: true,
      dry: false,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(appPath, './index.html'),
      filename: path.resolve(distPath, './index.html'),
    }),
  ],
};
