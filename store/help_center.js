
export const state = () => ({
  HIDE_HELP_CENTER_TITLE: false,
  tags: [],
  content: ''
})
export const mutations = {
  SET_HIDE_HELP_CENTER_TITLE (state, payload) {
    state.HIDE_HELP_CENTER_TITLE = payload
  },
  SET_TAGS(state, payload) {
    state.tags = payload
  },
  SET_CONTENT (state, payload) {
    state.content = payload
  }
}
export const actions = {
  SET_HIDE_HELP_CENTER_TITLE ({commit}, payload) {
    commit('SET_HIDE_HELP_CENTER_TITLE', payload)
  }
}
