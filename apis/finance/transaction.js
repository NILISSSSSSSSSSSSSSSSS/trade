import { axiosget, axiospost } from '../axios'

// 查询充值记录
export function depositRecords(page, pageSize) {
  return axiospost('/transaction/deposit_records', {
    page: page,
    pageCount: pageSize
  })
}

// 查询提币记录
export function withdrawRecords(page, pageSize) {
  return axiospost('/transaction/withdraw_records', {
    page: page,
    pageCount: pageSize
  })
}

// 提币页面展示的信息
export function preWithdraw(currencyId) {
  return axiospost('/transaction/pre_withdraw', {
    currencyId: currencyId
  })
}

// 提币
export function withdraw({currencyId, amount, to, assestsPass, code, desc}) {
  return axiospost('/transaction/withdraw', {currencyId, amount, to, assestsPass, code, desc}, {loading: true})
}
