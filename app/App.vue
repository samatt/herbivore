<template>
  <div id="app">
    <ToolBar v-on:select="selectView"
             v-bind:tools="tools"
             v-bind:views="views"> </ToolBar>
    <Console v-bind:current="currentTool" ></Console>
    <!-- <sniffer v-bind:packets="packets"></sniffer> -->
  </div>
</template>

<script>
// import PacketList from './components/PacketList'
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
      console.log('HERE')

      this.currentTool = name
    }
  }
}
</script>

<style>
/*#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/
</style>

<style lang="sass" src="../styles/main.scss"></style>
