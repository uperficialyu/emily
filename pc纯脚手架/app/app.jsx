import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import stores from 'store/index';
import 'antd/dist/antd.css';
import './app.scss';
import { sessionGet } from 'storage';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
/**
 * @description 导入招商银行网银客户端特有的安全签名方法，
 * 如果fbkeyutil文件中全局方法有修改需要同步修改webpack.base.config.js中exports-loader 相关配置
 */
import { getPubKey, doSign, buildXmlPack } from 'plugins/fbkeyutil.js';
import Base64 from 'plugins/Base64';
import Main from './Main';

window.Base64 = Base64;
window.getPubKey = getPubKey;
window.doSign = doSign;
window.buildXmlPack = buildXmlPack;

// 用户停留在左侧导航其他页签刷新页面，则跳转至第一个页签页面
(function () {
  if (window.location.href.indexOf('#') !== -1) {
    window.location.href = sessionGet('fromLoaction');
  }
}());

ReactDOM.render(
  <DndProvider backend={HTML5Backend}>
    <Provider {...stores}>
      <Main />
    </Provider>
  </DndProvider>,
  document.getElementById('root')
);
