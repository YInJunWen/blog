const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const devConfig = require('../config/dev.config.js');
const baseConfig = require('../config/base.config.js');
const path = require('path');

const compiler = webpack(Object.assign({}, baseConfig, devConfig));
const server = new webpackDevServer(compiler);

server.listen(5000, 'localhost', () => {
  console.log('dev server listening on port 5000');
});
