import createPersistedState from 'vuex-persistedstate'
let session = {
  key: 'vuex',
  storage: window.sessionStorage,
  reducer (val) {
    return {
      common: val.common
    }
  }
}

let local = {
  key: 'vuex',
  storage: window.localStorage,
  reducer (val) {
    return {
    }
  }
}
export default async ({ app, store }) => {
  createPersistedState(session)(store)
  createPersistedState(local)(store)
}
