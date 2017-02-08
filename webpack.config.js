const path = require('path')
const webpack = require('webpack')
const ElectronPackager = require('webpack-electron-packager')

module.exports = {
  entry: './app/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js',
    publicPath: './dist'
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'vue$': 'vue/dist/vue',
      'src': path.resolve(__dirname, '../src'),
      'components': path.resolve(__dirname, '../src/components')
    }
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.(jpe?g|gif|png)$/,
        loader: 'file-loader?name=/public/images/[name].[ext]'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file?name=/public/fonts/[name].[ext]'
      }
    ]
  },
  babel: {
    'presets': ['es2015', 'stage-2'],
    'plugins': ['transform-runtime']
  },
  plugins: [
    new ElectronPackager({
      dir: '.',
      arch: 'x64',
      platform: 'darwin'
    }),
    new webpack.ExternalsPlugin('commonjs', [
      'electron'
    ]),
    new webpack.HotModuleReplacementPlugin()
  ]
}

