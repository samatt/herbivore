'use strict'

let config = {
  // Use ESLint (extends `standard`)
  // Further changes can be made in `.eslintrc.js`
  eslint: true,

  // webpack-dev-server port
  port: 9080,
  dev: {
    cssSourceMap: false
  },
  build: {
    productionSourceMap: true
  }
}

module.exports = config
