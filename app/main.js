import Vue from 'vue'
import store from './store'
import App from './App'
import VueSocketio from 'vue-socket.io'
import {mapGetters} from 'vuex'
8
import  VueD3 from  'vue-d3'
Vue.use(VueD3)
Vue.use(VueSocketio, 'http://localhost:7777')


/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App v-bind:vdata="vdata"/>',
  store,
  components: { App },
  data () {
    return {
      vdata: {nodes:[], links:[]}
    }
  },
  computed: mapGetters({
      gateway:'gateway',
      privateIp:'privateIp',
      mac: 'mac'
  }),
  sockets: {
    connect: function () {
      console.log('socket connected!')
      this.list()
    },
    info: function(info) {
      this.$store.dispatch('updateNetworkInfo', info)
    },
    updatePublicIp: function(ip) {
      this.$store.dispatch('updatePublicIp', ip)
    },
    listTools: function(toolnames){
      // console.log(`tools: ${toolnames}`)
      this.$store.dispatch('listTools', toolnames)

    }
  },
  methods:{
    list: function(){
      this.$socket.emit('list')
    }
  }
})
