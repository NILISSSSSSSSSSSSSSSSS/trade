import rcApi from "@/plugins/rocket.chat"
import { chatSocketUrl, chatRoomID } from "@/plugins/config"
import { getGroupHistoryList } from "@/apis/rocket.chat"
let chatApi = null
const pageSize = 5
let gotoBottom = () => {
  setTimeout(() => {
    let msgPanel = document.getElementById("group_chat_message")
    if (msgPanel) {
      msgPanel.scrollTo(0, 100000)
    }
  }, 100)
}

export const state = () => ({
  historyMessages: [], // 历史聊天记录
  isHaveHistory: false,
  isAutoToBottom: true,
  messages: [], // 聊天记录列表
  newMsgCount: 0, // 是否有新的信息
  openChat: false, // 是否开启聊天窗口
  showBigPic: false,
  bigPicUrl: "",
  connect_room: false, // 是否已经进入房间
  chat_errors: []
})

export const mutations = {
  OPEN_CHAT(state, isOpen) {
    state.openChat = isOpen
    if (isOpen) {
      state.newMsgCount = 0
    }
  },
  SHOW_BIG_PIC(state, url) {
    state.bigPicUrl = url
    state.showBigPic = true
  },
  HIDE_BIG_PIC(state) {
    state.showBigPic = false
  },
  CLEAR_NEWMSGCOUNT(state) {
    state.newMsgCount = 0
  },
  ADD_HISTORY_MESSAGES(state, msgList) {
    msgList.forEach(item => {
      if (state.historyMessages.indexOf(h => h.id === item.id) < 0) {
        state.historyMessages.unshift(item)
      }
    })
    state.isHaveHistory = msgList.length >= pageSize
  },
  ADD_MESSAGE(state, msg) {
    state.messages.push(msg)
    if (!state.isAutoToBottom || !state.openChat) {
      state.newMsgCount = state.newMsgCount + 1
    } else {
      gotoBottom()
    }
  },
  ADD_CHAT_ERROR(state, error) {
    state.chat_errors.push(error)
  },
  EXIT_CHAT(state) {
    state.connect_room = false
  },
  CONNECT_CHAT(state) {
    state.connect_room = true
  },
  CLEAR_MESSAGE(state) {
    state.messages = []
    state.historyMessages = []
  },
  SET_AUTO_TO_BOTTOM(state, isBottom) {
    state.isAutoToBottom = isBottom
  },
  RESET_CHAT(state) {
    /**
     *
     *  historyMessages: [], // 历史聊天记录
  isHaveHistory: false,
  isAutoToBottom: true,
  messages: [], // 聊天记录列表
  newMsgCount: 0, // 是否有新的信息
  openChat: false, // 是否开启聊天窗口
  showBigPic: false,
  bigPicUrl: "",
  connect_room: false, // 是否已经进入房间
  chat_errors: []
     *
     */
    state.historyMessages = []
    state.isHaveHistory = false
    state.isAutoToBottom = true
    state.messages = []
    state.newMsgCount = 0
    state.openChat = false
    state.showBigPic = false
    state.bigPicUrl = ""
    state.connect_room = false
    state.chat_errors = []
    if (chatApi) {
      chatApi.webSocket.complete()
    }
  }
}

export const actions = {
  // 通知聊天窗口开关
  OPEN_CHAT({ commit, dispatch, state }, isOpen) {
    if (isOpen && !state.connect_room) {
      dispatch("CONNECT_CHAT")
    }
    commit("OPEN_CHAT", isOpen)
    setTimeout(() => {
      gotoBottom()
    }, 1000)
  },
  CONNECT_CHAT({ commit, dispatch }) {
    chatApi = rcApi.connectToRocketChat(chatSocketUrl)
    chatApi.onError(error => this.chat_errors.push(error))
    chatApi.onCompletion(() => {
      console.log("已退出群聊")
      commit("EXIT_CHAT")
    })
    chatApi.onMessage(message => {
      if (message.collection === "stream-room-messages") {
        if (message.fields && message.fields.args) {
          let msg = message.fields.args[0]
          commit("ADD_MESSAGE", {
            msg: msg.image_url ? `<img src="${msg.image_url}">` : msg.msg,
            updateTime: msg._updatedAt,
            username: msg.u.username,
            collection: "stream-room-messages",
            id: msg._id
          })
        }
      }
    })
    chatApi.connectToServer().subscribe(
      () => {
        chatApi.keepAlive()
        // 登录聊天室服务
        chatApi.login("frank@qq.com", "123").subscribe(
          apiEvent => {
            if (apiEvent.msg === "result") {
              window.$chat_loginInfo = apiEvent.result
              // 加入房间
              chatApi.sendMessage({
                msg: "sub",
                id: "" + new Date().getTime(),
                name: "stream-room-messages",
                params: [chatRoomID, false]
              })
              dispatch("LOAD_HISTORY", true)
              commit("CONNECT_CHAT")
            }
          },
          error => {
            state.errors.push(error)
          }
        )
      },
      error => {
        commit("ADD_CHAT_ERROR", error)
      }
    )
  },
  EXIT_CHAT({ commit }) {
    chatApi.webSocket.complete()
  },
  LOAD_HISTORY({ state, commit }, bottom) {
    let date = null
    if (state.historyMessages.length > 0) {
      date = new Date(state.historyMessages[0].updateTime)
    }
    getGroupHistoryList({
      roomId: chatRoomID,
      latest: date,
      count: pageSize
    }).then(res => {
      if (res.success) {
        commit(
          "ADD_HISTORY_MESSAGES",
          res.messages.map(item => {
            return {
              msg: item.image_url ? `<img src="${item.image_url}">` : item.msg,
              updateTime: item._updatedAt,
              username: item.u.username,
              collection: "stream-room-messages",
              id: item._id
            }
          })
        )
        if (bottom) {
          gotoBottom()
        }
      }
    })
  }
}
