/**
 * @Description 首页
 * @Author: yushunping
 * @Date: 2020-08-21 18:47:17
 * @Last Modified by:   yushunping
 * @Last Modified time: 2021-04-23 07:41:25
 */

import React, { Component, Fragment } from 'react';
import Ajax from 'lib/ajax';
import { sessionSet, sessionGet } from 'storage';
import { FormattedMessage, injectIntl } from 'react-intl';
import { inject, observer } from 'mobx-react';
import './Home.scss';

@inject('langStore')
@observer
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
    } = this.state;
    return (
      <React.Fragment>
        <div>1111</div>
      </React.Fragment>
    );
  }
}

export default injectIntl(Home);
