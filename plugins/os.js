import Vue from "vue";

let os = function () {
  let ua = window.navigator.userAgent
  let isWindowsPhone = /(?:Windows Phone)/.test(ua)
  let isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone
  let isAndroid = /(?:Android)/.test(ua)
  let isFireFox = /(?:Firefox)/.test(ua)
  let isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua))
  let isPhone = /(?:iPhone)/.test(ua) && !isTablet
  let isPc = !isPhone && !isAndroid && !isSymbian
  return {
    pad: isTablet,
    phone: isPhone,
    pc: isPc
  }
}

Vue.prototype.os = os()
