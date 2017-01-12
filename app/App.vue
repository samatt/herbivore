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
      </div>
    </div>
  </div>
</template>

<script>

import ToolBar from './components/tool-bar/ToolBar'
import Viz from './components/viz/Viz.vue'
import Console from './components/console/Console'

export default {
  name: 'app',
  props: [],
  components: {
    ToolBar,
    Console,
    Viz
  },
  data () {
    return {
     currentTool:''
    }
  },
  methods:{
    onEnter () {
      console.log('ENTER')
    }
  }
}
</script>
<style lang="css" src="../styles/photon.css"></style>
<!-- <style lang="sass" src="../styles/main.scss"></style> -->

