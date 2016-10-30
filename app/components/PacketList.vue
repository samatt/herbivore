<template>
  <div id="packet-list-container">
    <ul id="packet-list">
      <li :class="[index == selectedIndex ? activeClass : '',
                   index == hoverIndex ? hoverClass : '']"
          v-for="(packet, index) in packets"
          @click="updateCurrent(packet, index)"
          @keyup.up="updateHover(index)">
        {{ packet.ts | prettifyTs}} {{packet.eth.shost.addr | stringifyMac}} -> {{packet.eth.dhost.addr | stringifyMac}}
      </li>
    </ul>

      <stack  v-if="packets.length > 1" :packet="selectedPacket"></stack>
      <div v-else> Go to some http sites in your browser! eg: nytimes.com</div>
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
     selectedPacket: {},
     selectedIndex: -1,
     hoverIndex: -1,
     activeClass: 'active',
     hoverClass: 'hovered'
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
    updateCurrent (packet, index) {
      this.selectedPacket = packet;
      this.selectedIndex = index;
      this.hoverIndex = index;
    },
    updateHover (index){
      this.hoverIndex = index;
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
  max-height: 150px;
  border-color: #2c3e50;
  border-style: solid;
  border-width: thin;
  overflow: scroll;
}
.active{
  color:red;
}
.hovered{
  background-color: #2c3e50;
  color: white;
}
</style>
