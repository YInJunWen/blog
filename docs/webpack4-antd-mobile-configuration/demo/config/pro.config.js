const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
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
    // 每次最终打包的时候先清理输出目录
    new CleanWebpackPlugin(['dist/*'], {
      root: appPath,
      verbose: true,
      dry: false,
    }),
    // 打包index.html文件
    new HtmlWebpackPlugin({
      template: path.resolve(appPath, './index.html'),
      filename: path.resolve(distPath, './index.html'),
    }),
  ],
};
