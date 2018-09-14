import socket from "@/plugins/socket"
export default function({ store, route }) {
  if (process.client) {
    // 取出页面上单独已订阅的socket,页面切换的时候取消订阅
    let globalSubscribles = ["SUBSCRIBLE_MY_LEGAL_ORDER", "USER_ON_OFF_LINE"]

    let pageWS = socket.sub_keys.filter(
      key => globalSubscribles.indexOf(key) < 0
    )
    if (pageWS) {
      socket.unsubscribes(pageWS)
    }

    // rocket订阅操作
    if (!route.path.startsWith("/coin_coin")) {
      store.commit("group_chat/RESET_CHAT")
    }
    if (!route.path.startsWith("/c2c-trade")) {
      store.commit("c2c_chat/RESET_CHAT")
    }
  }
}
