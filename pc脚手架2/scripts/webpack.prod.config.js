const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const webpackConfigBase = require('./webpack.base.config');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

process.env.NODE_ENV = 'production';

const webpackConfigProd = {
  mode: 'production',
  optimization: {
    minimizer: [
      // 混淆js node>=8
      new UglifyJSPlugin({
        exclude: /dist/,
        parallel: true,
        uglifyOptions: {
          compress: {
            dead_code: true,
            drop_console: true,
            drop_debugger: true,
          }
        }
      })
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      IS_DEVELOPMENT: false,
    }),
    new CleanWebpackPlugin(),
  ],
};

module.exports = merge(webpackConfigBase, webpackConfigProd);
