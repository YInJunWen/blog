const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const appPath = path.resolve(__dirname, '../');
const distPath = path.resolve(appPath, './dist');

module.exports = {
  mode: 'production',
  entry: {
    main: path.resolve(appPath, './src/app.jsx'),
  },
  output: {
    path: path.resolve(distPath, './static'),
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(appPath, './index.html'),
      filename: path.resolve(distPath, './index.html'),
    }),
  ],
};
