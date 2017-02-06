import * as types from '../mutation-types'

const state = {
  packets: []
}

const getters = {
  packets: state => state.packets
}

const actions = {
  newPacket ({ commit, state }, packet) {
    commit(types.NEW_PACKET, packet)
  },
  clearSnifferInfo ({ commit, state }, packet) {
    commit(types.CLEAR_SNIFFER_INFO, packet)
  }
}

const mutations = {
  [types.NEW_PACKET] (state, packet) {
    state.packets.push(packet)
  },
  [types.CLEAR_SNIFFER_INFO] (state, packet) {
    state.packets = []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
