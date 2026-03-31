const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
const pkg = require('./package.json')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// 👇 必须引入这个
const TerserPlugin = require('terser-webpack-plugin')

const copyFiles = pkg.files || []

console.log('copyFiles', copyFiles)
module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map', // 正确
  plugins: [
    // new BundleAnalyzerPlugin(),
    new CopyPlugin({
      patterns: copyFiles.map((item) => ({
        from: path.resolve(__dirname, item),
        to: path.resolve(__dirname, '../../public/npm/ridge-container/', item)
      }))
    })
  ],
  // 👇 这里是修复核心
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          sourceMap: true, // 显式启用source map
          compress: {
            drop_console: false // 可选项：是否删除console.log
            // 其他压缩选项...
          }
        }
      })
    ]
  }
})
