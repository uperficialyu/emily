const path = require('path');
const webpack = require('webpack');

process.env.NODE_ENV = 'development';
const merge = require('webpack-merge');
const webpackConfigBase = require('./webpack.base.config');

const PORT = 8001;

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath);
}

const webpackConfigDev = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: resolve('../app'),
    historyApiFallback: true,
    hot: true,
    host: '0.0.0.0',
    // host: '192.168.90.58',
    port: PORT,
    proxy: {
      '/api': {
        target: 'http://192.168.70.65:12345',
        secure: false,
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:12345',
        secure: false,
        changeOrigin: true,
      },
      '/egate': {
        target: 'http://192.168.30.8:8383',
        secure: false,
        changeOrigin: true,
      }
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      IS_DEVELOPMENT: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};

module.exports = merge(webpackConfigBase, webpackConfigDev);
