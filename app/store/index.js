import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import toolbar from './modules/toolbar'
import networkInfo from './modules/network_info'
// import createLogger from 'vuex/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    toolbar,
    networkInfo
  },
  strict: debug,
  plugins: []
})
