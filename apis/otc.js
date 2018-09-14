import { axiospost } from './axios'

// 买入
export function otcBuyIn({ adId, isC2C, tradeCurrencyAmount, desc }) {
  return axiospost('/otc/buy_in', { adId, isC2C, tradeCurrencyAmount, desc }, { loading: true })
}

// 卖出
export function otcSellOut({ adId, isC2C, tradeCurrencyAmount, desc }) {
  return axiospost('/otc/sell_out', { adId, isC2C, tradeCurrencyAmount, desc }, { loading: true })
}

// 获取我的订单
export function myOrder({ queryType, limit = 99999999, page = 1 }) {
  return axiospost('/otc/my_order', { queryType, limit, page })
}

// OTC成交记录
export function otcHistory({ isC2C, tradeType, orderStatus, startDate, endDate, page, limit }) {
  return axiospost('/otc/otc_history', { isC2C, tradeType, orderStatus, startDate, endDate, page, limit })
}
