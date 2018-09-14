import axios from '@/plugins/axios'
import { getCookie } from '@/tools/cookie';
import socket from '@/plugins/socket'

export const state = () => ({
  account_asset: [],
  wallet: [],
  biz_types: [],
  orderEnum: ['init', 'waitCoin', 'waitPay', 'success', 'expire', 'cancel']
})

export const getters = {
  account_asset(state) {
    return state.account_asset
  },
  wallet(state) {
    return state.wallet
  },
  biz_types(state) {
    return state.biz_types
  },
  orderEnum(state) {
    return state.orderEnum
  }
}

export const mutations = {
  SET_ACCOUNT_ASSET(state, data) {
    state.account_asset = data
  },
  SET_BIZ_TYPES(state, data) {
    state.biz_types = data
  },
  UPDATE_ACCOUNT_ASSET(state, socket) {
    if (socket) {
      let curCurency = state.account_asset.find(x => x.currencyId === socket.currencyId)
      if (curCurency) {
        curCurency.freeze = socket.freeze;
        curCurency.lock = socket.lock;
      }
    }
  }
}

export const actions = {
  async SET_ACCOUNT_ASSET({ commit }) {
    let data = await axios.post('/account/asset')
    if (data.data.success) {
      commit('SET_ACCOUNT_ASSET', data.data.data)
      socket.subscribe({
        businessName: 'SUBSCRIBLE_USER_CURRRENCY_CHANGE',
        token: getCookie('token'),
        coinsName: data.data.data.map(item => item.currency)
      })
      /*
      window.$socket.emit('subcrible', {
        businessName: 'SUBSCRIBLE_USER_CURRRENCY_CHANGE',
        token: getCookie('token'),
        coinsName: data.data.data.map(item => item.currency)
      })
      */
    }
  },
  async SET_BIZ_TYPES({ commit }) {
    let data = await axios.post('/account/biz_types')
    if (data.data.success) {
      commit('SET_BIZ_TYPES', data.data.data)
    }
  }
}
