const webpack = require('webpack');
const proConfig = require('../config/pro.config.js');
const baseConfig = require('../config/base.config.js');
webpack(Object.assign({}, baseConfig, proConfig), (err, stats) => {
  if (err) {
    console.log(err);
  } else {
    console.log('webpack success');
  }
});
