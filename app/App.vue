<template>
  <div id="app">
    <ToolBar> </ToolBar>
    <Console v-bind:views="views"></Console>
  </div>
</template>

<script>
import Console from './components/console/Console'
import ToolBar from './components/tool-bar/ToolBar'

export default {
  name: 'app',
  props: ['packets'],
  components: {
    Console ,
    ToolBar
  },
  data () {
    return {
     views: ['Console','Info'],
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
<style lang="sass" src="../styles/main.scss"></style>
