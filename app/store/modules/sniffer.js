import * as types from '../mutation-types'

const state = {
  packets: []
}

// getters
const getters = {
  packets: state => state.packets,
}

// actions
const actions = {
  newPacket ({ commit, state }, packet) {
    commit(types.NEW_PACKET, packet)
  }
}

// mutations
const mutations = {
  [types.NEW_PACKET] (state, packet) {
    state.packets.push(packet)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}