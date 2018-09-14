# ne

> Nuxt.js project

## Build Setup

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm start
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).

## sass
fontsize混合宏设置响应式字体大小
pc, phone, pad, notpc混合宏分别设置不同的屏幕尺寸对应的样式

## class类
border-bottom 设置当前元素的下border，PC为1px， 移动端为0.5px
container 设置页面左右间距，统一引入改类名，方便后期修改
使用messageBox样式说明：
1.如果是alert只有一个button，设置customClass: 'alert-msgbox'
2.如果是prompt有2个Button,设置
  customClass: 'prompt-msgbox',
  confirmButtonClass: 'confirmButtonClass',
  cancelButtonClass: 'cancelButtonClass',

## 路由跳转(携带当前语言)
nuxt-link标签方式 :to="$i18n.path(path)"
点击事件  @click="$i18n.push('/test')"

## 新增
space间距变量 $space: 10px;
container类  增加最小高度属性

## mixins js混合
手机和邮箱验证方法

## 指令集
v-num 设置输入只能为数字(包括正负数及浮点数)
