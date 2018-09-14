import { axiospost } from "@/apis/axios";
import { createOrder } from "@/apis/order";
import { myOrder } from "@/apis/otc";
import socket from "@/plugins/socket";

export const state = () => ({
  orders: [], // 当前订单,
  hotBuyOrders: [], // 买入的订单
  hotSaleOrders: [], // 卖出的订单
  successOrders: [], // 已完成订单
  cancelOrders: [], // 已取消订单
  appealOrders: [] // 已申诉订单
});

export const mutations = {
  INIT_ORDERS(state, orders) {
    state.orders = orders;
  },
  UPDATE_ORDERS(state, order) {
    if (order) {
      let socketOrder = {
        updateTime: order.updateTime,
        createTime: order.createTime,
        isC2C: order.isC2C,
        appealStatus: order.appealStatus,
        orderStatus: order.status,
        hasExpire: order.hasExpire,
        id: order.orderId,
        adId: order.adId,
        tradeType: order.tradeType,
        currencyId: order.currencyId,
        unitPrice: order.unitPrice,
        isOwner: order.isOwner,
        nickname:
          order.isOwner === true
            ? order.customer.nickName
            : order.owner.nickName,
        tradeCurrencyAmount: order.tradeCurrencyAmount,
        legalCurrency: order.legalCurrency,
        legalCurrencyAmount: order.legalCurrencyAmount,
        expireTime: order.expire,
        cancelTime: order.cancelTime,
        isAdMaster: order.isAdMaster,
        durationTime: order.durationTime,
        appealTime: order.appealTime
      }

      // 不是waitPay和waitCoin从当前订单列表删除
      if (["waitPay", "waitCoin"].indexOf(order.status) < 0) {
        let curOrderIndex = state.orders.findIndex(x => x.id === order.orderId);
        if (curOrderIndex >= 0) {
          state.orders.splice(curOrderIndex, 1)
        }
      }

      // 申述订单更新
      if (order.appealStatus !== 'normal') {
        let curOrderIndex = state.appealOrders.findIndex(x => x.id === order.orderId)
        if (curOrderIndex >= 0) {
          state.appealOrders[curOrderIndex] = socketOrder
        } else {
          state.appealOrders.push(socketOrder)
        }
      }

      // 当前订单,完成订单,取消订单[新增/更新]
      if (["waitPay", "waitCoin"].indexOf(order.status) >= 0) {
        let curOrderIndex = state.orders.findIndex(x => x.id === order.orderId);
        if (curOrderIndex >= 0) {
          state.orders[curOrderIndex] = socketOrder
        } else {
          state.orders.push(socketOrder)
        }
      } else if (order.status === "success") {
        //  更新最新订单
        let curOrderIndex = state.successOrders.findIndex(x => x.id === order.orderId);
        if (curOrderIndex >= 0) {
          state[successOrders] = socketOrder
        } else {
          state.successOrders.push(socketOrder)
        }
      } else if (order.status === "cancel") {
        //  更新取消订单
        let curOrderIndex = state.cancelOrders.findIndex(x => x.id === order.orderId);
        if (curOrderIndex >= 0) {
          state.cancelOrders[curOrderIndex] = socketOrder
        } else {
          state.cancelOrders.push(socketOrder)
        }
      }
    }
  },
  INIT_HOTORDERS(state, orders) {
    state.hotBuyOrders = orders;
  },
  INIT_HOT_BUY_ORDERS(state, orders) {
    state.hotBuyOrders = orders;
  },
  INIT_HOT_Sale_ORDERS(state, orders) {
    state.hotSaleOrders = orders;
  },
  UPDATE_HOTORDERS(state, socket) {
    let order = {
      _id: socket.orderId,
      nickname: socket.ownerNickName,
      tradeType: socket.tradeType,
      tradeCurrencyAmount: socket.tradeCurrencyAmount,
      currencyId: socket.currencyId,
      legalCurrency: socket.legalCurrency,
      createTime: socket.createTime
    };
    if (socket.tradeType === "sell") {
      state.hotSaleOrders.unshift(order);
    } else if (socket.tradeType === "buy") {
      state.hotBuyOrders.unshift(order);
    }
  },
  SUCCESS_ORDERS(state, data) {
    state.successOrders = data;
  },
  CANCEL_ORDERS(state, data) {
    state.cancelOrders = data;
  },
  APPEAL_ORDERS(state, data) {
    state.appealOrders = data;
  }
};

export const actions = {
  async INIT_ORDERS({ commit }) {
    let orders = [];
    let result = await myOrder({ queryType: "current", limit: 0, page: 0 })
    if (result.success) {
      orders = result.data.datas;
      commit("INIT_ORDERS", orders);
    }
  },
  // 初始化最新订单
  async INIT_HOTORDERS({ commit }, currency) {
    const buyResult = await axiospost(`/completeList`, {
      buy: true,
      currencyId: currency,
      page: 1,
      limit: 30
    });
    const sellResult = await axiospost(`/completeList`, {
      buy: false,
      currencyId: currency,
      page: 1,
      limit: 30
    });
    if (buyResult.success) {
      commit(
        "INIT_HOT_BUY_ORDERS",
        buyResult.data == null ? [] : buyResult.data
      );
    }
    if (sellResult.success) {
      commit(
        "INIT_HOT_Sale_ORDERS",
        sellResult.data == null ? [] : sellResult.data
      );
    }
    if (process.client) {
      socket.subscribe({
        businessName: "SUBSCRIBLE_LEGAL_SUCCESS_ORDER",
        currencyId: currency
      });
      /*
      window.$socket.emit('subcrible', {
        businessName: 'SUBSCRIBLE_LEGAL_SUCCESS_ORDER',
        currencyId: currency
      })
      */
    }
  },
  async CREATE_ORDER({ commit }, payload) {
    let result = await createOrder(payload);
    return result.success;
  },
  // 已完成订单
  async SUCCESS_ORDERS({ commit }) {
    let result = await myOrder({ queryType: "success" });
    if (result.success) {
      commit("SUCCESS_ORDERS", result.data.datas);
    }
  },
  // 已取消订单
  async CANCEL_ORDERS({ commit }) {
    let result = await myOrder({ queryType: "canceled" });
    if (result.success) {
      commit("CANCEL_ORDERS", result.data.datas);
    }
  },
  // 已申诉订单
  async APPEAL_ORDERS({ commit }) {
    let result = await myOrder({ queryType: "complaint" });
    if (result.success) {
      commit("APPEAL_ORDERS", result.data.datas);
    }
  }
};
