import * as types from './mutation-types'

export const clearAllState = ({ commit }) => {
  commit(types.CLEAR_NETWORK_INFO)
  commit(types.CLEAR_TOOLBAR_INFO)
  commit(types.CLEAR_SNIFFER_INFO)
}
