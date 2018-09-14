import { reserve } from '@/apis/profile'

export const state = () => ({
  reserve: 0
})

export const getters = {
  reserve(state) {
    return state.reserve
  }
}

export const mutations = {
  setReserve(state, reserve) {
    state.reserve = reserve
  }
}

export const actions = {
  async SET_Reserve({ commit }) {
    const resData = await reserve()
    if (resData.success) {
      commit('setReserve', resData.data)
    } else {
      commit('setReserve', 0)
    }
  }
}
