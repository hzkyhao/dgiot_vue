'use strict'
// Template version: 1.2.6
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const os = require('os')

const globalConfig = require('../src/config/index')

function getIPAdress() {
  var interfaces = os.networkInterfaces();
  
  for (var devName in interfaces) {
      var iface = interfaces[devName];
      for (var i = 0; i < iface.length; i++) {
          var alias = iface[i];
          if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
              return alias.address;
          }
      }
  }
}

const ipAdress = getIPAdress();
// const projectconfig = require('../config/projectconfig')
module.exports = {
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        // target: 'http://115.159.59.185:5080/iotapi',
        // target: 'http://192.168.2.13:5080/iotapi',
        // target: 'http://ci.iotn2n.com:5080/iotapi',
        // target:'http://132.232.121.164:5080/iotapi',
        // target: 'http://192.168.2.26:5080/iotapi',
        // target: 'http://148.70.50.192:5080/iotapi',
        // target:'http://148.70.105.65:5080/iotapi',
        // target:'http://111.231.219.51:5080/iotapi',
        // target:'http://cad.iotn2n.com:5080/iotapi',
        target:globalConfig.serverURL,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    // https: true,
    // Various Dev Server settings
		//  host: ipAdress
    host: ipAdress, // can be overwritten by process.env.HOST
    port: 8338, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: false,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-source-map',

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  },

  build: {
    // Template for index.html
    // index: path.resolve(__dirname, '../'+projectconfig.outPut+'/index.html'),

    // // Paths
    // assetsRoot: path.resolve(__dirname, '../'+projectconfig.outPut),
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',

    /**
     * You can set by youself according to actual condition
     * You will need to set this if you plan to deploy your site under a sub path,
     * for example GitHub pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then assetsPublicPath should be set to "/bar/".
     * In most cases please use '/' !!!
     */
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: 'source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report || false,

    // `npm run build:prod --generate_report`
    generateAnalyzerReport: process.env.npm_config_generate_report || false
  }
}
