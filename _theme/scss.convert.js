var nodeCmd = require('node-cmd');
const conf = require('./conf');
const fs = require('fs')
let runCmdTest = (cmd) => {
  nodeCmd.get(
    cmd,
    function (err, data, stderr) {
      console.log(data);
    }
  )
}

let files = fs.readdirSync(conf.variables)
files.forEach(item => {
  let variable = './variables/light.scss'
  let path = `${conf.themePath}/theme.scss`
  let fileData = fs.readFileSync(path, 'utf-8')
  fileData = fileData.replace(variable, `./variables/${item}`)
  fs.writeFileSync(`${conf.themePath}/theme.${item}`, fileData)
  runCmdTest(`sass ${conf.themePath}/theme.${item} _theme/css/${item.replace('scss', 'css')}`)
  console.log(`主題包${item.replace('scss', 'css')}生成完毕`)
  fs.unlink(`${conf.themePath}/theme.${item}`, function () {

  })
})