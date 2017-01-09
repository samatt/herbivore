import * as types from '../mutation-types'

const state = {
  mac: null,
  privateIp: null,
  publicIp: null,
  gateway: null,
  interface: null,
  netmask: null,
  type: null,
  nodes:[],
  clickedNode: null
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
  nodes: state => state.nodes,
  clickedNode: state => state.clickedNode
}

// actions
const actions = {
  updateNetworkInfo ({ commit, state }, info) {
    commit(types.UPDATE_NETWORK_INFO, info)
  },
  updatePublicIp ({ commit, state }, ip) {
    commit(types.UPDATE_PUBLIC_IP, ip)
  },
 updateClickedNode ({ commit, state }, node) {
    commit(types.UPDATE_CLICKED_NODE, node)
  },
 updateRouterMac ({ commit, state }, mac) {
    commit(types.UPDATE_ROUTER_MAC, mac)
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

    const gn = {ip: state.gateway, mac:'', "id": 0, router: true }
    const n = {ip: state.privateIp, mac: state.mac, "id": 1, router: false }
    state.nodes.push(gn)
    state.nodes.push(n)
  },
  [types.UPDATE_PUBLIC_IP] (state, ip) {
    state.publicIp = ip
  },
  [types.UPDATE_CLICKED_NODE] (state, node) {
    state.clickedNode = node
  },
  [types.ADD_NEW_NODE] (state, node) {
    state.nodes.push(node)
  },
  [types.UPDATE_ROUTER_MAC] (state, mac) {
    state.nodes[0].mac = mac
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}