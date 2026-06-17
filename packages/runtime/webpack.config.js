const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const mode = process.env.NODE_ENV || 'production'
const isProduction = mode === 'production'
const styleLoader = isProduction ? MiniCssExtractPlugin.loader : 'style-loader'

module.exports = {
  mode,
  entry: './src/WebStart.jsx',
  output: {
    filename: 'share-query.[contenthash:6].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  devtool: 'eval-source-map',
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
      },
      {
        test: /\.css$/i,
        use: [styleLoader, 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: process.env.NODE_ENV === 'production' ? { collapseWhitespace: true } : false
    }),
    new MiniCssExtractPlugin()
  ]
}
