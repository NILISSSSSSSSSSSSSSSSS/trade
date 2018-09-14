import { exchangeRate } from "@/apis/information";

export const state = () => ({
  // key 为 USD、CNY...
  USDTRate: {}
})

export const getters = {
  USDTRate(state) {
    return state.USDTRate
  }
}

export const mutations = {
  setUSDTRate(state, obj) {
    if (obj.legalCurrencyType) {
      state.USDTRate = Object.assign({}, state.USDTRate, {
        // ES6 允许字面量定义对象时，用表达式作为对象的属性名
        [obj.legalCurrencyType]: obj
      })
    }
  }
}

export const actions = {
  async GET_USDR_RATE({ commit }, symbol) {
    const resData = await exchangeRate(symbol)
    if (resData.success) {
      commit('setUSDTRate', resData.data)
    }
  }
}
