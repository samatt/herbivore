<template>
  <div id="app" class="window">
    <div class="window-content">
      <div class='pane-group'>
        <div class="pane-mini pane-sm sidebar">
          <ToolBar> </ToolBar>
        </div>
        <div v-if="correctPermission || currentTool !=='PcapSniffer'" class="pane">
          <Viz v-if="connected"></Viz>
          <Console v-if="connected || currentTool =='Info'"></Console>
          <div v-else><p> Ajooba can't detect an internet connection. This tool is useless without it. Please connect to the internet and try again. </p> </div>
        </div>
       <div v-else class="pane">
          <p>
            To run the Packet Sniffer you need to change permissions to /dev/bpf*<p>
            <p>Open up a terminal and type: <span >sudo chmod o+r /dev/bpf*</span>
            This allows the app to read packets from the network interface
          </p>
       </div>
      </div>
    </div>
  </div>
</template>

<script>

import ToolBar from './components/tool-bar/ToolBar'
import Viz from './components/viz/Viz.vue'
import Console from './components/console/Console'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'app',
  props: [],
  components: {
    ToolBar,
    Console,
    Viz
  },
  created () {
    this.$store.dispatch('changeTool', 'Network')
    this.$socket.emit('load','Network')
    this.run()
  },
  data () {
    return {
     currentTool:''
    }
  },
  computed: mapGetters({
    connected: 'connected',
    toolRunning: 'toolRunning',
    currentTool: 'currentTool',
    correctPermission: 'correctPermission'
  }),
  methods:{
    onEnter () {
      console.log('ENTER')
    },
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
<style lang="css" src="../styles/photon.css"></style>
<!-- <style lang="sass" src="../styles/main.scss"></style> -->

