;(function(){
/**
  * Create at: 2020/2/28 10:02
  * @description 前端日志统一输出插件,核心代码源自Eui框架日志模块。
	*  为了方便调试，提供打印输出日志，可以指定不同的日志级别，大于等于默认日志级别{@link ED.Logger#level}将会控制台上输出。
	* level： 'debug'< 'table' < 'info' < 'warn' < 'trace' < 'error' < 'nolog'
	*
	* 可以通过重写全局日志级别来达到输出特定级别的日志；比如开发阶段日志级别为"debug"，发布阶段日志级别为"nolog"，不输出任何日志信息；如下：
	*
	* 		//发布阶段
	* 		ED.Logger.level = "nolog";
	*
	* 		// 开发阶段
	* 		ED.Logger.level = "debug";
	* 
	* 使用例子，如下：
	*
	*			ED.log("debug","It not support!");
	*			ED.log("info","hello {0},welcome.","Tom","",true);
	*			ED.log("error","The type '{0}' is not support!","panel",true);
	*
	* 具体调用查看{@link ED.Logger#log log}方法执行参数格式。
	* 插件的引入：插件可以直接通过<script src="./lib/ED.Logger.js"></script>在页面引入，也可以在app入口处 import './lib/ED.Logger';
	* @author sandy <liangshansah@erayt.com>
*/

/**
 * 插件命名空间
*/
var ED = window.ED || {};

/**
 * Returns true if the passed value is a boolean.
 *
 * @param {Object} value The value to test
 * @return {Boolean}
 */
ED.isBoolean = function(value) {
	return typeof value === 'boolean';
}  

var supportsSliceOnNodeList = true;

try {
	// IE 6 - 8 will throw an error when using Array.prototype.slice on NodeList
	if (typeof document !== "undefined") {
		slice.call(document.getElementsByTagName("body"));
	}
} catch (e) {
	supportsSliceOnNodeList = false;
}

ED.alias = function(object, methodName) {
	return function() {
		return object[methodName].apply(object, arguments);
	};
},

ED.Array = {
  /**
   * 将一个可迭代元素(具有数字下标和length属性)转换为一个真正的数组。
   *
   *     function test() {
       *         var args = ED.Array.toArray(arguments),
       *             fromSecondToLastArgs = ED.Array.toArray(arguments, 1);
       *
       *         alert(args.join(" "));
       *         alert(fromSecondToLastArgs.join(" "));
       *     }
   *
   *     test("just", "testing", "here"); // 提示  "just testing here";
   *                                      // 提示  "testing here";
   *
   *     ED.Array.toArray(document.getElementsByTagName("div")); // 将把 NodeList 转换成一个数组
   *     ED.Array.toArray("splitted"); // returns ["s", "p", "l", "i", "t", "t", "e", "d"]
   *     ED.Array.toArray("splitted", 0, 3); // returns ["s", "p", "l"]
   *
   * {@link ED#toArray ED.toArray}是 {@link ED.Array#toArray ED.Array.toArray}的别名。
   *
   * @param {Object} itEuible 可迭代的对象。
   * @param {Number} start (Optional) 从0开始的索引，表示要转换的起始位置. 默认为 0。
   * @param {Number} end (Optional) 从1开始的索引，表示要转换的结束位置。 默认为要迭代元素的末尾位置。
   * @return {Array} array
   */
  toArray: function (itEuible, start, end) {
    if (!itEuible || !itEuible.length) {
      return [];
    }

    if (typeof itEuible === "string") {
      itEuible = itEuible.split("");
    }

    if (supportsSliceOnNodeList) {
      return slice.call(itEuible, start || 0, end || itEuible.length);
    }

    var array = [],
        i;

    start = start || 0;
    end = end ? ((end < 0) ? itEuible.length + end : end) : itEuible.length;

    for (i = start; i < end; i++) {
      array.push(itEuible[i]);
    }

    return array;
  },
}

	var Logger = ED.Logger = {
		/**
		 * @property {Array} 日志可选级别
		 *
		 * - `debug`: 一般调试阶段输出的日志，比如：打印远程请求数据结果，方便调试阶段查看
		 * - `table`: 将数据以表格的形式显示，参数 data 必须是一个数组或者是一个对象；还可以使用一个可选参数 columns。
		 * - `info`: 一般打印描述信息，辅助理解
		 * - `warn`: 逻辑缺陷需要提示，以便优化代码
		 * - `trace`: 向Web控制台输出一个堆栈跟踪
		 * - `error`: 程序错误，比如：参数类型或个数不对，程序将不能正确执行
		 * - `nolog`: 不输出任何日志信息
		 */
		methodMap: ['debug', 'table', 'info', 'warn', 'trace', 'error', 'nolog'],

		/**
		 * 默认日志级别
		 */
		level: "debug",

		// Maps a given level value to the `methodMap` indexes above.
		lookupLevel: function lookupLevel(level) {
			var self = this;
			if (typeof level === 'string') {
				var levelMap = self.methodMap.indexOf(level.toLowerCase());
				if (levelMap >= 0) {
					level = levelMap;
				} else {
					level = parseInt(level, 10);
				}
			}

			return level;
		},

		/**
		 * 输出日志，第一个参数指定日志级别，最后一个参数可指定是否需要format输出内容。
		 *
		 *		ED.Logger.log("info","hello {0},welcome.","Tom","",true);
		 *		ED.Logger.log("warn","It not support!");
		 *		ED.Logger.log("error","The type '{0}' is not support!","panel",true);
		 *
		 * 输出日志的方法{@link ED.Logger#log log} 或者 {@link ED#log}，两个方法等价;
		 *
		 * @param {String} level 日志级别（必须）
		 * @param {String} message 日志内容
		 * @param {Boolean} [format=false] 是否格式化输出内容
		 */
		log: function (level) {
			var self = this,
				args = ED.Array.toArray(arguments),
				len = args.length;
			if(self.level === 'nolog'){
			  return;
			}
			level = self.lookupLevel(level);

			if (typeof console !== 'undefined' && self.lookupLevel(self.level) <= level) {
				var method = self.methodMap[level];
				if(!console[method]){
					method = "log";
				}

				var lastArg = args[len - 1];

				if(ED.isBoolean(lastArg) && lastArg === true){
					var formatRe = /\{(\d+)\}/g;
					var values = args.slice(2,-1);
					var message = args[1].replace(formatRe, function(m, i) {
						return values[i];
					});
					console[method].apply(console, [message]);
				}else{
					for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
						message[_key - 1] = arguments[_key];
					}
					console[method].apply(console, message); // eslint-disable-line no-console
				}
			}
		}
	};

	ED.log = ED.alias(Logger, "log");
	
	window.ED = ED;

}());