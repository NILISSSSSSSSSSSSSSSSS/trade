import $http from '@/plugins/chat.axios'
let baseUrl = 'http://192.168.0.207:3000'

export const getGroupList = () => {
  return $http.get(`/api/v1/groups.list`, {
    ignoreToken: true
  })
}

export const getGroupHistoryList = (params) => {
  return $http.get(`/api/v1/groups.history`, {
    params: params,
    ignoreToken: true
  })
}

export const sendMessage = (message) => {
  return $http.post(`/api/v1/chat.sendMessage`, {
    message
  })
}
