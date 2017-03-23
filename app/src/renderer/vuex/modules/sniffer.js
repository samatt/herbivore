import * as types from '../mutation-types'

const state = {
  packets: [],
  running: false
}

const getters = {
  packets: state => state.packets,
  running: state => state.running
}

const actions = {
  newPacket ({ commit, state }, packet) {
    commit(types.NEW_PACKET, packet)
  },
  clearPackets ({ commit, state }) {
    console.log('here')
    commit(types.CLEAR_PACKETS)
  },
  startSniffer ({ commit, state }) {
    commit(types.START_SNIFFER)
  },
  stopSniffer ({ commit, state }) {
    commit(types.STOP_SNIFFER)
  }
}

const mutations = {
  [types.NEW_PACKET] (state, packet) {
    state.packets.push(packet)
  },
  [types.CLEAR_PACKETS] (state) {
    state.packets = []
  },
  [types.START_SNIFFER] (state) {
    state.running = true
  },
  [types.STOP_SNIFFER] (state) {
    state.running = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
