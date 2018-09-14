import { setCookie, getCookie, getServiceCookie } from '@/tools/cookie'
// import { legalList, currencyList } from '@/apis/configure'
// import { getSiteInfo, getCurrencyConfig, getCurrencyMarketsPrice,  } from '@/apis/common'
import { legalList, currencyList, getAllLegalCurrency } from '@/apis/configure'
import { getSiteInfo, getCurrencyConfig, getCurrencyPriceAll, getAllPaywayList } from '@/apis/common'
import { exchangeRate } from '@/apis/information'
import { supportLang } from '@/plugins/config'
import { getbbPairs } from '@/apis/bbtrade'
import socket from '@/plugins/socket'

export const state = () => ({
  lang: null,
  fiatCurrencyEx: 'CNY',
  common: {},
  exchangeRate: null, // 当前币种法币行情,
  curTheme: '',
  bbPairs: [],
  quotes: [] // 数字币行情
})

export const getters = {
  quotes(state) {
    return state.quotes
  },
  bbPairs: (state) => {
    return state.bbPairs
  },
  exchangeRate: (state) => {
    return state.exchangeRate
  }
}

export const mutations = {
  /**
   *
   * @param {*} state
   * @param {*} lang
   */
  SET_LANG(state, payload) {
    supportLang.map((item, index) => {
      if (payload === item.symbol) {
        state.lang = item
      }
    })
  },
  SET_COMMON(state, common) {
    state.common = common
    state.common.supportLang = supportLang
    console.log(common.siteInfo.themes)
    if (process.client) {
      window.$chat_baseurl = ""
    }
  },
  SET_BBPAIRS(state, bbPairs) {
    state.bbPairs = bbPairs
  },
  GET_EXCHANGERATE(state, data) {
    state.exchangeRate = data
  },
  UPDATE_EXCHANGERATE(state, data) {
    state.exchangeRate.usdValue = Number(data.USD)
    state.exchangeRate.quotationTime = data.QuotationTime
    state.legalCurrencyType = data.legalCurrencyType
  },
  CHANGE_THEME(state, data) {
    state.curTheme = data
  },
  SET_QUOTES(state, data) {
    state.quotes = data
  },
  UPDATE_QUOTES(state, data) {
    let quote = state.quotes.find(x => x.currencyId === data.currencyId)
    if (quote) {
      quote.prePrice = quote.currentPrice
      quote.currentPrice = data.quotation.USD
    }
  }
}

export const actions = {
  async nuxtServerInit({ commit }, { req, app }) {
    console.log('--------------------------nuxtServerInit')
    let lang = app.i18n.locale
    commit('SET_LANG', lang)

    //  获取站点信息及支持的数字币法币
    let siteInfo = await getSiteInfo()
    let legalCoins = await legalList()
    let currencies = await currencyList()
    let currencyConfig = await getCurrencyConfig()
    let allPayway = await getAllPaywayList()
    let allLegalCurrency = await getAllLegalCurrency()
    let common = {}
    if (siteInfo.success) {
      common.siteInfo = siteInfo.data
    }
    if (legalCoins.success) {
      common.legalCoins = legalCoins.data
    }
    if (currencies.success) {
      common.currencies = currencies.data
    }
    if (currencyConfig.success) {
      common.currencyConfig = currencyConfig.data
    }
    if (allPayway.success) {
      common.legalCurrencyList = allPayway.data.legalCurrencyList
      common.payWays = allPayway.data.payWays
    }
    if (allLegalCurrency.success) {
      common.allLegalCurrency = allLegalCurrency.data
    }
    commit('SET_COMMON', common)

    //  获取支持的币币交易对
    let bbPairs = await getbbPairs()
    if (bbPairs.success) {
      let data = bbPairs.data || []
      commit('SET_BBPAIRS', data)
    }

    // 初始化主题
    let theme = getServiceCookie('theme', req) || 'white'
    commit('CHANGE_THEME', theme)
  },
  async GET_EXCHANGERATE({ commit }, symbol) {
    let info = await exchangeRate(symbol)
    if (info.success) {
      socket.subscribe({
        businessName: 'SUBSCRIBLE_LEGAL_CURRENCY_QUOTATION',
        legalCurrencyName: symbol
      })
      /*
      window.$socket.emit('subcrible', {
        businessName: 'SUBSCRIBLE_LEGAL_CURRENCY_QUOTATION',
        legalCurrencyName: symbol
      })
      */
      commit('GET_EXCHANGERATE', info.data)
    }
  },
  CHANGE_THEME({ commit }, key) {
    setCookie('theme', key)
    commit('CHANGE_THEME', key)
  },
  GET_QUOTES({ commit }, currencies) {
    let curs = [];
    // 去重复
    currencies.forEach(item => {
      if (curs.indexOf(item) < 0) {
        curs.push(item)
      }
    })
    getCurrencyPriceAll(curs).then(res => {
      if (res.success) {
        let quotes = res.data.list.map(item => {
          let currencyId = item.currencyId
          let currentPrice = 0
          let prePrice = 0
          let average = item.quotations.find(x => x.name === 'average')
          if (average) {
            currentPrice = average.usdValue
            prePrice = average.firstUsdValue
          }
          return {
            currencyId,
            currentPrice,
            prePrice
          }
        })
        commit('SET_QUOTES', quotes)
        socket.subscribe({
          businessName: 'SUBSCRIBLE_CURRENCY_QUOTATION',
          currencyIds: quotes.map(x => x.currencyId)
        })
        /* window.$socket.emit('subcrible', {
          businessName: 'SUBSCRIBLE_CURRENCY_QUOTATION',
          currencyIds: quotes.map(x => x.currencyId)
        }) */
      }
    })
  }
}
