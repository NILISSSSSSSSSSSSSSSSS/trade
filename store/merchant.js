import { dealInfo } from "@/apis/merchant";

// 认证状态
export const unverified = "UNCERTIFY";
export const verified = "CERTIFY";
export const verifiding = "REVIEW";

// mutations/actions types
export const SET_STAT = 'SET_STAT'

export const state = () => ({
  stat: {} // 认证状态，商家及成交信息
})

export const getters = {
  stat(state) {
    return state.stat
  }
}

export const mutations = {
  [SET_STAT](state, data) {
    state.stat = data
  }
}

export const actions = {
  async [SET_STAT]({ commit }) {
    const resData = await dealInfo()
    if (resData.success) {
      commit(SET_STAT, resData.data)
    }
  }
}
