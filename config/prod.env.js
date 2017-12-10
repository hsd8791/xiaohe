process.env.COMPANY_NAME='xh2' //dev 的时候在此修改使用哪个文件夹的图片
var merge = require('webpack-merge')

var imgObj=require('../build/pic.js')

var jsonedImgObj={}
for(key in imgObj){
  jsonedImgObj[key]=JSON.stringify(imgObj[key])
}
console.log('jsonedImgObj'.jsonedImgObj)
console.log('imgObj',imgObj,JSON.stringify(imgObj))
module.exports = merge(jsonedImgObj,{
  NODE_ENV: '"production"',
  // PIC_SRC:JSON.stringify(imgObj),
  BANNER:'"../assets/xh2/banner.png"',
  // test:'{"x":1}',
  // PIC_SRC:JSON.stringify(imgObj),
})
// module.exports = {
//   NODE_ENV: '"production"',
//   // PIC_SRC:JSON.stringify(imgObj),
//   BANNER:'"../assets/xh2/banner.png"',
//   // test:'{"x":1}',
//   // PIC_SRC:JSON.stringify(imgObj),
//   PIC_SRC:jsonedImgObj,
// }
