import { RealTimeAPI } from 'rocket.chat.realtime.api.rxjs'
export default {
  chat_api: null,
  init_chatApi: function (socketUrl) {
    this.chat_api = new RealTimeAPI(socketUrl)
  }
}