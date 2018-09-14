
export default function (context) {
  let ua = process.server ? context.req.headers['user-agent'] : navigator.userAgent
  let isWindowsPhone = /(?:Windows Phone)/.test(ua)
  let isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone
  let isAndroid = /(?:Android)/.test(ua)
  let isFireFox = /(?:Firefox)/.test(ua)
  let isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua))
  let isPhone = /(?:iPhone)/.test(ua) && !isTablet
  let isPc = !isPhone && !isAndroid && !isSymbian
  context.os = {
    pad: isTablet,
    phone: isPhone,
    pc: isPc
  }
}
