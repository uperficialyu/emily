const base = require('./webpack.config.base');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath);
}

module.exports = Object.assign({}, base, {
  mode: 'development',
  plugins: [
		new HtmlWebpackPlugin({
			template: resolve('../src/index.html'),
			title: 'Emily-ui',
		})
	],
})