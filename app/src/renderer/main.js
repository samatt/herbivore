import Vue from 'vue'
import Electron from 'vue-electron'
import Resource from 'vue-resource'
import App from './App'
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './vuex/store'
// import filters from './filters'

Vue.use(Electron)
Vue.use(Resource)

Vue.config.debug = true

sync(store, router)

// Object.keys(filters).forEach(key => {
//   Vue.filter(key, filters[key])
// })
/* eslint-disable no-new */
new Vue({
  router,
  store,
  ...App
}).$mount('#app')
