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
  clearPackets ({ commit, state }, packet) {
    commit(types.CLEAR_PACKETS, packet)
  }
}

const mutations = {
  [types.NEW_PACKET] (state, packet) {
    state.packets.push(packet)
  },
  [types.CLEAR_PACKETS] (state, packet) {
    state.packets = []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
