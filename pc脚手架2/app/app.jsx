import React from 'react';
import ReactDOM from 'react-dom';
import stores from 'store/index.js';
import { Provider } from 'mobx-react';

import 'amfe-flexible';
import FastClick from 'lib/fastclick';
// 如果你的项目是基于独立App的，请引入native$
import './lib/native$';
import './lib/ED.Logger';
import './app.scss';
import Main from './Main';

import plusReady from 'lib/plusReady';
import './style/iconfont/iconfont.css';
import './style/iconfont/iconfont.js';

ReactDOM.render(
  <Provider {...stores}>
    <Main />
  </Provider>
  ,
  document.getElementById('root'),
)