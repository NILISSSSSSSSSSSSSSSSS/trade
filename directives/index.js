import Vue from 'vue'
Vue.directive('focus', {
  binding: function (el, option) {
    let defClass = 'el-input'
    let defTag = 'input'
    let value = option.value
    if (typeof value === 'boolean') {
      value = { cls: defClass, tag: defTag, foc: value }
    } else {
      value = { cls: value.cls || defClass, tag: value.tag || defTag, foc: value.foc || false }
    }
    if (el.classList.contains(value.cls) && value.foc) {
      el.getElementsByTagName(value.tag)[0].focus()
    }
  }
  })

  Vue.directive('num', {
    bind: function (el, option) {
      let _this = Vue.prototype
      let defTag = el.getElementsByTagName('input')[0]
      var lastValue
      defTag.addEventListener('keyup', function(e) {
        let value = e.target.value
        let reg = /^-?[0-9]+\.?[0-9]*$/
        //  退格不做处理
        if (e.keyCode === 8) {
          lastValue = value
          return
        }
        //  如果首位是负号，且仅出现一次，不走验证
        if (e.keyCode === 189 && value.indexOf('-') === 0 && value.split('-').length <= 2) {
          lastValue = value
          return
        }
        //  等待下次渲染时候改变输入框的值
        _this.$nextTick(() => {
          if (!reg.test(value)) {
            e.target.value = lastValue
          } else {
            lastValue = value
          }
        })
      })
      defTag.addEventListener('blur', function(e) {
        let value = e.target.value
        _this.$nextTick(() => {
          e.target.value = Number(value).toString()
          defTag.dispatchEvent(new Event('input'))
        })
      })
    }
  })

  //  正浮点数
  Vue.directive('posNum', {
    bind: function (el, option) {
      let _this = Vue.prototype
      let defTag = el.getElementsByTagName('input')[0]
      var lastValue
      defTag.addEventListener('keyup', function(e) {
        // debugger
        let value = e.target.value
        let reg = /^[0-9]+\.?[0-9]*$/
        //  退格不做处理
        if (e.keyCode === 8) {
          lastValue = value
          return
        }
        //  等待下次渲染时候改变输入框的值
        _this.$nextTick(() => {
          if (!reg.test(value)) {
            e.target.value = lastValue
            defTag.dispatchEvent(new Event('input'))
          } else {
            lastValue = value
          }
        })
      })
      defTag.addEventListener('blur', function(e) {
        let value = e.target.value
        _this.$nextTick(() => {
          e.target.value = Number(value).toString()
          defTag.dispatchEvent(new Event('input'))
        })
      })
    }
  })

  //  正整数
  Vue.directive('posInt', {
    bind: function (el, option) {
      let _this = Vue.prototype
      let defTag = el.getElementsByTagName('input')[0]
      var lastValue
      defTag.addEventListener('keyup', function(e) {
        // debugger
        let value = e.target.value
        let reg = /^[0-9]?[0-9]*$/
        //  退格不做处理
        if (e.keyCode === 8) {
          lastValue = value
          return
        }
        //  等待下次渲染时候改变输入框的值
        _this.$nextTick(() => {
          if (!reg.test(value)) {
            e.target.value = lastValue
            defTag.dispatchEvent(new Event('input'))
          } else {
            lastValue = value
          }
        })
      })
    }
  })
