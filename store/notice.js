
export const state = () => ({
  order_notices: [],
  showNotice: false
})

export const mutations = {
  ADD_ORDER_NOTICE(state, notice) {
    state.order_notices.unshift(notice)
    state.haveNewNotice = true
  },
  REMOVE_ORDER_NOTICE(state, index) {
    state.order_notices.splice(index, 1)
  },
  CLEAR_ORDER_NOTICE(state) {
    state.order_notices.splice(0, state.order_notices.length)
    state.haveNewNotice = false
  },
  READ_ORDER_NOTICE(state) {
    state.order_notices.forEach(item => {
      item.isread = true
    })
    state.haveNewNotice = false
  },
  TOGGLE_NOTICE(state) {
    if (state.showNotice) {
      state.showNotice = false;
      state.order_notices.forEach(item => {
        item.isread = true
      })
      state.haveNewNotice = false
    } else {
      state.showNotice = true
    }
  }
}

export const actions = {
  ADD_ORDER_NOTICE({ commit, dispatch }, message) {
    let messageType = ''
    let order = message.body
    if (order.status === 'waitCoin') {
      messageType = 'msg_order_waitCoin' // 等待放币
    } else if (order.status === 'waitPay') {
      messageType = 'msg_order_waitPay' // 等待付款
      if (order.hasExpire) {
        messageType = 'msg_order_waitPay_hasExpire'
      }
    } else if (order.status === 'expire') {
      messageType = 'msg_order_expire'
    } else if (order.status === 'success') {
      if (order.appealStatus === 'normal') {
        messageType = 'msg_order_success'
      } else {
        messageType = `msg_appeal_${order.appealStatus}`
      }
    } else if (order.orderStatus === 'cancel') {
      if (order.appealStatus === 'normal') {
        messageType = 'msg_order_cancel'
      } else {
        messageType = `msg_appeal_${order.appealStatus}`
      }
    }
    commit('ADD_ORDER_NOTICE', {
      orderId: order.orderId,
      messageType: messageType,
      username: order.nickname,
      isread: false,
      isC2C: order.isC2C,
      isOwner: order.isOwner
    })
  },
  REMOVE_ORDER_NOTICE({ commit }, index) {
    commit('REMOVE_ORDER_NOTICE', index)
  },
  CLEAR_ORDER_NOTICE({ commit }) {
    commit('CLEAR_ORDER_NOTICE')
  },
  READ_ORDER_NOTICE({ commit }) {
    commit('READ_ORDER_NOTICE')
  },
  TOGGLE_NOTICE({ commit }, isOpen) {
    commit('TOGGLE_NOTICE', isOpen)
  }
}

export const getters = {
  newNoticeCount: (state) => {
    return state.order_notices.filter(x => x.isread === false).length
  }
}
