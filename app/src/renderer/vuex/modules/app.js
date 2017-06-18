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
  },
  view: {
    names: ['home', 'network', 'sniffer'],
    index: 0
  }
}

const getters = {
  effect: state => state.effect,
  view: state => state.view,
  reversed: state => state.effect.reversed,
  sidebar: state => state.sidebar,
  message: state => state.message,
  notification: state => state.notification
}

const mutations = {
  [types.INCREMENT_VIEW_INDEX] (state) {
    if (state.view.index === state.view.names.length - 1) {
      state.effect.reversed = true
      state.view.index = state.view.names.length - 1
    } else {
      state.view.index += 1
    }
  },
  [types.DECREMENT_VIEW_INDEX] (state) {
    if (state.view.index <= 0) {
      state.view.index = 0
      state.effect.reversed = false
    } else {
      state.view.index -= 1
    }
  },
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
  incViewIndex ({commit, state}, msg) {
    commit(types.INCREMENT_VIEW_INDEX, msg)
  },
  decViewIndex ({commit, state}, msg) {
    commit(types.DECREMENT_VIEW_INDEX, msg)
  },
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
