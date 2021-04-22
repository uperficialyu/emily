/**
 * @Author: 江延超
 * @Date: 2019/5/23 9:41
 * @Last Modified by:   yushunping
 * @Last Modified time: 2021-04-22 07:18:37
 */
 const path = require('path');
 const webpack = require('webpack');
 // 内容为第三方依赖，也可以是公共组件或者方法
 // dll中设置的模块会在初始化的时候加载，按需加载需要注意分离出的模块
 const vendors = [
   'antd',
   'react',
   'react-dom',
   'react-router-dom',
   'mobx',
   'mobx-react'
 ];
 
 module.exports = {
   entry: {
     'lib': vendors
   },
   output: {
     path: path.join(__dirname, '../app/dll'),
     filename: '[name]-dll.js',
     library: '[name]'
   },
   plugins: [
     new webpack.DllPlugin({
       context: __dirname,
       name: '[name]', // name要与library保持一致
       path: path.join(__dirname, '../app/dll', '[name]-manifest.json') // 输出文件路径
     })
   ]
 };
 