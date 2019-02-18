var fs = require('fs'),
  path = require('path');
var filePath = path.resolve(__dirname + '/../src/version.js')
//readFile(filename,[options],callback);

/**
 * filename, 必选参数，文件名
 * [options],可选参数，可指定flag（文件操作选项，如r+ 读写；w+ 读写，文件不存在则创建）及encoding属性
 * callback 读取文件后的回调函数，参数默认第一个err,第二个data 数据
 */
function versionUpdatedContent(fileContent) {
  var start = fileContent.indexOf("=")
  var end = fileContent.indexOf(";")
  var num = fileContent.substring(start + 1, end)
  num++
  console.log('current version:',num)
  return `const version=${num};export default "v1.0."+version;`
}

function readContent() {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { flag: 'r+', encoding: 'utf8' }, function(err, data) {
      if (err) {
        reject(err)
      } else {
        console.log(data);
        resolve(data)
      }
    });
  })
}

function overWriteFile(content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, { flag: 'w' }, function(err) {
      if (err) {
        reject(err);
      } else {
        console.log('写入成功');
        resolve()
      }
    });
  })
}
readContent()
.then(versionUpdatedContent)
.then(overWriteFile)
.catch((error) => {
  console.error("error", error)
})
