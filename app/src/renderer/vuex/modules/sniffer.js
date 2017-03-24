import * as types from '../mutation-types'

const state = {
  packets: [],
  running: false,
  inspectorPacket: null
}

const getters = {
  packets: state => state.packets,
  running: state => state.running,
  inspectorPacket: state => state.inspectorPacket
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
  },
  setPacket ({ commit, state }, packet) {
    commit(types.SET_INSPECTOR_PACKET, packet)
  },
  clearPacket ({ commit, state }) {
    commit(types.CLEAR_INSPECTOR_PACKET)
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
  },
  [types.SET_INSPECTOR_PACKET] (state, packet) {
    state.inspectorPacket = packet
  },
  [types.CLEAR_INSPECTOR_PACKET] (state) {
    state.inspectorPacket = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
