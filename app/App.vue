<template>
  <div id="app">
    <ToolBar v-on:select="selectView"
             v-bind:tools="tools"
             > </ToolBar>
    <Console v-bind:views="views"></Console>
    <!-- <sniffer v-bind:packets="packets"></sniffer> -->
  </div>
</template>

<script>
import Console from './components/Console'
import ToolBar from './components/ToolBar'

export default {
  name: 'app',
  props: ['packets'],
  components: {
    Console,
    ToolBar
  },
  data () {
    return {
     tools: ['Stats','Sniffer', 'MITM', 'ARP'],
     views: ['Console','Info'],
     currentTool:''
    }

  },
  methods:{
    onEnter () {
      console.log('ENTER')
    },
    selectView (name) {
      // this.currentTool = name
    }
  }
}
</script>
<style lang="sass" src="../styles/main.scss"></style>
