import React from 'react';
import AppRouter from './router/router';
import { sessionGet } from 'storage';
import { IntlProvider } from 'react-intl';
import { inject, observer} from 'mobx-react';
import { zhTW, enUS, cnCN } from 'locate';

const Main = inject('langStore')(observer((props) => {
  const def = props.langStore.lang || sessionGet('lang', true);

  const langData = {
    zh: zhTW, // 繁体
    en: enUS, // 英文
    ja: cnCN, // 简体
  };

  return (
    <IntlProvider locale={def} messages={langData[def]}>
      <AppRouter />
    </IntlProvider>
  );
}));

export default Main;