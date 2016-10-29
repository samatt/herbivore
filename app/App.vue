<template>
  <div id="app">
    <packet-list v-bind:packets="packets"></packet-list>
  </div>
</template>

<script>
import PacketList from './components/PacketList'

export default {
  name: 'app',
  props: ['packets'],
  components: {
    PacketList,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
