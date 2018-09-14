import * as axios from 'axios'
import { Message, Loading } from "element-ui";
import { url } from './config'
import { getCookie } from '@/tools/cookie.js'
import Vue from 'vue'
console.log('----------url-----------', url)
var options = {
  baseURL: url,
  headers: {
    // Accept: '*',
    // "Access-Control-Allow-Headers": "Content-Type"
    // 'Content-Type': 'application/json'
  },
  timeout: 20 * 1000
}

let api = axios.create(options)
let loadingInstance
api.interceptors.request.use(function (config) {
  var token = ""
  // console.log('config-----:', config)
  if (config.loading) {
    loadingInstance = Loading.service({ fullscreen: true });
  }
  if (process.client) {
    token = getCookie('token')
  }
  if (token && !/tradingview\.com/.test(config.url)) {
    if (!config.ignoreToken) {
      config.headers.token = token
    }
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

api.interceptors.response.use(function (response) {
  // Do something with response data
  if (!response.data.success && !/tradingview\.com/.test(response.config.url)) {
    Message({
      showClose: true,
      message: response.data.message,
      type: 'error'
    });
    console.error(`${response.config.url}: ${response.data.message}`)
  }
  if (response.config.loading) {
    loadingInstance && loadingInstance.close()
  }
  return response
}, function (error) {
  Message({
    showClose: true,
    message: error.message,
    type: 'error'
  });
  if (error.config.loading) {
    loadingInstance && loadingInstance.close()
  }
  // Do something with response error
  return Promise.reject(error)
})
export default api
