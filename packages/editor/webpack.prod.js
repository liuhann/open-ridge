const { merge } = require('webpack-merge')
const config = require('./webpack.config.js')

module.exports = merge(config, {
  mode: 'production',
  devtool: false,
  optimization: {
    minimize: true,
    usedExports: true
    // splitChunks: {
    //   chunks: 'all',
    //   name: 'vendor'
    // }
  },
  output: {
    filename: '[name].[chunkhash].production.js'
  }
})
