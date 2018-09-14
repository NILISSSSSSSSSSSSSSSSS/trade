import { axiospost } from './axios'
import { legalUrl as url } from '@/plugins/config'

// 我的广告
// adStatus: online, offline, expire, cancel
export function adQuery({ status, limit, page }) {
  return axiospost(`/ads/mine`, { status, limit, page })
}

// 发布广告
export function pubAd({ tradeType, adType, acceptC2C, currencyId, currencyAmount, legalCurrency, quotationSource,
  overPercent, limitPrice, orderMin, orderMax, allowPay, description, maxOrderLimit }) {
  return axiospost(`${url}/v1/pubAd`, { tradeType, adType, acceptC2C, currencyId, currencyAmount, legalCurrency, quotationSource, overPercent, limitPrice, orderMin, orderMax, allowPay, description, maxOrderLimit })
}

// 广告上架
export function upAd({ adId, currencyAmount }) {
  return axiospost(`/ads/save`, { adId, currencyAmount })
}

// 广告删除
export function adCancel({ id, status }) {
  return axiospost(`/ads/cancel`, { id, status })
}

// 批量删除
export function adCancelAll(ids) {
  return axiospost(`/ads/batch_cancel`, { ids })
}

// 广告下架
export function adUnpub({ id, status }) {
  return axiospost(`/ads/unpub`, { id, status })
}

// otc广告列列表
export function adListOTC({ currencyId, legalCurrency, tradeType, page, limit }) {
  return axiospost('/ads_list/otc', { currencyId, legalCurrency, tradeType, page, limit })
}

// 发布广告
export function adsSave({ currencyId, legalCurrency, tradeType, acceptC2C, quotationSource, overPercent, priceLimit,
  count, countMinLimit, countMaxLimit, orderMaxLimit, payWay, autoReplyMessage, id }) {
  return axiospost('/ads/save', { currencyId, legalCurrency, tradeType, acceptC2C, quotationSource, overPercent: overPercent, priceLimit, count, countMinLimit, countMaxLimit, orderMaxLimit, payWay, autoReplyMessage, id }, { loading: true })
}

// 查询单条广告
export function queryOneAd(id) {
  return axiospost('/ads/query', { id }, { loading: true })
}
