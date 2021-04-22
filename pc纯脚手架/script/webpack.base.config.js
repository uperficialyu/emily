const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default;
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
// 处理 ES3 低版本浏览器兼容问题（保留字属性报缺少标识符等）
//var es3ifyPlugin = require('es3ify-webpack-plugin');

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath);
}

const webpackConfigBase = {
  entry: {
    app: ['@babel/polyfill', resolve('../app/app.jsx')],
    vendors: ['react', 'react-dom'],
  },
  output: {
    path: resolve('../dist'),
    filename: '[name].[hash:4].js',
  },
  resolve: {
    modules: [
      resolve('../app'),
      resolve('../node_modules')
    ],
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      constants: path.join(__dirname, '/../app/constants/constants'),
      ajax: path.join(__dirname, '/../app/ajax/ajax'),
      components: path.join(__dirname, '/../app/components'),
      config: path.join(__dirname, '/../app/config'),
      pages: path.join(__dirname, '/../app/pages'),
      plugins: path.join(__dirname, '/../app/plugins'),
      style: path.join(__dirname, '/../app/style'),
      default: path.join(__dirname, '/../app/style/default.scss'),
      storage: path.join(__dirname, '/../app/storage/storage'),
      utils: path.join(__dirname, '/../app/utils'),
      store: path.join(__dirname, '/../app/store'),
      publicFunComponents: path.join(__dirname, '/../app/pages/PublicFunComponents')
    },
    // 是否将符号链接解析到它们的符号链接位置
    symlinks: false,
  },
  resolveLoader: {
    moduleExtensions: ['-loader'],
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        use: 'happypack/loader?id=jsx'
      },
      {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader' // 将 JS 字符串生成为 style 节点
        }, {
          loader: 'css-loader' // 将 CSS 转化成 CommonJS 模块
        }, {
          loader: 'sass-loader' // 将 Sass 编译成 CSS
        }]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader"
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader' // 将 JS 字符串生成为 style 节点
          }, {
            loader: 'css-loader' // 将 CSS 转化成 CommonJS 模块
          },
          {
            loader: 'less-loader' // compiles Less to CSS
          }
        ]

      },
      {
        test: /\.(woff|eot|ttf|png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        options: {
          limit: 8192,
          name: 'img/[name].[hash:4].[ext]'
        }
      },
      {
        test: /\.bundle\.js$/,
        use: 'bundle-loader'
      },
      {
        test: /(eraytfonts|firmfont|iconfont|eui).(woff|eot|ttf|svg|gif)$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      // 招商银行网银客户端特有的安全签名方法fbkeyutil.js 为非模块包，故使用export加载，用户需要安装npm i exports-loader --save
      {
        test: require.resolve('../app/plugins/fbkeyutil.js'),
        loader: "exports?getPubKey,doSign,buildXmlPack"
      }
    ],
  },
  plugins: [
    // 将打包后的资源注入到html文件内
    new HtmlWebpackPlugin({
      template: resolve('../app/template.html'),
      title: 'Caching'
    }),

    new CopyWebpackPlugin([{
      from: resolve('../app/polyfill.js'),
      to: resolve('../dist/polyfill.js'),
    }]),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new HappyPack({
      id: 'jsx',
      threads: 1,
      // threadPool: happyThreadPool,
      loaders: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react', '@babel/preset-env'],
          plugins: ['@babel/plugin-syntax-dynamic-import', ['@babel/plugin-proposal-decorators', { 'legacy': true }], 'transform-class-properties'],
          cacheDirectory: true
        },
        include: path.join(__dirname, 'app')
      }],
    }),
    new CSSSplitWebpackPlugin({
      size: 4000,
      filename: 'static/css/[name]-[part].[ext]'
    }),
    //  new es3ifyPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5, // The default limit is too small to showcase the effect
          minSize: 0 // This is example is too small to create commons chunks
        }
      }
    }
  }
};

module.exports = webpackConfigBase;
