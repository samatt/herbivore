<template>
  <div id="app">
    <ToolBar> </ToolBar>
    <Console></Console>
  </div>
</template>

<script>
import Console from './components/console/Console'
import ToolBar from './components/tool-bar/ToolBar'


export default {
  name: 'app',
  props: [],
  components: {
    Console,
    ToolBar,
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
<style lang="sass" src="../styles/main.scss"></style>

