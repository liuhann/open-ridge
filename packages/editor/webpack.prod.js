const { merge } = require('webpack-merge')
const config = require('./webpack.config.js')

module.exports = merge(config, {
  mode: 'production',
  devtool: false,
  optimization: {
    minimize: true,
    usedExports: true,
    // concatenateModules: false, // 关闭作用域提升，取消concat合并
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
      // 把通用组件/公共代码拆分独立chunk
        common: {
          name: 'common',
          minChunks: 2, // 被>=2处引入就抽离
          chunks: 'all'
        }
      }
    }
    // splitChunks: {
    //   chunks: 'all',
    //   name: 'vendor'
    // }
  },
  output: {
    filename: '[name].[chunkhash].production.js'
  }
})
