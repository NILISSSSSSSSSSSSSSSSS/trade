// export const OS = function () {
//   let ua = navigator.userAgent
//   let isWindowsPhone = /(?:Windows Phone)/.test(ua)
//   let isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone
//   let isAndroid = /(?:Android)/.test(ua)
//   let isFireFox = /(?:Firefox)/.test(ua)
//   let isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua))
//   let isPhone = /(?:iPhone)/.test(ua) && !isTablet
//   let isPc = !isPhone && !isAndroid && !isSymbian
//   return {
//     isPad: isTablet,
//     isPhone: isPhone,
//     isPc: isPc
//   }
// }
import Vue from 'vue'
class OS {
  constructor () {
    let ua = window.navigator.userAgent
    let isWindowsPhone = /(?:Windows Phone)/.test(ua)
    let isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone
    let isAndroid = /(?:Android)/.test(ua)
    let isFireFox = /(?:Firefox)/.test(ua)
    let isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua))
    let isPhone = /(?:iPhone)/.test(ua) && !isTablet
    let isPc = !isPhone && !isAndroid && !isSymbian
    this.isPad = isTablet
    this.isPhone = isPhone
    this.isPc = isPc
  }
}
Vue.prototype.os = new OS()
