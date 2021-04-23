/*
 * 原生httpEngin依赖$方法
 *
 * @Author: 卢冰豪
 * @Date: 2018-12-13 11:46:24
 * @Last Modified by: ICE
 * @Last Modified time: 2020-04-07 11:08:10
 */

(function(win){
  const native$ = {
    emptyFn() {},
    isObject(obj) {
      return typeof obj === 'object';
    },
    isEmptyObject(obj) {
      return Object.keys(obj).length === 0;
    },
    type(m) {
      return typeof m;
    },
    param(data) {
      return data;
    },
    encode: JSON.stringify,
  };
  
  if (!win.$) {
    win.$ = native$;
  } else {
    win.$ = { ...win.$, ...native$ };
  }
})(window);