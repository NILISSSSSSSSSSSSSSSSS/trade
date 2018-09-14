import axios from 'axios'
import { adQueryVip, createOrder, getHotOrders } from '@/apis/c2c-trade'
import { dealInfo } from '@/apis/merchant'
export const state = () => ({
  history_marqueen: [],
  vip_status: false
})
export const mutations = {
  SET_HISTORY_MARQUEEN (state, payload) {
    state.history_marqueen = payload
  },
  VIP_STATUS (state, payload) {
    state.vip_status = payload
  }
}

export const actions = {
  async SET_HISTORY_MARQUEEN ({ commit }) {
    let result = await axios.post('https://www.otcex.io/index/ordersinfo')
    commit('SET_HISTORY_MARQUEEN', result.data.data.list)
  },
  async GET_ADS ({ commit }, payload) {
    let result = await adQueryVip(payload)
    return result
  },
  async CREATE_ORDER ({ commit }, payload) {
    let result = await createOrder(payload)
    return result.success
  },
  async GET_HOT_ORDER ({ commit }, payload) {
    let result = await getHotOrders(payload)
    return result.success
  },
  async GET_VIP_STATUS ({ commit }) {
    let result = await dealInfo()
    console.log(result.data.certifyStatus === 'CERTIFY')
    if (result.success) {
      commit('VIP_STATUS', result.data.certifyStatus === 'CERTIFY')
    }
  }
}
