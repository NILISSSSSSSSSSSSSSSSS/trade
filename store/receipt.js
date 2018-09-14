import { getSettings } from '@/apis/receipt'

export const state = () => ({
  paySettings: []
})

export const getters = {
  paySettings(state) {
    return state.paySettings
  }
}

export const mutations = {
  setPaySettings(state, settings) {
    state.paySettings = settings
  }
}

export const actions = {
  async SET_PaySettings({ commit }) {
    const resData = await getSettings()
    if (resData.success) {
      commit('setPaySettings', resData.data)
    } else {
      commit('setPaySettings', [])
    }
  }
}
