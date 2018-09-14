const fs = require('fs')
const conf = require('./conf')
const path = require('path');

let fileList = []
let readDir = function (path) {
  if (fs.statSync(path).isDirectory()) {
    let files = fs.readdirSync(path)
    files.forEach(item => {
      readDir(`${path}/${item}`)
    })
  } else {
    fileList.push(path)
  }
}

// 读取所有文件
if (conf.files.length > 0) {
  conf.files.forEach(item => {
    item = path.resolve(__dirname, item)
    if (fs.existsSync(item)) {
      readDir(item)
    }
  })
}

// 还原文件
fileList.forEach(file => {
  let data = fs.readFileSync(file, 'utf-8')
  while (data.indexOf('////') >= 0) {
    data = data.replace('////', '')
  }
  fs.writeFileSync(file, data)
})

fs.writeFileSync(path.resolve(__dirname, '../_theme/index.scss'), '')

console.log('项目的index.css去掉对theme.scss引入')
let indexCSCC = fs.readFileSync(`assets/css/index.scss`, 'utf-8')
indexCSCC = indexCSCC.replace("// @import './theme.scss'", "@import './theme.scss'")
fs.writeFileSync(`assets/css/index.scss`, indexCSCC)

console.log('还原主题文件成功')


