'use strict';

const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'production',
    entry: {
        'main': './index.js'
    },
    devtool: 'source-map',
    target: 'web',
    
    plugins: [
        new CopyPlugin({
            patterns: [
                "index.html"
            ]
          })
       
        
    ],
    output: {
        path: __dirname + '/docs',
        filename: '[name].js',
    },
    performance: {
        maxAssetSize: 20000000,
        maxEntrypointSize: 40000000,
      }

    
    
    
};