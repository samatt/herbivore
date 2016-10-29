<template>
  <div id="packet-list-container">
    <ul id="packet-list">
      <li v-for="packet in packets" @click="updateCurrent(packet)">
        {{ packet.ts | prettifyTs}} {{packet.eth.shost.addr | stringifyMac}} -> {{packet.eth.dhost.addr | stringifyMac}}
      </li>
    </ul>

      <stack  v-if="packets.length > 1" :packet="currentPacket"></stack>
  </div>

</template>

<script>
import {stringifyMac, prettifyTs} from '../filters'
import Stack from './Stack'

export default {
  name: 'packetList',
  props: ['packets'],
  data () {
    return {
     currentPacket: {}
    }


  },
  components:{
    Stack
  },
  filters:{
    stringifyMac,
    prettifyTs
  },
  methods: {
    updateCurrent (packet) {

      this.currentPacket = packet
      console.log(this.currentPacket)
    }
  }
}
</script>

<style>
#packet-list {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  max-height: 300px;
  overflow: scroll;
}
</style>
