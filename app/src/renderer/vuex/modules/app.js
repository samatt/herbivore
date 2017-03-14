import * as types from '../mutation-types'

const state = {
  sidebar: {
    opened: false
  },
  effect: {
    translate3d: true
  }
}

const getters = {
  effect: state => state.effect,
  sidebar: state => state.sidebar
}

const mutations = {

  [types.TOGGLE_SIDEBAR] (state, opened) {
    state.sidebar.opened = opened
  },

  [types.SWITCH_EFFECT] (state, effectItem) {
    for (let name in effectItem) {
      state.effect[name] = effectItem[name]
    }
  }
}

export default {
  state,
  mutations,
  getters
}
