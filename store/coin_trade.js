import { getOnePairConfig, getPairDeepth, getPairDeal, getEntrustOrders, getPairPrice, bbEntrustHistory } from "@/apis/bbtrade"
import { getCookie } from '@/tools/cookie'
import socket from '@/plugins/socket'

export const state = () => ({
  pairConfig: {},
  pairPrice: [], // 交易对最新价格
  pairDepth: [], // 交易对深度
  pairBills: [], // 最新成交
  curEntrustOrders: [], // 当前委托单
  curPairPrice: {}, // 当前交易对的价格
  curPairName: '',
  windowWidth: 0,
  localFiatFlag: false,
  historyBills: []
})

export const getters = {
  pairConfig(state) {
    return state.pairConfig
  },
  curPairPrice(state) {
    if (state.curPairPrice) {
      return state.curPairPrice
    }
    return {}
  },
  pairDepth(state) {
    return state.pairDepth
  },
  pairPrice(state) {
    return state.pairPrice.map((item) => {
      item.name = item.pairName.split("_")[0]
      return item;
    })
  },
  pairBills(state) {
    return state.pairBills
  },
  curEntrustOrders(state) {
    return state.curEntrustOrders
  },
  windowWidth(state) {
    return state.windowWidth
  },
  localFiatFlag(state) {
    return state.localFiatFlag
  }
}

export const mutations = {
  SET_LOCALFIAT(state, flag) {
    state.localFiatFlag = flag
  },
  SET_WINDOWWIDTH(state, windowWidth) {
    state.windowWidth = windowWidth
  },
  SET_CUR_PAIRNAME(state, curPairName) {
    state.curPairName = curPairName
  },
  setConfig(state, pairConfig) {
    state.pairConfig = pairConfig
  },
  SET_PAIRPRICE(state, data) {
    state.pairPrice = data
  },
  UPDATE_PAIRPRICE(state, socket) {
    socket.pairName = socket.pairName.replace('|', '_')
    if (state.curPairPrice.pairName === socket.pairName) {
      state.curPairPrice.price = socket.price;
      state.curPairPrice.rise = socket.rise;
      state.curPairPrice.createtime = socket.createTime
    }
    if (state.pairPrice) {
      let pair = state.pairPrice.find(item => item.pairName === socket.pairName);
      if (pair) {
        pair.price = socket.price;
        pair.rise = socket.rise;
        pair.createtime = socket.createTime
      }
    }
  },
  SET_PAIRDEPTH(state, data) {
    state.pairDepth = data
  },
  UPDATE_PAIRDEPTH(state, socket) {
    if (state.pairDepth) {
      let index = state.pairDepth.findIndex(pair => pair.deepType.toString() === data.deepType.toString())
      if (index >= 0) {
        state.pairDepth[index] = socket;
      }
    }
  },
  SET_PAIRBILLS(state, data) {
    state.pairBills = data
  },
  ADD_PAIRBILLS(state, socket) {
    /*
    export interface IPushpairBill extends IBasePushInterface {
    pairName: string;
    userType: 'buy' | 'sell';
    count: string;
    price: string;
    createIme: string;
    tradeDirection: "sell" | "buy";
     */
    state.pairBills.unshift({
      billId: '',
      billAmount: socket.count,
      pairName: socket.pairName.replace('|', '_'),
      sellId: '',
      buyId: '',
      isSellEnd: '',
      isBuyEnd: '',
      tradeDirection: socket.tradeDirection,
      type: socket.userType,
      price: socket.price,
      createTime: socket.createTime
    })
  },
  SET_CUREntrustOrders(state, data) {
    state.curEntrustOrders = data
  },
  UPDATE_CUR_ENTRUSORDERS(state, socket) {
    /*
      pairName: string;
      reqId: string;     // 委托id
      type: 'buy' | 'sell';
      price: string;
      fullCount: string;      // 全部数量,,都是指的currency的数量，和zone无关
      remainCount: string;    // 剩余数量
      status: "pendding" | "fail" | "normal" | "cancel" | "over";
      createTime: string;     // 委托创建时间
      updateTime: string;     // 变化时间
    */
    if (socket.status === 'normal') {
      let order = state.curEntrustOrders.find(x => x.id === socket.reqId)
      if (order) {
        order.price = socket.price
        order.remainCount = socket.remainCount
        order.fullCount = socket.fullCount
      } else {
        state.curEntrustOrders.unshift({
          price: socket.price,
          status: socket.status,
          fullCount: socket.fullCount,
          pairName: socket.pairName.replace('|', '_'),
          id: socket.reqId,
          _id: socket.reqId,
          createTime: socket.createTime,
          type: socket.type,
          remainCount: socket.remainCount,
          updateTime: socket.updateTime
        })
      }
    } else {
      let index = state.curEntrustOrders.find(x => x.id === socket.reqId)
      if (index >= 0) {
        state.curEntrustOrders.split(index, 0)
      }
    }
  },
  SET_CUR_PAIRPRICE(state, data) {
    state.curPairPrice = data
    console.log(state.curPairPrice)
  },
  REMOVE_CUR_ENTRUSORDERS(state, id) {
    let index = state.curEntrustOrders.findIndex(x => x.id === id)
    if (index >= 0) {
      state.curEntrustOrders.splice(index, 1)
    }
  },
  SET_HISTORYBILLS(state, data) {
    state.historyBills = data
  },
  ADD_HISTORYBILLS(state, socket) {
    /*
    pairName: string;
    billId: string;
    orderId: string;
    orderPrice: string;
    userType: 'buy' | 'sell';
    count: string;
    price: string;
    createIme: string;
    tradeDirection: "sell" | "buy";
    */
    state.historyBills.unshift({
      billAmount: socket.count,
      billId: socket.billId,
      createTime: socket.createTime,
      pairName: socket.pairName,
      tradeDirection: socket.tradeDirection,
      type: socket.userType
    })
  }
}

export const actions = {
  async GET_Config({ commit }, pairName) {
    const resData = await getOnePairConfig({ pairName })
    if (resData.success) {
      commit('setConfig', resData.data)
    }
  },
  // 拉取多个交易对的最新价格
  GET_PAIRPRICE({ commit, dispatch, state }, pairs) {
    getPairPrice({
      createtime: new Date().toISOString(),
      pairs: pairs
    }).then(res => {
      if (res.success) {
        commit('SET_PAIRPRICE', res.data)
        console.log('--GET_PAIRPRICE---')
        let socketPairs = [...pairs, state.curPairName]
        let currencies = [];
        socketPairs.forEach(item => {
          currencies.push(...item.split('_'))
        })
        dispatch('GET_QUOTES', currencies, {
          root: true
        })
        socket.subscribe({
          businessName: 'SUBSCRIBLE_PAIR_PRICE',
          pairNames: socketPairs.map(item => item.replace('_', '|'))
        })
        /*
        window.$socket.emit('subcrible', {
          businessName: 'SUBSCRIBLE_PAIR_PRICE',
          pairNames: socketPairs.map(item => item.replace('_', '|'))
        })
        */
      }
    })
  },
  UPDATE_PAIRPRICE({ commit }, socket) {
    commit('UPDATE_PAIRPRICE', socket)
  },
  // 获取交易对深度
  GET_PAIRDEPTH({ commit }, pairName) {
    getPairDeepth({
      pairName: pairName
    }).then(res => {
      if (res.success) {
        commit('SET_PAIRDEPTH', res.data)
        socket.subscribe({
          businessName: 'SUBSCRIBLE_PAIR_DEEP',
          deepTypes: res.data.map(item => item.deepType),
          pairName: pairName.replace('_', '|'),
          appId: 'aaa'
        })
        /*
        window.$socket.emit('subcrible', {
          businessName: 'SUBSCRIBLE_PAIR_DEEP',
          deepTypes: res.data.map(item => item.deepType),
          pairName: pairName.replace('_', '|'),
          appId: 'aaa'
        })
        */
      }
    })
  },
  // 获取交易对最新成交单
  GET_PAIRBILLS({ commit }, pairName) {
    getPairDeal({
      pairName,
      page: 1,
      pageCount: 30
    }).then(res => {
      if (res.success) {
        commit('SET_PAIRBILLS', res.data.list)
        socket.subscribe({
          businessName: 'SUBSCRIBLE_PAIR_BILL',
          pairName: pairName.replace('_', '|')
        })
        /*
        window.$socket.emit('subcrible', {
          businessName: 'SUBSCRIBLE_PAIR_BILL',
          pairName: pairName.replace('_', '|')
        })
        */
      }
    })
  },
  // 获取当前委托单
  GET_CUR_ENTRUSORDERS({ commit }, pairName) {
    getEntrustOrders({
      pairName,
      status: ['normal'],
      page: 0,
      pageCount: 9999
    }).then(res => {
      if (res.success) {
        commit('SET_CUREntrustOrders', res.data.list)
        socket.subscribe({
          businessName: 'SUBSCRIBLE_MY_BB_DELEGATION_CHANGE',
          token: getCookie('token')
        })
        /*
        window.$socket.emit('subcrible', {
          businessName: 'SUBSCRIBLE_MY_BB_DELEGATION_CHANGE',
          token: getCookie('token')
        })
        */
      }
    })
  },
  // 获取当前交易对最新价格
  async GET_CUR_PAIRPRICE({ commit }, pairname) {
    let data = await getPairPrice({
      createtime: new Date().toISOString(),
      pairs: [pairname]
    })
    if (data.success) {
      if (data.data) {
        commit('SET_CUR_PAIRPRICE', data.data[0])
      }
    }
  },
  // 获取历史委托单
  GET_HISTORYBILLS({ commit }) {
    bbEntrustHistory().then(res => {
      if (res.success) {
        commit('SET_HISTORYBILLS', res.data.list)
        socket.subscribe({
          businessName: 'SUBSCRIBLE_MY_BB_BILL',
          token: getCookie('token')
        })
        /*
        window.$socket.emit('subcrible', {
          businessName: 'SUBSCRIBLE_MY_BB_BILL',
          token: getCookie('token')
        })
        */
      }
    })
  }
}
