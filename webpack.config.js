const path = require('path')
const webpack = require('webpack')
const ElectronPackager = require("webpack-electron-packager");

module.exports = {
  entry: './app/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js'
  },
    resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'vue$': 'vue/dist/vue',
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
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
        }
    ]
  },
  babel: {
    "presets": ["es2015", "stage-2"],
    "plugins": ["transform-runtime"]
  },
  plugins: [
    new webpack.ExternalsPlugin('commonjs', [
        'electron'
    ])
  ]
}

// ,
//     new ElectronPackager({
//           dir: ".",
//           arch: "x64",
//           platform: "darwin",
//         })