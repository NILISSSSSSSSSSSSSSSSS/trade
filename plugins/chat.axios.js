import * as axios from 'axios'
var options = {
  baseURL: process.client && (window.$chat_baseUrl || 'http://192.168.0.207:3000'),
  timeout: 20 * 1000
}

let api = axios.create(options)
api.interceptors.request.use(function (config) {
  let id = window.$chat_loginInfo.id
  let token = window.$chat_loginInfo.token
  config.headers['X-User-Id'] = id
  config.headers['X-Auth-Token'] = token
  console.log('chat.axios.js')
  return config
}, function (error) {
  return Promise.reject(error)
})

api.interceptors.response.use(function (response) {
  return response.data
}, function (error) {
  return Promise.reject(error)
})
export default api
