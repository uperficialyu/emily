const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath);
}

module.exports = {
  mode: 'development',
  entry: {
    index: resolve('../src/index.tsx')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  output: {
    path: resolve('../dist'),
    filename: '[name].[hash:4].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
      // {
      //   test: /\.svg$/,
      //   loader: 'svg-sprite-loader',
      // },
      // {
      //   test: /\.scss$/,
      //   use: ['style-loader', 'css-loader', 'sass-loader']
      // },
      // {
      //   test: /\.(png|jpg|jpeg|gif)$/,
      //   use: [
      //     'file-loader'
      //   ]
      // }
    ]
  },
}