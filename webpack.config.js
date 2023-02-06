'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/public/',
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: [/\.vert$/, /\.frag$/],
        use: 'asset/source',
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
    }),
  ],
};
