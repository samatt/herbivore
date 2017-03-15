import * as types from '../mutation-types'

const state = {
  host: {
    host: true,
    interface: null,
    ip: null,
    mac: null,
    vendor: null,
    name: null,
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
  target: null,
  hover: null,
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
  hover: state => state.hover,
  target: state => state.target,
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
  setHover ({commit, state}, hover) {
    commit(types.SET_HOVER, hover)
  },
  clearHover ({commit, state}) {
    commit(types.CLEAR_HOVER)
  },
  setTarget ({commit, state}, target) {
    commit(types.SET_TARGET, target)
  },
  clearTarget ({commit, state}) {
    commit(types.CLEAR_TARGET)
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
    state.host = {
      host: true,
      interface: info.interface,
      ip: info.ip,
      mac: info.mac,
      vendor: info.vendor,
      name: null,
      router: false
    }
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
  },
  [types.SET_TARGET] (state, target) {
    state.target = target
  },
  [types.SET_HOVER] (state, hover) {
    state.hover = hover
  },
  [types.CLEAR_HOVER] (state) {
    state.hover = null
  },
  [types.CLEAR_TARGET] (state) {
    state.target = null
  }
}

export default {
  actions,
  getters,
  state,
  mutations
}
