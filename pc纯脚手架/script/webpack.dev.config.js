const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackConfigBase = require('./webpack.base.config');

const PORT = 8081;

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath);
}

const webpackConfigDev = {
  plugins: [
    // 定义环境变量为开发环境
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      IS_DEVELOPMETN: true,
    }),
  ],

  devtool: 'source-map',
  devServer: {
    contentBase: resolve('../app'),
    historyApiFallback: false,
    hot: true,
    host: '0.0.0.0',
    port: PORT,
    proxy: {

      '/Frontend': {
        target: 'http://xfundsuat.cmburl.cn:8081',
        secure: false,
        changeOrigin: true,
      }
    }
  },
};

module.exports = merge(webpackConfigBase, webpackConfigDev);
