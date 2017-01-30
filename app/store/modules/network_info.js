import * as types from '../mutation-types'

const state = {
  correctPermission: true,
  connected: null,
  mac: null,
  privateIp: null,
  publicIp: null,
  gateway: null,
  vendor: null,
  interface: null,
  netmask: null,
  type: null,
  nodes:[],
  clickedNode: null,
  clickedLink: null
}

const getters = {
  correctPermission: state => state.correctPermission,
  connected: state => state.connected,
  mac: state => state.mac,
  privateIp: state => state.privateIp,
  publicIp: state => state.publicIp,
  gateway: state => state.gateway,
  interface: state => state.interface,
  netmask: state => state.netmask,
  type: state => state.type,
  nodes: state => state.nodes,
  clickedNode: state => state.clickedNode,
  clickedLink: state => state.clickedLink
}

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
 updateClickedLink ({ commit, state }, node) {
    commit(types.UPDATE_CLICKED_LINK, node)
  },
 updateRouterMac ({ commit, state }, mac) {
    commit(types.UPDATE_ROUTER_MAC, mac)
  },
 updateHostname ({ commit, state }, mac) {
    commit(types.UPDATE_HOSTNAME, mac)
  },
  addNewNode ({ commit, state }, node) {
    commit(types.ADD_NEW_NODE, node)
  },
  bpfError ({ commit, state }) {
    commit(types.PERMISSIONS_ERROR_FOUND)
  },
  clearClickedLink ({ commit, state }) {
    commit(types.CLEAR_CLICKED_LINK)
  }
}

const mutations = {
  [types.UPDATE_NETWORK_INFO] (state, info) {
    let {connected, private_ip, iface, gateway, netmask, mac, type, vendor} = info
    state.connected = connected
    if(state.connected){
      state.mac = mac
      state.privateIp = private_ip
      state.gateway = gateway
      state.interface = iface
      state.netmask = netmask
      state.type = type
      state.vendor = vendor
      const gn = {ip: state.gateway, mac:'', "id": 0, router: true, active: false }
      const n = {ip: state.privateIp, mac: state.mac, "id": 1, router: false, active: false, vendor: state.vendor}
      state.nodes.push(gn)
      state.nodes.push(n)
    }
  },
  [types.PERMISSIONS_ERROR_FOUND] (state) {
    state.correctPermission = false
  },
  [types.UPDATE_PUBLIC_IP] (state, ip) {
    state.publicIp = ip
  },
  [types.UPDATE_CLICKED_NODE] (state, node) {
    state.nodes.forEach(function (n) {
      if(n.ip === node.ip){
        n.active = true
      }
      else{
        n.active = false
      }
    })
  },
  [types.UPDATE_CLICKED_LINK] (state, node) {
    let l = state.nodes.filter(function (n) {
              return node.ip === n.ip
            })
    state.clickedLink = {router: state.nodes[0], target: l[0]}
  },
  [types.CLEAR_CLICKED_LINK] (state, node) {
    state.clickedLink = null
  },
  [types.UPDATE_HOSTNAME] (state, node) {
    state.nodes.forEach(function (n) {
      if(n.ip === node.ip){
        n.hostname = node.hostname
      }
    })
  },
  [types.ADD_NEW_NODE] (state, node) {
    node.active = false
    state.nodes.push(node)
  },
  [types.UPDATE_ROUTER_MAC] (state, node) {
    state.nodes[0].mac = node.mac
    state.nodes[0].vendor = node.vendor
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}