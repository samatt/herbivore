<template>
  <div id="app" class="window">
    <div class="window-content">
      <div class='pane-group'>
        <div class="pane-mini pane-sm sidebar">
          <ToolBar> </ToolBar>
        </div>
        <div class="pane">
          <Viz></Viz>
          <Console></Console>
        </div>
      <!--  <div v-else class="pane">
            It looks like you're not connected to the internet.
            Unfortunately Ajooba is pretty useless without so comeback when you are connected!
            <Console></Console>
        </div> -->

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
    currentTool: 'currentTool'
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

