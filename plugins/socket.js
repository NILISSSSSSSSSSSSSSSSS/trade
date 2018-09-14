export default {
  sub_keys: [],
  on: function (key, callback) {
    window.$socket.on(key, (data) => {
      callback(data)
    })
  },
  emit: function (key, data) {
    window.$socket.emit(key, data)
  },
  subscribe: function (data) {
    window.$socket.emit('subcrible', data)
    this.sub_keys.push(data.businessName)
  },
  unsubscribe: function (key) {
    window.$socket.emit('unSubcrible', {
      businessName: key
    })
  },
  unsubscribes: function (keys) {
    keys.forEach(key => {
      window.$socket.emit('unSubcrible', {
        businessName: key
      })
    })
  }
}
