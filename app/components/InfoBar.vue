<template>
<footer class="toolbar toolbar-footer">
    <div v-if="!connected">
      <span>
        Disconnected
      </span>
      <span>
          Network Interface: Can't detect an active network interface. Make sure you're connected to the internet.
      </span>
    </div>
    <div v-else>
          <div class = "pull-right">
            <span class="padded-horizontally-less">Connection type: {{type}}</span>
            <span class="padded-horizontally-less">Device count: {{ this.nodes.length - 1}}</span>
          </div>
          <div class="pull-left">
            <span class="padded-horizontally-less">Network Interface: {{ this.interface}}</span>
            <span class="padded-horizontally-less">Public IP :{{ publicIp}}</span>
            <span class="padded-horizontally-less">Router IP: {{ gateway}}</span>
          </div>
  </div>


</footer>

</template>
<script>
import {mapGetters} from 'vuex'

export default {
  name: 'InfoBar',
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
    connected: 'connected',
    privateIp: 'privateIp',
    publicIp: 'publicIp',
    gateway: 'gateway',
    interface: 'interface',
    netmask: 'netmask',
    type: 'type',
    nodes: 'nodes'
  })
}
</script>

<style scoped>

</style>
