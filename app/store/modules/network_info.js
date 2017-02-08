import * as types from '../mutation-types'

const state = {
  correctPermission: true,
  connected: null,
  mac: null,
  privateIp: null,
  publicIp: null,
  gateway: null,
  gatewayMac: null,
  vendor: null,
  interface: null,
  netmask: null,
  type: null,
  nodes: [],
  clickedLink: null,
  hoveredNode: null,
  target: null
}

const getters = {
  correctPermission: state => state.correctPermission,
  connected: state => state.connected,
  mac: state => state.mac,
  privateIp: state => state.privateIp,
  publicIp: state => state.publicIp,
  gateway: state => state.gateway,
  gatewayMac: state => state.gatewayMac,
  interface: state => state.interface,
  netmask: state => state.netmask,
  type: state => state.type,
  nodes: state => state.nodes,
  target: state => state.target,
  hoveredNode: state => state.hoveredNode,
  clickedLink: state => state.clickedLink
}

const actions = {
  updateNetworkInfo ({ commit, state }, info) {
    commit(types.UPDATE_NETWORK_INFO, info)
  },
  updatePublicIp ({ commit, state }, ip) {
    commit(types.UPDATE_PUBLIC_IP, ip)
  },
  setTarget ({ commit, state }, node) {
    commit(types.SET_TARGET, node)
  },
  clearTarget ({ commit, state }, node) {
    commit(types.CLEAR_TARGET)
  },
  updateClickedLink ({ commit, state }, node) {
    commit(types.UPDATE_CLICKED_LINK, node)
  },
  setHoverNode ({ commit, state }, node) {
    commit(types.SET_HOVER_NODE, node)
  },
  clearHoverNode ({ commit, state }, node) {
    commit(types.CLEAR_HOVER_NODE)
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
  },
  clearNetworkInfo ({ commit, state }) {
    commit(types.CLEAR_NETWORK_INFO)
  }
}

const mutations = {
  [types.UPDATE_NETWORK_INFO] (state, info) {
    let {connected, privateIp, iface, gateway, netmask, mac, type, vendor} = info
    state.connected = connected
    if (state.connected) {
      state.mac = mac
      state.privateIp = privateIp
      state.gateway = gateway
      state.interface = iface
      state.netmask = netmask
      state.type = type
      state.vendor = vendor
      const gn = { ip: state.gateway, mac: '', id: 0, router: true, active: false }
      const n = { ip: state.privateIp, mac: state.mac, id: 1, router: false, active: false, vendor: state.vendor }
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
  [types.SET_TARGET] (state, node) {
    state.nodes.forEach(function (n) {
      if (n.ip === node.ip) {
        state.target = node
      }
    })
  },
  [types.CLEAR_TARGET] (state) {
    state.target = null
  },
  [types.SET_HOVER_NODE] (state, node) {
    state.nodes.forEach(function (n) {
      if (n.ip === node.ip) {
        n.active = true
        state.hoveredNode = node
      } else {
        n.active = false
      }
    })
  },
  [types.CLEAR_HOVER_NODE] (state) {
    state.hoveredNode = null
    state.nodes.forEach(function (n) {
      n.active = false
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
      if (n.ip === node.ip) {
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
    state.gatewayMac = node.mac
  },
  [types.CLEAR_NETWORK_INFO] (state) {
    state.correctPermission = true
    state.connected = null
    state.mac = null
    state.privateIp = null
    state.publicIp = null
    state.gateway = null
    state.gatewayMac = null
    state.vendor = null
    state.interface = null
    state.netmask = null
    state.type = null
    state.nodes = []

    state.clickedLink = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
