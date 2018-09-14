import { axiospost } from './axios'
import { legalUrl as url } from '@/plugins/config'

// 根据法币和语言获取行情 - 侧边
export function quotes(obj) {
  return axiospost(`${url}/quotes/v1/find`, obj)
}
// 广告查询
export function adQueryVip(obj) {
  return axiospost(`/ads_list/c2c`, obj)
}
// 创建订单
export function createOrder(obj) {
  return axiospost(`/otc/buy_in`, obj, {loading: true})
}
// 获取最新订单
export function getHotOrders(obj) {
  return axiospost(`${url}/v1/hotOrders`, obj)
}
