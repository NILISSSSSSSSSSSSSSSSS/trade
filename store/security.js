import axios from '@/plugins/axios'

export const state = () => ({
  vertifyData: {}
})

export const getters = {
  vertifyData: (state) => {
    return state.vertifyData
  }
}

export const mutations = {
  setVertifyData(state, data) {
    let tmpObj = {
      phone: data.phone,
      email: data.email,
      google: data.isBindGlAtu
    }
    state.vertifyData = tmpObj
  }
}

export const actions = {

}
