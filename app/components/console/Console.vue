<template>

  <div  class="console-container">
    <div v-if="!currentTool">
        Select a tool to get started
    </div>
    <div v-else :class="['view-contanier', toolRunning === 'Run' ? 'view-console': 'view-info']" >
          <sniffer v-if="currentTool === 'PcapSniffer'" v-bind:packets="packets"> </sniffer>
          <network v-if="currentTool === 'Network'" v-bind:packets="packets"> </network>
          <info v-if="currentTool === 'Info'" v-bind:packets="packets"> </info>
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
  props: ['packets','views'],
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
