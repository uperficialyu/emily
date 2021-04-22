module.exports = {
  // "extends": "airbnb",
  "rules": {
    //换行符校验关闭
    "linebreak-style": "off",
    //文件总共行数不能超过1000行
    "max-lines": ["error", 1000],
    //参数个数不超过3个
    "max-params": ["error", 3],
    // 不允许使用 eval
    "no-eval": "error",
    //不要使用with语句
    "no-with": "error",
    //这就是分号党和非分号党关心的了，我们还是选择加分号
    "semi": ["error", "always"],
    //禁止扩展原生对象
    "no-extend-native": "error",
    //使用=== !== 代替== !=
    "eqeqeq": ["error", "allow-null"],
    //禁止使用new Array()，来定义数组
    "no-array-constructor": "error",
    //不要通过new Object()，来定义对象
    "no-new-object": "error",
    //不要使用逗号操作符，详见官网
    "no-sequences": "error",
    //函数调用时，圆括号前面不能有空格
    "no-spaced-func": "error",
    //操作符前后需要加空格
    "space-infix-ops": "error",
    //禁止把undefined赋值给一个变量
    "no-undef-init": "error",
    //允许使用单引号、反引号
    "quotes": ["error", "single", { "allowTemplateLiterals": true }],
    //禁止混用tab、空格缩进
    "no-mixed-spaces-and-tabs": "error",
    //变量定义
    "no-shadow": "off",
    //关闭console校验
    "no-console": "off",
    //剪头函数返回return
    "array-callback-return": "error",
    //在使用typeof操作符时，作比较的字符串必须是合法字符串eg:'string' 'object'
    "valid-typeof": "error",
    "comma-dangle": "off",
    "radix": "off",
    "no-plusplus": "off",
    "no-restricted-syntax": "off"

  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "experimentalDecorators": true,
      "experimentalObjectRestSpread": true
    }
  },
  "globals": {
      "$": true,
      "window": true,
      "document": true,
      "doSign": true,
      "getPubKey": true
  },
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "parser": "babel-eslint",
  "plugins": [
    "react"
  ],
  "settings": {
    "import/resolver": {
      webpack: {
        config: './scripts/webpack.dev.config.js'
      }
    }
  }
};
