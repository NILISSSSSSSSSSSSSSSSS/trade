import { otcHistory } from "@/apis/otc";

export const state = () => ({
  history: {},
  otc: {}
})

export const getters = {
  history(state) {
    return state.history
  },
  otc(state) {
    return state.otc
  }
}

export const mutations = {
  setHistoryData(state, data) {
    state.history = data
  },
  setOtcData(state, data) {
    state.otc = data
  }
}

export const actions = {
  async SET_HistoryData({ commit }, { tradeType, orderStatus, startDate, endDate, page, limit }) {
    const resData = await otcHistory({
      tradeType,
      orderStatus,
      startDate,
      endDate,
      page,
      limit,
      isC2C: true
    })
    if (resData.success) {
      commit('setHistoryData', resData.data)
    }
  },
  async SET_OtcData({ commit }, { tradeType, orderStatus, startDate, endDate, page, limit }) {
    const resData = await otcHistory({
      tradeType,
      orderStatus,
      startDate,
      endDate,
      page,
      limit,
      isC2C: false
    })
    if (resData.success) {
      commit('setOtcData', resData.data)
    }
  }
}
