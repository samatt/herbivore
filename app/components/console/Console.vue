<template>

  <div  class="console-container">
    <div v-if="!currentTool">
        Select a tool to get started
    </div>
    <div v-else :class="['view-contanier', toolRunning === 'Run' ? 'view-console': 'view-info']" >
          <sniffer v-if="currentTool === 'PcapSniffer'"> </sniffer>
          <network v-if="currentTool === 'Network'"> </network>
          <info v-if="currentTool === 'Info'"> </info>
    </div>

  </div>

</template>

<script>
import Sniffer from '../tools/Sniffer'
import Info from '../tools/Info'
import Network from '../tools/Network'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'Console',
  props: ['views'],
  created () {
    this.run()
  },
  data () {
    return {
      noToolSelected: true
    }

  },
  components:{
    Sniffer,
    Network,
    Info
  },
  filters:{
  },
  computed: mapGetters({
    currentTool: 'currentTool',
    toolRunning: 'toolRunning'
  }),
  methods:{
    run () {
      if( this.toolRunning && this.currentTool ){
        this.$store.dispatch('stop')
        this.$socket.emit('stop')
      }
      else if( this.currentTool){
        this.$store.dispatch('start')
        this.$socket.emit('start')
      }

    }

  }
}
</script>

<style scoped>

</style>
