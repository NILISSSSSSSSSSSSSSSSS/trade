import api from '@/plugins/axios.js'
import { setCookie, getCookie } from '@/tools/cookie'
import { getPhoneAndEmail } from '@/apis/user'
import socket from '@/plugins/socket'

let token = ''
if (process.client) {
  token = getCookie('token')
  token = token == null ? "" : token
}
export const state = () => ({
  history_marqueen: [],
  bindInfo: {},
  user_info: {},
  token: token,
  phoneAndEmail: {}
})

export const getters = {
  userInfo(state) {
    return state.user_info
  },
  phoneAndEmail(state) {
    return state.phoneAndEmail
  },
  avatar(state) {
    return state.user_info.avatar
  },
  nickname(state) {
    return state.user_info.nickname
  }
}

export const mutations = {
  LOGIN(state, data) {
    state.history_marqueen = data
  },
  REGISTER(state, data) {
    state.history_marqueen = data
  },
  SET_BIND_INFO(state, payload) {
    state.bindInfo = payload
  },
  USER_INFO(state, data) {
    state.user_info = data
  },
  SET_TOKEN(state, payload) {
    state.token = payload
  },
  SET_Phone_Email(state, obj) {
    state.phoneAndEmail = obj
  },
  LOGOUT(state) {
    state.token = ''
    state.user_info = {}
  }
}

export const actions = {
  async CHECK_EXIST({ commit }, payload) {
    let data = await api.post('/default/checkPhoneOrEmailExist', payload)
    return data.data.success
  },
  async LOGIN({ commit }, payload) {
    let data = await api.post('/default/login', payload)
    return data.data
  },
  async REGISTER({ commit }, payload) {
    let data = await api.post('/default/register', payload)
    return data.data.success
    // commit('REGISTER', data)
  },
  async RESET({ commit }, payload) {
    let data = await api.post('/default/retrievePwd', payload)
    return data.data.success
    // commit('REGISTER', data)
  },
  async SEND_CODE({ commit }, payload) {
    let data = await api.post('/default/sendVerifyCodeWithServiceName', payload)
    return data.data.success
  },
  async GET_BIND_BY_ACCOUNT({ commit }, payload) {
    let data = await api.post('/default/getBindDataWithPhoneOrEmail', payload)
    if (data.data.success) {
      commit('SET_BIND_INFO', data.data.data)
      return true
    } else {
      return false
    }
  },
  async USER_INFO({ commit }) {
    let data = await api.post('/user/userinfo')
    if (!data.data.success) return false
    commit('USER_INFO', data.data.data)
  },
  async SET_TOKEN({ commit }, payload) {
    console.log('payload----------', payload)
    setCookie('token', payload)
    socket.subscribe({
      businessName: 'USER_ON_OFF_LINE',
      token: payload,
      online: true
    })
    commit('SET_TOKEN', payload)
  },
  async SET_Phone_Email({ commit }) {
    const resData = await getPhoneAndEmail()
    if (resData.success) {
      commit('SET_Phone_Email', resData.data)
    }
  },
  LOGOUT({ commit }) {
    socket.subscribe({
      businessName: 'USER_ON_OFF_LINE',
      token: getCookie('token'),
      online: false
    })
    setCookie('token', '')
    window.location.reload()
    // commit('LOGOUT')
  }
}
