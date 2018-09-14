import { axiospost } from './axios'

// 拉取交易所支持的交易区，及每个交易区的交易对
export const getbbPairs = function (obj) {
  return axiospost('/bbtrade/pairs', obj)
}

// 拉取某个交易对的配置
export const getOnePairConfig = function (obj) {
  return axiospost('/bbtrade/pair/config', obj)
}

// 拉取多个交易对的最新价格
export const getPairPrice = function (obj) {
  return axiospost('/bbtrade/pair/price', obj)
}

// 拉取交易对的深度
export const getPairDeepth = function (obj) {
  return axiospost('/bbtrade/pair/depth', obj)
}

// 拉取交易对的最近成交30笔
export const getPairDeal = function (obj) {
  return axiospost('/bbtrade/pair/bills', obj)
}

// 查询币币的当前委托
export const querybbEntrust = function (obj) {
  return axiospost('/transaction/bbtrade/search_entrust_orders', obj)
}
// 查询币币的历史委托
export const bbEntrustHistory = function (obj) {
  return axiospost('/transaction/bbtrade/search_bills', obj)
}

// 币币的买入卖出
export const tradePairs = function (obj) {
  return axiospost('/transaction/bbtrade/create_entrust_order', obj, {loading: true})
}
// 币币的撤单
export const entrustCancel = function (obj) {
  return axiospost('/transaction/bbtrade/cancel_entrust_order', obj)
}

// k线图数据
export function getKlines({ rangeType, pairName, startTime, endTime, limit = 500 }) {
  return axiospost('/bbtrade/pair/klines', { rangeType, pairName, startTime, endTime, limit })
}

// 获取委托单
export function getEntrustOrders({ pairName, isBuy, status, page, pageCount }) {
  return axiospost('/transaction/bbtrade/search_entrust_orders', {
    pairName,
    isBuy,
    status,
    page,
    pageCount
  })
}

// 用户设置自选交易对
export const configUserPair = function(obj) {
  return axiospost('/bbtrade/mark_pair', obj)
}

// 用户获取自选交易对
export const getUserConfigPairs = function(obj) {
  return axiospost('/bbtrade/mark_info', obj)
}
