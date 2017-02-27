<template>
  <div id="app" class="window">
    <ToolBar/>
    <div class="window-content">
      <div class='pane-group'>
        <div class="pane-mini pane-sm sidebar">
          <NavMenu/>
        </div>
        <div v-if="correctPermission || currentTool !=='Sniffer'" class="pane">
          <VizTree/>
          <Console v-if="connected || currentTool =='Info'"></Console>
          <div v-else><p> Ajooba can't detect an internet connection. This tool is useless without it. Please connect to the internet and try again. </p> </div>
        </div>
        <div v-else class="pane">
          <p>
          To run the Packet Sniffer you need to change permissions to /dev/bpf*
          Open up a terminal and type: <span >sudo chmod o+r /dev/bpf*</span>
          This allows the app to read packets from the network interface
          </p>
        </div>
      </div>
    </div>
    <InfoBar/>
  </div>
</template>

<script>

import NavMenu from './components/NavMenu'
import ToolBar from './components/ToolBar'
import InfoBar from './components/InfoBar'
import VizTree from './components/viz/VizTree'
// import Viz from './components/viz/Viz'
import Console from './components/Console'
import { mapGetters } from 'vuex'

export default {
  name: 'app',
  props: [],
  components: {
    NavMenu,
    Console,
    ToolBar,
    InfoBar,
    VizTree
  },
  created () {
    // Step 1
    this.$store.dispatch('changeTool', 'Network')
    this.$socket.emit('load', 'Network')
    this.run()
  },
  data () {
    return {
      currentTool: ''
    }
  },
  computed: mapGetters({
    connected: 'connected',
    toolRunning: 'toolRunning',
    currentTool: 'currentTool',
    correctPermission: 'correctPermission'
  }),
  methods: {
    run () {
      if (this.currentTool) {
        this.$store.dispatch('stop')
        this.$socket.emit('stop')
      } else {
        this.$store.dispatch('start')
        this.$socket.emit('start')
      }
    }
  }
}
</script>
<style lang="css" src="../styles/photon.css"></style>
<!-- <style lang="sass" src="../styles/main.scss"></style> -->

