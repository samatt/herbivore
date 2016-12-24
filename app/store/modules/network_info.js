import * as types from '../mutation-types'

const state = {
  mac: null,
  privateIp: null,
  publicIp: null,
  gateway: null,
  interface: null,
  netmask: null,
  type: null,
  nodes:[]
}
//vdata obj because: https://github.com/d3/d3-force/issues/32

// getters
const getters = {
  mac: state => state.mac,
  privateIp: state => state.privateIp,
  publicIp: state => state.publicIp,
  gateway: state => state.gateway,
  gateway: state => state.gateway,
  interface: state => state.interface,
  netmask: state => state.netmask,
  type: state => state.type,
  nodes: state => state.nodes
}

// actions
const actions = {
  updateNetworkInfo ({ commit, state }, info) {
    commit(types.UPDATE_NETWORK_INFO, info)
  },
  updatePublicIp ({ commit, state }, ip) {
    commit(types.UPDATE_PUBLIC_IP, ip)
  },
  addNewNode ({ commit, state }, node) {
    commit(types.ADD_NEW_NODE, node)
  }

}

// mutations
const mutations = {
  [types.UPDATE_NETWORK_INFO] (state, info) {
    let {private_ip, iface, gateway, netmask, mac, type} = info
    state.mac = mac
    state.privateIp = private_ip
    state.gateway = gateway
    state.interface = iface
    state.netmask = netmask
    state.type = type

    const gn = {ip: state.gateway, mac:'', "id": 0 }
    const n = {ip: state.privateIp, mac: state.mac, "id": 1 }
    state.nodes.push(gn)
    state.nodes.push(n)
  },
  [types.UPDATE_PUBLIC_IP] (state, ip) {
    state.publicIp = ip
  },
  [types.ADD_NEW_NODE] (state, node) {
    state.nodes.push(node)
  },

}

export default {
  state,
  getters,
  actions,
  mutations
}