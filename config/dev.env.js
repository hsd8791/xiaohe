var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
// process.env.COMPANY_NAME='xh'
// var imgBanner=require('../src/assets/xh2/banner.png')
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BANNER:'"../assets/xh2/banner.png"',
  // BANNER_Required:'imgBanner',
})
