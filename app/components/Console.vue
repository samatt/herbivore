<template>
  <div  class="console-container">
    <div v-if="!currentTool">
        Select a tool to get started
    </div>
    <div v-else :class="['view-contanier', toolRunning === 'Run' ? 'view-console': 'view-info']" >
          <sniffer v-if="currentTool === 'Sniffer'"> </sniffer>
          <network v-if="currentTool === 'Network'"> </network>
    </div>
  </div>
</template>

<script>
import Sniffer from './tools/Sniffer'
import Network from './tools/Network'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'Console',
  props: [],
  created () {
  },
  data () {
    return {
      noToolSelected: true
    }
  },
  components:{
    Sniffer,
    Network
  },
  filters:{
  },
  computed: mapGetters({
    currentTool: 'currentTool',
    toolRunning: 'toolRunning'
  }),
  methods:{
  }
}
</script>

<style scoped>

</style>
