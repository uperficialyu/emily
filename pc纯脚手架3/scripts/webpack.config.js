/**
 * @Author: yushunping
 * @Date:   2021-04-24 18:20:08
 * @Last Modified by:   yushunping
 * @Last Modified time: 2021-04-24 19:38:53
*/

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath);
}

module.exports = {
  entry: {
    index: resolve('../lib/index.tsx')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  output: {
    path: resolve('../dist/lib'), // 路径
    // 1
    // filename: 'common.bundle.js',
    // chunkFilename: 'chunks/[name].js',
    // 库
    library: 'YSP',
    libraryTarget: 'umd', // 库的类型
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
    ]
  },
  plugins: [
		new HtmlWebpackPlugin({
			template: 'index.html',
			// template: 'example.html',
			title: 'Emily-ui',
		})
	],
}