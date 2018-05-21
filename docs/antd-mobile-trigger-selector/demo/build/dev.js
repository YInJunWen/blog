const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const devConfig = require('../config/dev');
const path = require('path');

console.log('path: ', path.resolve(__dirname, '../dist/'));
const options = {
  contentBase: path.resolve(__dirname, '../dist/'),
  hot: true,
  host: 'localhost',
};

webpackDevServer.addDevServerEntrypoints(devConfig, options);
const compiler = webpack(devConfig);
const server = new webpackDevServer(compiler, options);

server.listen(5000, 'localhost', () => {
  console.log('dev server listening on port 5000');
});
