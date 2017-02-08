<template>
      <nav class="nav-group">
          <h5 class="nav-group-title">Tools</h5>
            <span
              :class="['nav-group-item', index == selectedIdx ? 'active' : '']"
              v-for="(tool, index) in toolNames"
              @click="updateTools(tool, index)">
              <span :class="['icon', icons[tool] ]"></span>
              {{tool | toolNameFilter}}
            </span>
      </nav>
</template>
<script>

import {mapGetters} from 'vuex'
import {toolNameFilter} from '../filters'
export default {
  name: 'NavMenu',
  props: [],
  created () {
  },
  data () {
    return {
     selectedIdx: "",
     interfaceUpdated: false,
     icons: {
      'Network': 'icon-search',
      'Info':'icon-info',
      'Sniffer':'icon-signal'
     }
    }
  },
  computed: mapGetters({
    toolNames: 'toolNames',
    privateIp: 'privateIp',
    mac: 'mac',
    gateway: 'gateway',
    gatewayMac: 'gatewayMac',
    target: 'target'
  }),
  components: {
  },
  filters:{
    toolNameFilter
  },
  methods: {
    updateTools (tool, index) {
      this.selectedIdx = index;
      this.$store.dispatch('stop')
      this.$store.dispatch('changeTool', tool)
      this.$store.dispatch('clearClickedLink')
      this.$socket.emit('stop')
      this.$socket.emit('load',tool)

      if( tool === 'Sniffer'){
        if ( this.target ) {
          this.$socket.emit('cmd', 'updateTarget', {'target_ip':this.target.ip,
          'target_mac':this.target.mac,
          'self_mac':this.mac,
          'gw_ip': this.gateway,
          'gw_mac': this.gatewayMac})
        }
        if (!this.interfaceUpdated) {
          this.interfaceUpdated = true;
          this.updateSniffer()
        }
      }
    },
    updateSniffer: function () {
      this.$socket.emit('cmd', 'setLocalInterface', this.privateIp, this.mac)
    }
  }
}
</script>

<style scoped>

</style>
