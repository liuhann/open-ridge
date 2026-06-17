const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/WebStart.jsx',
  output: {
    filename: 'share-query.[contenthash:6].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  devServer: {
    static: {
      directory: path.join(__dirname, '../../public')
    },
    proxy: [
      {
        context: ['/api', '/static'],
        target: 'http://localhost'
      }
    ],
    hot: true,
    compress: true,
    port: 9001
  },
  mode: process.env.NODE_ENV || 'production',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  // 外部依赖，不打包进产物，通过CDN引入
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-react', { runtime: 'classic' }]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: process.env.NODE_ENV === 'production' ? { collapseWhitespace: true } : false
    })
  ]
}
