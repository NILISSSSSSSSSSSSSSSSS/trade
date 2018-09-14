import { axiospost } from './axios'

//  获取商家交易统计信息(认证状态)
export function dealInfo() {
  return axiospost('/merchant/stat')
}

// 商家认证申请
export function merchantApplay({ lockUSDTAmount, contact, picUrls }) {
  return axiospost('/merchant/certification/apply', { lockUSDTAmount, contact, picUrls })
}

// 取消商家认证
export function merchantCancel() {
  return axiospost('/merchant/certification/cancel')
}

// 获取商家信息，照片，联系方式等
export function merchantInfo() {
  return axiospost('/merchant/info')
}
