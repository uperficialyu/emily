# React项目指南

## 项目命令
```
"install": "npm run build-dll",
"start": "webpack-dev-server --config scripts/webpack.dev.config.js",
"build": "webpack --config scripts/webpack.prod.config.js",
"build-dll": "webpack -p --progress --config scripts/webpack.dll.config.js"
````
执行 `npm install` 时会在依赖安装完成后自动执行 `npm run build-dll` 命令，打包webpack.dll.config.js中配置的依赖模块。
若lib_dll加载报错，可重新执行 `npm run build-dll` 重新生成资源。

## 文件目录

    |-app
    |-|-common            =>公用方法、错误码集合
    |-|-components        =>公用组件
    |-|-lib               =>公共插件/库
    |-|-medias            =>媒体资源
    |-|-pages             =>页面目录
    |-|-router            =>路由
    |-|-style             =>基础样式
    |---|-font            =>图标&字体文件
    |---|-base            =>基础样式
    |-|-app.jsx           =>dom注入页面
    |-|-app.scss          =>公共样式
    |-|-config.js         =>配置文件
    |-|-Main.jsx          =>主入口
    |-|-template.html     =>生成html模板
    |-node_modules        =>项目依赖库
    |-script              =>webpack脚本
    |-package.json        =>依赖库及版本集
    |-postcss.config.js   =>样式兼容版本

## 官方文档地址

[react](https://reactjs.org/)
[react中文](https://react.docschina.org/)

[react-router](https://www.jianshu.com/p/191d1e21f7ed)

## Change Log
- 新增统一日志输出功能插件 by sandyliang
