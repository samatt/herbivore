import * as types from '../mutation-types'

const state = {
  host: {
    ip: null,
    mac: null,
    vendor: null,
    interface: null,
    name: null,
    host: true,
    router: false
  },
  network: {
    gateway: {
      ip: null,
      mac: null,
      vendor: null,
      name: null,
      host: false,
      router: true
    },
    netmask: null,
    publicIp: null
  },
  devices: [],
  error: null
}

const getters = {
  host: state => state.host,
  network: state => state.network,
  gateway: state => state.network.gateway,
  netmask: state => state.network.netmask,
  publicIp: state => state.network.publicIp,
  devices: state => state.network.devices,
  error: state => state.error
}

const actions = {
  setNetworkInfo ({commit, state}, info) {
    commit(types.SET_NETWORK_INFO, info)
  },
  setHostInfo ({commit, state}, info) {
    commit(types.SET_HOST_INFO, info)
  },
  addDevice ({commit, state}, device) {
    commit(types.ADD_DEVICE, device)
  },
  updateName ({commit, state}, device) {
    commit(types.UPDATE_NAME, device)
  }
  // updateGwInfo ({commit, state}, info) {
  //   commit(types.UDPATE_GW_INFO, info)
  // }
}

const mutations = {
  [types.SET_NETWORK_INFO] (state, info) {
    state.network = info
  },
  [types.SET_HOST_INFO] (state, info) {
    state.host = info
    state.devices.push(state.host)
  },
  [types.ADD_DEVICE] (state, device) {
    const d = {
      ip: device.ip,
      mac: device.mac,
      name: '',
      vendor: device.vendor,
      host: false,
      router: device.isRouter
    }
    state.devices.push(d)
  },
  [types.UPDATE_NAME] (state, info) {
    state.devices.forEach(function (d) {
      if (d.ip === info.ip) {
        d.name = info.name
        if (d.router) state.network.gateway.name = info.name
        if (d.host) state.host.name = info.name
      }
    })
  }
  // [types.UPDATE_GW_INFO] (state, info) {
  //   state.network.gateway.mac = info.mac
  //   state.network.gateway.vendor = info.vendor
  //   state.devices.forEach(function (d) {
  //     if (d.mac === info.mac) {
  //       d.vendor = info.vendor
  //       d.mac = info.mac
  //     }
  //   })
  // }
}

export default {
  actions,
  getters,
  state,
  mutations
}
