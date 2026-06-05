const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ridge-antd.min.js',
    library: {
      name: 'RidgeAntd',
      type: 'umd'
    },
    globalObject: 'this',
    clean: true
  },

  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },

  module: {
    rules: [
      // JSX 编译
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules[\\/](?!(antd|rc-|@ant-design))/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },

      // CSS
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },

      // LESS（antd 必须）
      {
        test: /\.less$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ]
      }
    ]
  },

  optimization: {
    minimizer: [new TerserPlugin()]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'ridge-antd.css' // 🔥 一定会生成这个独立 CSS 文件
    })
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.less', '.css']
  }
}
