import { observable, action } from 'mobx';

export default class HodingStore {
  @observable hodingItem = {};

  constructor() {
  }

  // 修改是否展示牌价部分  展示全屏查询列表
  @action changeHodingItem = (item) => {
    console.log(item,'@action changeHodingItem')
    this.hodingItem = item;
  }
}
