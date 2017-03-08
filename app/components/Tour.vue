<template>
  <div>
    <!-- need to find photon class for header status bar-->
    <div class="status-bar">
      <p>Tour Mode</p>
    </div>
    <div class="modal">
      <span>Herbivore shows you...</span>
      <span class="modal count"></span>
      <span class="button"></span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Tour',
  created () {
  },
  data () {
    return {
      selectedIdx: ''
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
