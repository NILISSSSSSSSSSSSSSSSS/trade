import { axiospost } from './axios'

// 用户的流水账
export function accountJournal({currency, bizId, bizType, startTime, endTime, page, limit}) {
  return axiospost('/account/journal', {currency, bizId, bizType, startTime, endTime, page, limit})
}

// 查询某币种的充值地址
export function depositsAddress(currencyId) {
  return axiospost('/account/deposits_wallets', {
    currencyId: currencyId
  })
}
