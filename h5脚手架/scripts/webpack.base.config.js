const path = require('path');
const webpack = require('webpack');
const Happypack = require('happypack');

const fs = require('fs');
const os = require('os');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
// 启用最大核心共享线程进行打包，TODO: 注意低配电脑打包会有问题，如有问题，将happyThreadPool移出再试
const happyThreadPool = Happypack.ThreadPool({ size: os.cpus().length });
const isDev = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development';

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath);
}

const plugins = [
  new Happypack({
    id: 'jsx',
    threads: 4, // 代表开启几个子进程去处理这一类型的文件,默认3
    // 代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多。
    // 注意：低配置电脑打包的代码，可能会存在问题，之前招商银行PC端遇到过，慎用
    threadPool: happyThreadPool,
    verbose: true, // 此项配置会影响打包速度,默认为true
    loaders: [{
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-react', '@babel/preset-env'],
        plugins: [
          '@babel/plugin-syntax-dynamic-import',
          ['@babel/plugin-proposal-decorators', { 'legacy': true }],
          'transform-class-properties',
        ],
        cacheDirectory: true,
      },
      // exclude: /node_modules/,
      include: resolve('app'),
    }],
  }),
  new MiniCssExtractPlugin({
    filename: 'app.min.css',
  }),
  new Happypack({
    id: 'scss',
    threads: 4,
    threadPool: happyThreadPool,
    verbose: false,
    loaders: [{
      loader: 'css-loader',
    },
    {
      loader: 'postcss-loader'
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
        publicPath: '../',
        includePaths: [
          path.resolve(__dirname, '../app/style/base'),
        ],
      },
    }],
  }),
  new Happypack({
    id: 'css',
    threads: 4,
    threadPool: happyThreadPool,
    verbose: false,
    loaders: [{
      loader: 'css-loader',
    }, {
      loader: 'postcss-loader',
      options: [{
        publicPath: '../',
      }],
    }],
  }),
  // new CleanWebpackPlugin({}),
  // 将打包后的资源注入到html文件内
  new HtmlWebpackPlugin({
    template: resolve('../app/template.html'),
    // 影响打包速度
    // minify:{
    //   removeRedundantAttributes:true, // 删除多余的属性
    //   collapseWhitespace:true, // 折叠空白区域
    //   removeAttributeQuotes: true, // 移除属性的引号
    //   removeComments: true, // 移除注释
    //   collapseBooleanAttributes: true // 省略只有 boolean 值的属性值 例如：readonly checked
    // },
  }),
  new ProgressBarPlugin(),
  // 影响打包速度，不用
  // new SpeedMeasurePlugin()
];
// 自动将dll注入到html
const files = fs.readdirSync(path.resolve(__dirname, '../app/dll'));
files.forEach(file => {
  if (/.*\_dll.js/.test(file)) {
    plugins.push(new AddAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, `../app/dll/${file}`)
    }))
  }
  if (/.*\_manifest.json/.test(file)) {
    plugins.push(new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: path.resolve(__dirname, `../app/dll/${file}`)
    }))
  }
})

const webpackConfigBase = {
  entry: {
    app: ['@babel/polyfill', resolve('../app/app.jsx')],
  },
  output: {
    path: resolve('../dist'),
    filename: 'common.bundle.js',
    chunkFilename: 'chunks/[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss'],
    alias: {
      'components': path.join(__dirname, '/../app/components'),
      'config$': path.join(__dirname, '/../app/config'),
      'pages': path.join(__dirname, '/../app/pages'),
      'store': path.join(__dirname, '/../app/store'),
      'lib': path.join(__dirname, '/../app/lib'),
      'style': path.join(__dirname, '/../app/style'),
      'storage': path.join(__dirname, '/../app/lib/storage'),
      'common': path.join(__dirname, '/../app/common'),
      'media': path.join(__dirname, '/../app/media'),
      'locate': path.join(__dirname, '/../app/locate'),
    },
  },
  resolveLoader: {
    moduleExtensions: ['-loader'],
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: function (pathd) {
          return /node_modules/.test(pathd) && !/@erayt/.test(pathd)
        },
        use: 'happypack/loader?id=jsx',
      },
      {
        test: /\.scss$/,
        loader: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'happypack/loader?id=scss',
        ],
      },
      {
        test: /\.css$/,
        loader: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'happypack/loader?id=css',
        ],
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url',
        options: {
          limit: 8192,
          name: 'img/[name].[ext]',
        },
      },
      {
        test: /iconfont.(woff|eot|ttf|svg|gif)$/,
        loader: 'file-loader?name=[name].[ext]',
      },
    ],
  },
  plugins,
  // 代码分割会影响打包速度，如项目需要在加
  optimization: {
    usedExports: true,
  }
};

module.exports = webpackConfigBase;
