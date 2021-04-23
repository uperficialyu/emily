/*
 * @Author: 卢冰豪
 * @Date: 2018-9-16 10:56:44
 * @Last Modified by: 卢冰豪
 * @Last Modified time: 2018-12-19 20:12:40
 */

const withTranStorageSet = isSession => (item, i) => {

  if (typeof i !== 'undefined') {
    const str = typeof i === 'object' ? JSON.stringify(i) : i;
    if (isSession) {
      sessionStorage.setItem(item, str);
    } else {
      localStorage.setItem(item, str);
    }
  }
};

function storageClear(isSession){
  if (isSession) {
    if(sessionStorage) {
      sessionStorage.clear();
    }
  } else {
    if (localStorage) {
      localStorage.clear();
    }
  }
}

const withTranStorageGet = isSession => (item, isObj) => {
  const str = isSession ? sessionStorage.getItem(item) : localStorage.getItem(item);
  const o = !str ? null : (isObj ? JSON.parse(str) : str);
  return o;
};

const withTranStorageRemove = isSession => (item) => {
  const excuteRemove = isSession ? i => sessionStorage.removeItem(i) : i => localStorage.removeItem(i);
  if (typeof item === 'string') {
    excuteRemove(item);
  } else if (Array.isArray(item)) {
    item.forEach(x => excuteRemove.call(x));
  } else {
    throw new Error('can not suport this format so far');
  }
};

const withTranStorageEach = isSession => (obj) => {
  const toString = Object.prototype.toString;
  if (obj !== null && toString.call(obj) === '[object Object]') {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        let value = obj[key];
        if (value.length !== 0) {
          if (toString.call(value) !== '[object String]') {
            value = JSON.stringify(value);
          }
          if (isSession) {
            sessionStorage.setItem(key, value);
          } else {
            localStorage.setItem(key, value);
          }
        }
      }
    }
  }
};

const sessionSet = withTranStorageSet(true);
const sessionGet = withTranStorageGet(true);
const sessionRemove = withTranStorageRemove(true);
const sessionEachSet = withTranStorageEach(true);
const localSet = withTranStorageSet(false);
const localGet = withTranStorageGet(false);
const localRemove = withTranStorageRemove(false);
const localEachSet = withTranStorageEach(false);

export {
  sessionSet,
  sessionGet,
  sessionRemove,
  sessionEachSet,
  localSet,
  localGet,
  localRemove,
  localEachSet,
  storageClear
};
