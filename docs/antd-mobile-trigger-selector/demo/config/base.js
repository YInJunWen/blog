const path = require('path');
const appPath = path.resolve(__dirname, '../');

module.exports = {
  entry: path.resolve(appPath, './src/app.jsx'),
  output: {
    path: path.resolve(appPath, './dist'),
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react'],
          },
        },
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
};
