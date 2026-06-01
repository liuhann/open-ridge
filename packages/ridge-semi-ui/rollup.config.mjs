import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import postcss from 'rollup-plugin-postcss'
import replace from '@rollup/plugin-replace'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

export default {
  input: 'src/index.js',

  output: {
    file: 'dist/ridge-semi-ui.min.js',
    format: 'umd',
    name: 'RidgeSemiUI',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM'
    }
  },

  plugins: [
    // 🔥 关键：替换 process.env.NODE_ENV
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true
    }),

    resolve({
      extensions: ['.js', '.jsx'],
      browser: true
    }),

    commonjs(),

    postcss({
      extract: 'ridge-semi-ui.css',
      inject: false,
      minimize: true,
      plugins: [autoprefixer(), cssnano()]
    }),

    babel({
      presets: ['@babel/preset-react'],
      babelHelpers: 'bundled',
      exclude: /node_modules/
    }),

    terser()
  ],

  external: ['react', 'react-dom']
}
