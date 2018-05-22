const webpack = require('webpack');
const devConfig = require('../config/dist');
webpack(devConfig, (err, stats) => {
  if (err) {
    console.log(err);
  } else {
    console.log('webpack success');
  }
});
