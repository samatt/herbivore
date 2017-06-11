import * as types from '../mutation-types'

const state = {
  sidebar: {
    opened: false
  },
  message: null,
  notification: {
    level: '',
    body: ''
  },
  effect: {
    translate3d: true,
    reversed: false
  }
}

const getters = {
  effect: state => state.effect,
  reversed: state => state.effect.reversed,
  sidebar: state => state.sidebar,
  message: state => state.message,
  notification: state => state.notification
}

const mutations = {

  [types.TOGGLE_SIDEBAR] (state, opened) {
    state.sidebar.opened = opened
  },
  [types.NEW_MESSAGE] (state, msg) {
    // const m = {level: level, body: msg}
    state.message = msg
  },
  [types.NEW_NOTIFICATION] (state, notification) {
    // const n = {level: level, body: notification}
    state.notification = notification
  },
  [types.SWITCH_EFFECT] (state, effectItem) {
    for (let name in effectItem) {
      state.effect[name] = effectItem[name]
    }
  },
  [types.REVERSE_ANIMATION] (state, isReversed) {
    state.effect.reversed = isReversed
  }
}
const actions = {
  newMessage ({commit, state}, msg) {
    commit(types.NEW_MESSAGE, msg)
  },
  reverseAnimation ({commit, state}, msg) {
    commit(types.REVERSE_ANIMATION, msg)
  },
  newNotification ({commit, state}, notification) {
    commit(types.NEW_NOTIFICATION, notification)
  }
}
export default {
  state,
  mutations,
  getters,
  actions
}
