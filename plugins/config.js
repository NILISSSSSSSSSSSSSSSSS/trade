const server = {
  development: "http://api.dev.com", // http://192.168.0.186:6012
  test: "http://api.test.net",
  out: "http://git-chainexcloud.tpddns.cn:8001",
  production: ""
}
const socket = {
  development: "ws://192.168.0.224:3000",
  test: "ws://192.168.0.224:3000",
  out: "http://git-chainexcloud.tpddns.cn:8002",
  production: ""
}
console.log("env=============>", process.env.__ENV)
const __env = process.env.__ENV
export const url = process.env.url || server[__env]

export const imgHost = "http://"

export const legalUrl = url

export const socketUrl = process.env.socketUrl || socket[__env]

export const chatSocketUrl = "ws://192.168.0.207:3000/sockjs/websocket"
export const chatRoomID = "32My8YidDrdrfbKHG" // 群聊房间号

export const supportLang = [
  { symbol: "en-US", displayText: "English", fiatCurrency: "USD" },
  { symbol: "zh-CN", displayText: "简体中文", fiatCurrency: "CNY" }
]

export const supportLangArr = ["en-US", "zh-CN"]
