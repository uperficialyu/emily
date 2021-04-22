const path = require('path');
const webpack = require('webpack');

// 内容为第三方依赖，也可以是公共组件或者方法
// dll中设置的模块会在初始化的时候加载，按需加载需要注意分离出的模块
const vendors = [
  '@babel/polyfill',
  'amfe-flexible',
  'axios',
  'mobx',
  'mobx-react',
  'react',
  'react-dom',
  'react-router-dom',
];

module.exports = {
  entry: {
    vendor: ['@babel/polyfill', 'amfe-flexible', 'axios'],
    react: ['react', 'react-dom', 'react-router-dom'],
    // mobx: ['mobx', 'mobx-react'],
  },
  // entry: {
  //   'lib': vendors,
  // },
  output: {
    path: path.join(__dirname, '../app/dll'),
    filename: '[name]_dll.js',
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      context: __dirname,
      name: '[name]', // name要与library保持一致
      // path: path.join(__dirname, '../app/dll', '[name]_manifest.json'), // 输出文件路径
      path: path.resolve(__dirname, '../app/dll/[name]_manifest.json'),
    }),
  ],
};
