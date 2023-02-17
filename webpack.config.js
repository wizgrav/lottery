'use strict';

module.exports = {
    mode: 'production',
    entry: {
        'main': './index.js'
    },
    devtool: 'source-map',
    target: 'web',
    output: {
        path: __dirname + '/',
        filename: '[name].js',
    },
    performance: {
        maxAssetSize: 20000000,
        maxEntrypointSize: 40000000,
      }

    
    
    
};