<template>
  <div v-if="toolRunning">
  Type of Connection{{ type}}
  </br> Num devices on network: {{ this.nodes.length}}
  </br> Mac: {{ mac }}
  </br>Network Interface: {{ this.interface}}
  </br>IP on local network{{ privateIp }}
  </br>Public IP :{{ publicIp}}
  </br>Router IP: {{ gateway}}

  </div>
  <div v-else>
    Use this tool to get information about your current network
  </div>

  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {toolNameFilter} from '../../filters'

export default {
  name: 'Network',
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
