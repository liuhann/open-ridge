const { merge } = require('webpack-merge')
const config = require('./webpack.config.js')
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = merge(config, {
  mode: 'production',
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'build'),
    clean: true
  },
  devtool: false,
  optimization: {
    minimize: true,
    usedExports: true
  },
  plugins: [
    new BundleAnalyzerPlugin({
      statsOptions: {
        source: true, // 确保包含源代码相关信息，这样有助于分析src目录下代码模块情况
        module: true, // 包含模块信息，对于分析src里各个模块在最终打包中的情况很有帮助
        chunks: true, // 包含代码块相关信息，能体现src代码如何划分到不同的块中
        chunkModules: true // 针对代码块中的模块信息，方便知晓src里的模块归属
      }
    })
  ]
})
