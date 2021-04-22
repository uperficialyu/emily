
(function () {
  // 解决专业版报Set未定义
  if (!Set) {
    function Set() {
      this.dataStore = [];
    }

    Set.prototype.has = function (data) {
      if (this.dataStore.indexOf(data) > -1) {
        return true;
      }
      return false;
    };

    Set.prototype.add = function (data) {
      if (this.dataStore.indexOf(data) < 0) {
        this.dataStore.push(data);
        return true;
      }
      return false;
    };
  }

  // 解决专业版报Map未定义
  function Map() {

  }
  Map.prototype.set = function (key, value) {
    this[key] = value;
  };
  Map.prototype.get = function (key) {
    return this[key];
  };
  Map.prototype.delete = function (key) {
    delete this[key];
  };

  window.Set = Set;
  window.Map = Map;
}());

// IE9兼容
var lastTime = 0;
window.requestAnimationFrame = window.requestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.msRequestAnimationFrame
  || window.oRequestAnimationFrame
  || function (callback) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    // 为了使setTimteout的尽可能的接近每秒60帧的效果
    callback && window.setTimeout(function(){
      callback(currTime + timeToCall)
    }, timeToCall);
    lastTime = currTime + timeToCall;
  };

// 静止向页面抛出异常，处理专业版兼容ClientHeight\toLowerCase问题
window.onerror = handleError;
function handleError(msg, url, l) {
  return true;
}

function oncontextmenu() {
  return false;
}

document.oncontextmenu = oncontextmenu;
