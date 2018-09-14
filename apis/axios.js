import $http from '@/plugins/axios.js'

export function axiosget(url, options, loading) {
  return $http.get(url, {
    params: options,
    loading: loading
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })
}

export function axiospost(url, options, config) {
  return $http.post(url, options, config).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })
}

export function axiosdelete(url, options, loading) {
  return $http.delete(url, {
    data: options,
    loading: loading
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })
}

export function axiosput(url, options, config) {
  return $http.put(url, options, config).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })
}
