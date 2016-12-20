<template>
  <div v-if="toolRunning">
  The info tool is running
  </div>
  <div v-else>
    This is the Info tool
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
    table: 'table'
  }),
  filters:{
    toolNameFilter
  }
}
</script>

<style scoped>

</style>
