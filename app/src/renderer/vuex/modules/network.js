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
    publicIp: null,
    maxPossibleDevices: null
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
  devices: state => state.devices,
  maxPossibleDevices: state => state.network.maxPossibleDevices,
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
  },
  setPublicIp ({commit, state}, ip) {
    commit(types.SET_PUBLIC_IP, ip)
  },
  maxPossibleDevices ({commit, state}, max) {
    commit(types.SET_MAX_POSSIBLE_DEVICES, max)
  }
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
    if (d.router) {
      state.network.gateway.mac = d.mac
      state.network.gateway.vendor = d.vendor
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
  },
  [types.SET_PUBLIC_IP] (state, ip) {
    state.network.publicIp = ip
  },
  [types.SET_MAX_POSSIBLE_DEVICES] (state, max) {
    state.network.maxPossibleDevices = max
  }
}

export default {
  actions,
  getters,
  state,
  mutations
}
