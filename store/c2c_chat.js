/****
 * 一对一用户聊天
 * user:{
 *   username:'',
 *   orderId:'',
 *   active:'',
 *   messages:[],
 *   newMsgCount:0,
 *   systemNotice:null
 * }
 */
import rcApi from "@/plugins/rocket.chat"
import { chatSocketUrl } from "@/plugins/config"
import {
  getGroupList,
  getGroupHistoryList,
  sendMessage
} from "@/apis/rocket.chat"
let chatApi = null
let gotoBottom = () => {
  setTimeout(() => {
    let msgPanel = document.getElementById("c2c_chat_message")
    if (msgPanel) {
      msgPanel.scrollTo(0, 100000)
    }
  }, 100)
}

export const state = () => ({
  chatUsers: [],
  openChat: false,
  connected: false,
  loginInfo: {},
  chat_errors: []
})

export const mutations = {
  // 打开聊天室
  OPEN_CHAT(state, { orderId, username, roomID }) {
    if (orderId) {
      state.chatUsers.map(item => {
        item.active = false
      })
      let curUser = state.chatUsers.find(x => x.orderId === orderId)
      if (curUser) {
        curUser.active = true
      } else {
        state.chatUsers.push({
          active: true,
          messages: [],
          orderId: orderId,
          username: username,
          newMsgCount: 0,
          roomID: roomID,
          systemNotice: null
        })
      }
    }
    state.openChat = true
  },
  // 关闭聊天室
  CLOSE_CHAT(state) {
    state.openChat = false
  },
  // 删除聊天用户
  REMOVE_USER(state, user) {
    let removeIndex = 0
    if (state.chatUsers.length > 1) {
      for (let index = 0; index < state.chatUsers.length; index++) {
        let curUser = state.chatUsers[index]
        if (curUser.order === user.order) {
          removeIndex = index
          if (curUser.active) {
            if (index < state.chatUsers.length - 1) {
              state.chatUsers[index + 1].active = true
            } else {
              state.chatUsers[index - 1].active = true
            }
          }
        }
      }
    }
    state.chatUsers.splice(removeIndex, 1)
    if (state.chatUsers.length === 0) {
      state.openChat = false
    }
  },
  CHANGE_USER(state, user) {
    if (!user.active) {
      let activeUser = state.chatUsers.find(x => x.active)
      if (activeUser) {
        activeUser.active = false
        user.active = true
        user.newMsgCount = 0
      }
    }
  },
  ADD_CHAT_ERRORS(state, error) {
    state.chat_errors.push(error)
  },
  ADD_USER_MESSAGE(state, messages) {
    let user = state.chatUsers.find(x => x.roomID === messages[0].roomID)
    if (user) {
      user.messages.push(...messages)
      if (!user.active) {
        user.newMsgCount = user.newMsgCount + 1
      }
      gotoBottom()
    }
  },
  SET_LOGININFO(state, info) {
    state.loginInfo = info
    window.$chat_loginInfo = info
  },
  ADD_USER(state, { orderId, roomID, username }) {
    // 只是只是追加用户,但是不会默认选中该用户
    state.chatUsers.push({
      active: state.chatUsers.length === 0 ? true : 1,
      messages: [],
      orderId: orderId,
      username: username,
      newMsgCount: 0,
      roomID: roomID
    })
  },
  SET_SYSTEMNOTICE(state, notice) {
    state.systemNotice = notice
  },
  SET_CONNECTED(state, isConn) {
    state.connected = isConn
  },
  RESET_CHAT(state) {
    if (state.connected) {
      state.connected = false
      state.chatUsers = []
      state.openChat = false
      state.connected = false
      chatApi.webSocket.complete()
    }
  }
}

export const actions = {
  async OPEN_CHAT({ commit, state, dispatch }, user) {
    let groups = await getGroupList()
    let roomID = ""
    if (groups && groups.count > 0) {
      let group = groups.groups.find(x => x.name === user.orderId)
      if (group) {
        roomID = group._id
      }
    }
    if (roomID) {
      user.roomID = roomID
      let isHaveUser =
        state.chatUsers.findIndex(x => x.orderId === user.userId) > 0
      commit("OPEN_CHAT", user)
      if (!isHaveUser) {
        dispatch("INIT_USER", user)
      }
    }
  },
  async NOTICE_OPEN_CHAT({ commit, state, dispatch }, user) {
    let groups = await getGroupList()
    let roomID = ""
    if (groups && groups.count > 0) {
      let group = groups.groups.find(x => x.name === user.orderId)
      if (group) {
        roomID = group._id
      }
    }
    if (roomID) {
      user.roomID = roomID
      let isHaveUser =
        state.chatUsers.findIndex(x => x.orderId === user.userId) > 0
      if (!isHaveUser) {
        commit("ADD_USER", user)
        dispatch("INIT_USER", user)
      }
    }
  },
  CLOSE_CHAT({ commit }) {
    commit("CLOSE_CHAT")
  },
  REMOVE_USER({ commit }, user) {
    commit("REMOVE_USER", user)
    chatApi.sendMessage({
      msg: "method",
      method: "leaveRoom",
      id: new Date().getTime().toString(),
      params: [user.orderId]
    })
  },
  SEND_MESSAGE({ state }, { roomID, message, callback }) {
    sendMessage({
      _id: new Date().getTime().toString(),
      rid: roomID,
      msg: message
    }).then(res => {
      callback(res)
    })
  },
  CHANGE_USER({ commit }, user) {
    commit("CHANGE_USER", user)
  },
  // 初始化聊天socket.并且进行登录
  INIT_CHAT({ commit, state }) {
    if (!state.connected) {
      chatApi = rcApi.connectToRocketChat(chatSocketUrl)
      chatApi.onError(error => {
        commit("ADD_CHAT_ERRORS", error)
      })
      chatApi.onCompletion(() => console.log("finished"))
      chatApi.onMessage(message => {
        console.log("----------message----------")
        console.log(message)
        if (message.msg === "result") {
          if (message.result && message.result.messages) {
            let msgList = message.result.messages.map(item => {
              return {
                msg: item.image_url
                  ? `<img src='${item.image_url}'>`
                  : item.msg,
                updateTime: item._updatedAt.$date,
                username: item.u.username,
                id: item._id,
                roomID: item.rid,
                type: "history"
              }
            })
            commit("ADD_USER_MESSAGE", msgList)
          }
        } else if (message.collection === "stream-room-messages") {
          if (message.fields && message.fields.args) {
            let msg = message.fields.args[0]
            let userMsg = {
              msg: msg.image_url ? `<img src='${msg.image_url}'>` : msg.msg,
              updateTime: msg._updatedAt,
              username: msg.u.username,
              collection: "stream-room-messages",
              id: msg._id,
              roomID: msg.rid
            }
            commit("ADD_USER_MESSAGE", [userMsg])
          }
        }
      })
      chatApi.connectToServer().subscribe(
        () => {
          chatApi.keepAlive()
        },
        error => {
          commit("ADD_CHAT_ERRORS", error)
        }
      )
      chatApi.login("frank@qq.com", "123").subscribe(apiEvent => {
        console.log("----------login----------")
        if (apiEvent.msg === "result") {
          commit("SET_LOGININFO", apiEvent.result)
          commit("SET_CONNECTED", true)
        }
      })
    }
  },
  INIT_USER({ commit }, user) {
    getGroupHistoryList({
      roomId: user.roomID,
      count: 1000,
      unreads: true
    }).then(res => {
      if (res && res.messages.length > 0) {
        let msgList = res.messages.map(msg => {
          return {
            msg: msg.image_url ? `<img src='${msg.image_url}'>` : msg.msg,
            updateTime: msg._updatedAt,
            username: msg.u.username,
            collection: "stream-room-messages",
            id: msg._id,
            roomID: msg.rid
          }
        })
        commit("ADD_USER_MESSAGE", msgList.reverse())
        setTimeout(() => {
          document.getElementById("c2c_chat_message").scrollTo(0, 10000)
        }, 200)
      }
    })
    chatApi.sendMessage({
      msg: "sub",
      id: new Date().getTime().toString(),
      name: "stream-room-messages",
      params: [user.roomID, false]
    })
  }
}
