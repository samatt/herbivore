<template>
  <div v-if="toolRunning">
  The info tool is running
  </div>
  <div v-else>
      <div>
        Type of Connection: {{ type}}
      </div>
      <div>
        Num devices on network: {{ this.nodes.length - 1}}
      </div>
      <div>
        This computers MAC address: {{ mac }}
      </div>
      <div>
        Network Interface: {{ this.interface}}
      </div>
      <div>
          IP on local network{{ privateIp }}
      </div>
      <div>
          Public IP :{{ publicIp}}
      </div>
      <div>
          Router IP: {{ gateway}}
      </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {toolNameFilter} from '../../filters'

export default {
  name: 'Info',
  created () {
  },
  data () {
    return {
     selectedIdx: "",
    }
  },
  computed: mapGetters({
    toolRunning: 'toolRunning',
    mac: 'mac',
    privateIp: 'privateIp',
    publicIp: 'publicIp',
    gateway: 'gateway',
    interface: 'interface',
    netmask: 'netmask',
    type: 'type',
    nodes: 'nodes'
  }),
  filters:{
    toolNameFilter
  }
}
</script>

<style scoped>

</style>
