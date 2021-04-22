const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpackConfigBase = require('./webpack.base.config');

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');


function resolve(relatedPath) {
  return path.join(__dirname, relatedPath);
}

const webpackConfigPrd = {
  optimization: {
    minimizer: [
      // 混淆js node>=6.9
      new UglifyJSPlugin({
        exclude: /dist/,
        parallel: true,
        uglifyOptions: {
          compress: {
            dead_code: true,
            drop_console: true,
            drop_debugger: true
          }
        },
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano')({
          reduceIdents: false
        })
      })
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    // 定义环境变量为生产环境
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      IS_DEVELOPMETN: false
    }),
    new CopyPlugin([
      {
        from: resolve('../app/plugins/'),
        to: resolve('../dist/plugins/'),
        toType: 'dir'
      },
      {
        from: resolve('../app/style/'),
        to: resolve('../dist/style/'),
        toType: 'dir'
      }
    ]),
  ],
}

module.exports = merge(webpackConfigBase, webpackConfigPrd);
