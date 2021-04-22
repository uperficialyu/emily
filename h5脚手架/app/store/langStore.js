import { observable, action } from 'mobx';

export default class LangStore {
  @observable lang = sessionStorage.getItem('lang') || 'ja';
  // @observable lang = 'en';

  constructor() {
    // const sessionLang = sessionStorage.getItem('lang');
    // if (sessionLang) {
    //   this.lang = sessionLang;
    // } else {
    //   this.lang = /#\/En/.test(location.hash) ? 'en' : 'zh';
    //   sessionStorage.setItem('lang', this.lang);
    // }
  }

  // 修改是否展示牌价部分  展示全屏查询列表
  @action changeLanguage = (lang) => {
    this.lang = lang;
  }
}