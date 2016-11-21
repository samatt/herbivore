<template>
  <div id="app">
    <ToolBar v-bind:tools="tools"
             v-bind:views="views"> </ToolBar>
    <packet-list v-bind:packets="packets"></packet-list>
  </div>
</template>

<script>
import PacketList from './components/PacketList'
import ToolBar from './components/ToolBar'

export default {
  name: 'app',
  props: ['packets'],
  components: {
    PacketList,
    ToolBar
  },
  data () {
    return {
     tools: ['Info','Sniffer', 'MITM', 'ARP'],
     views:['Console','Information']
    }

  },
  methods:{
    onEnter () {
      console.log('ENTER')
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
