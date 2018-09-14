import { axiospost } from './axios'
import { legalUrl as url } from '@/plugins/config'

// 获取用户订单信息（成交记录）
export const userOrders = ({
  isC2C,
  queryType,
  page,
  limit
}) => {
  return axiospost('/entrust/my_order', { isC2C, queryType, page, limit })
}

// 创建订单
export function createOrder({ adId, isC2C, tradeCurrencyAmount }) {
  return axiospost(`${url}/v1/order`, { adId, isC2C, tradeCurrencyAmount })
}

// 根据订单id修改订单状态（如：我已付款）
export function orderPay({ id, assestsPass }) {
  return axiospost('/otc/order_status', { id, assestsPass }, {loading: true})
}

// 订单结算（OTC确认收款/C2C我已收款/C2C我已付款）
export function orderReceiverPay({ id, assestsPass }) {
  return axiospost('/otc/order_bill', { id, assestsPass }, {loading: true})
}

// 订单取消
export function orderCancle({ id }) {
  return axiospost('/otc/destroy_order', { id }, {loading: true})
}
