<template>

  <div  class="console-container">

    <div class='view-options'>
      <div class='view-option-button' @click="run()" />
    </div>
    <div v-if="!currentTool">
        Select a tool to get started
    </div>
    <div v-else :class="['view-contanier', toolRunning === 'Run' ? 'view-console': 'view-info']" >
          Current Tool: {{ currentTool}}
          <sniffer v-if="currentTool === 'PcapSniffer'" v-bind:packets="packets"> </sniffer>
          <network-info v-if="currentTool === 'NetworkInfo'" v-bind:packets="packets"> </network-info>
    </div>

  </div>

</template>

<script>
import Sniffer from '../tools/Sniffer'
import NetworkInfo from '../tools/NetworkInfo'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'Console',
  props: ['packets','views'],
  created () {
  },
  data () {
    return {
      noToolSelected: true
    }

  },
  components:{
    Sniffer,
    NetworkInfo
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
