import {axiospost} from './axios'

// 获取验证码
export const getVertifyCode = function(obj) {
  return axiospost("/default/sendVerifyCodeWithServiceName", obj)
}
