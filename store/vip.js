import { vipInfo, vipStatus, vipPhotos, vipReserve } from '@/apis/vip'

export const state = () => ({
  vipInfo: null,
  vipStatus: '',
  vipPhotos: [],
  vipReserve: {}
})

export const getters = {
  vipInfo(state) {
    return state.vipInfo
  },
  vipStatus(state) {
    return state.vipStatus
  },
  vipPhotos(state) {
    return state.vipPhotos
  },
  vipReserve(state) {
    return state.vipReserve
  }
}

export const mutations = {
  setVipInfo(state, info) {
    state.vipInfo = info
  },
  setVipStatus(state, status) {
    state.vipStatus = status || ''
  },
  setVipPhotos(state, photos) {
    state.vipPhotos = photos || []
  },
  setVipReserve(state, reserve) {
    state.vipReserve = reserve || {}
  }
}

export const actions = {
  async SET_VipInfo({ commit }) {
    const resData = await vipInfo()
    if (resData.success) {
      commit('setVipInfo', resData.data)
    } else {
      commit('setVipInfo', null)
    }
  },
  async SET_VipStatus({ commit }) {
    const resData = await vipStatus()
    if (resData.success) {
      commit('setVipStatus', resData.data)
    } else {
      commit('setVipStatus', '')
    }
  },
  async SET_VipPhotos({ commit }) {
    const resData = await vipPhotos()
    if (resData.success) {
      commit('setVipPhotos', resData.data)
    } else {
      commit('setVipPhotos', [])
    }
  },
  async SET_VipReserve({ commit }) {
    const resData = await vipReserve()
    if (resData.success) {
      commit('setVipReserve', resData.data)
    }
  }
}
