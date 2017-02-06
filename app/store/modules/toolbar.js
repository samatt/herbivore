import * as types from '../mutation-types'

const state = {
  currentTool: null,
  currentView: null,
  toolRunning: null,
  toolNames: ['Network', 'Sniffer']
}

const getters = {
  currentTool: state => state.currentTool,
  currentView: state => state.currentView,
  toolRunning: state => state.toolRunning,
  toolNames: state => state.toolNames
}

const actions = {
  listTools ({ commit, state }, toolnames) {
    commit(types.LIST_TOOLS, toolnames)
  },
  changeTool ({ commit, state }, newSelection) {
    commit(types.TOOL_CHANGE_REQUEST, newSelection)
  },
  start ({ commit, state }) {
    commit(types.START_TOOL)
  },
  stop ({ commit, state }) {
    commit(types.STOP_TOOL)
  },
  clearToolbarInfo ({ commit, state }) {
    commit(types.CLEAR_TOOLBAR_INFO)
  }
}

const mutations = {
  [types.LIST_TOOLS] (state, toolnames) {
    state.toolNames = toolnames
  },
  [types.TOOL_CHANGE_REQUEST] (state, newSelection) {
    state.currentTool = newSelection
  },
  [types.START_TOOL] (state) {
    state.toolRunning = true
  },
  [types.STOP_TOOL] (state) {
    state.toolRunning = false
  },
  [types.CLEAR_TOOLBAR_INFO] (state) {
    state.currentTool = null
    state.currentView = null
    state.toolRunning = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
