var baseConfig = require('../../install/base.webpack.config');

// Create webpack alias configuration object
var alias = {
  site: process.cwd() + '/webapp',
};

module.exports = function configure(additionalConfig) {
  return baseConfig.merge([{
    context: process.cwd(),
    resolve: {
      alias,
    },
    resolveLoader: {
      modules: [ 'node_modules', ]
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules\/(?!(@veupathdb))/,
          enforce: 'pre',
          use: 'source-map-loader'
        },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          include: /node_modules/,
          loader: 'ify-loader'
        }
      ]
    },

    node: {
      fs: 'empty'
    },

    // Map external libraries Wdk exposes so we can do things like:
    //
    //    import Wdk from 'wdk;
    //    import React from 'react';
    //
    // This will give us more flexibility in changing how we load libraries
    // without having to rewrite a bunch of application code.
    externals: [
      {
        'jquery'           : 'jQuery', // import $ from 'jquery' => var $ = window.jQuery
      }
    ]
  }, additionalConfig]);
}
