import * as types from '../mutation-types'

const state = {
  currentTool: null,
  currentView: null,
  toolNames: []
}

// getters
const getters = {
  currentTool: state => state.currentTool,
  currentView: state => state.currentView,
  toolNames: state => state.toolNames
}

// actions
const actions = {
  listTools ({ commit, state }, toolnames) {
    commit(types.LIST_TOOLS, toolnames)
  },
  changeTool ({ commit, state }, newSelection) {
    commit(types.TOOL_CHANGE_REQUEST, newSelection)
  },
  changeView ({ commit, state }, newSelection) {
    commit(types.VIEW_CHANGE_REQUEST, newSelection)
  }
}

// mutations
const mutations = {
  [types.LIST_TOOLS] (state, toolnames ) {
    state.toolNames = toolnames
  },
  [types.TOOL_CHANGE_REQUEST] (state, newSelection ) {
    state.currentTool = newSelection
  },
  [types.VIEW_CHANGE_REQUEST] (state, newSelection ) {
    state.currentView = newSelection
  }

}

export default {
  state,
  getters,
  actions,
  mutations
}