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
    console.log(item)
    if (fs.existsSync(item)) {
      readDir(item)
    }
  })
}

// 判断是否是主题样式
let isThemeLine = function (line) {
  let isTheme = false
  conf.theme.forEach(item => {
    if (line.includes(item) && line.trim() !== '') {
      isTheme = true
    }
  })
  return isTheme
}

let getVueStyle = function (vue) {
  scopeStart = vue.indexOf('<style lang="scss" scoped>') // vue.replace('<style lang="scss" scoped>', '<style>')
  start = vue.indexOf('<style lang="scss">')
  scopeEnd = vue.indexOf('</style>')
  end = vue.lastIndexOf('</style>')
  const result = (vue.substr(scopeStart, scopeEnd - scopeStart) + (start >= 0 ? vue.substr(start, end - start) : ''))
    .replace('<style lang="scss" scoped>', '')
    .replace('<style lang="scss">', '')
    .replace('</style>', '')
    .replace('</style>', '')
  return result
}

let cssList = []
if (fileList) {
  fileList.forEach(file => {
    let fileData = fs.readFileSync(file, 'utf-8')
    let styleData = fileData
    if (!file.endsWith('.scss')) {
      styleData = getVueStyle(fileData)
    }
    let lines = styleData.split('\r\n')
    let fileLines = fileData.split('\r\n')
    for (let index = 0; index < lines.length; index++) {
      let item = lines[index]
      if (!item.includes('//')) {
        if (isThemeLine(item) | item.includes('{') || item.includes('}')) {
          cssList.push(item.replace('/deep/', ''))
        }
        if (isThemeLine(item)) {
          // 注解代码
          for (let index = 0; index < fileLines.length; index++) {
            if (fileLines[index] === item) {
              fileLines[index] = `////${item}`
            }
          }
        }
      }
    }
    fs.writeFileSync(file, fileLines.join('\r\n'))
  })
}

cssList = cssList.filter(x => x.trim() !== '')
let i = 0;
while (i < 10) {
  for (let index = 0; index < cssList.length - 1; index++) {
    if (cssList[index].trim().endsWith('{') && cssList[index + 1].trim().startsWith('}')) {
      cssList[index] = ''
      cssList[index + 1] = ''
    }
  }
  cssList = cssList.filter(x => x.trim() !== '')
  i++;
}

console.log('变量引用分离成功')
fs.writeFileSync(path.resolve(__dirname, '../_theme/index.scss'), cssList.join('\r\n'))

console.log('项目的index.css去掉对theme.scss引入')
let indexCSCC = fs.readFileSync(`assets/css/index.scss`, 'utf-8')
indexCSCC = indexCSCC.replace("@import './theme.scss'", "// @import './theme.scss'")
fs.writeFileSync(`assets/css/index.scss`, indexCSCC)
