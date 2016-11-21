<template>
  <div id="packet-list-container">
    <ul id="packet-list">
      <li :id="'p-idx-'+index"
          :class="[index == selectedIndex ? activeClass : '',
                   index == hoverIndex ? hoverClass : '']"
          v-for="(packet, index) in packets"
          @click="updateCurrent(packet, index)">
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
  created () {
    window.addEventListener('keyup', this.keyup)
    // window.addEventListener('keydown', this.down)
  },
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
    keyup (e) {
      //DOWN
      if((e.keyCode || e.which) === 40 ){
        if(this.hoverIndex < this.packets.length){
            this.hoverIndex += 1;
        }
        if(document.getElementsByClassName('hovered')){
          const cur =   document.getElementsByClassName('hovered')[0];
          if(cur){
            const id = cur.id.split('-')
            const index =id.pop()
            this.selectedPacket = this.packets[index];
            cur.scrollIntoViewIfNeeded({block: "end", behavior: "smooth"});
          }

        }
      }
      //UP
      else if((e.keyCode || e.which) === 38 ){
        if(this.hoverIndex > 0){
            this.hoverIndex -= 1;
        }
        if(document.getElementsByClassName('hovered')){
          const cur =   document.getElementsByClassName('hovered')[0];
          if(cur){
            const id = cur.id.split('-')
            const index =id.pop()
            this.selectedPacket = this.packets[index];
            cur.scrollIntoViewIfNeeded({block: "end", behavior: "smooth"});
          }

        }
      }
      else if((e.keyCode || e.which) === 13 ){
        if(document.getElementsByClassName('hovered')){
          const cur =   document.getElementsByClassName('hovered')[0];
          if(cur){
            const id = cur.id.split('-')
            const index =id.pop()
            this.selectedPacket = this.packets[index];
          }
        }
      }

    }
  }
}
</script>

<style scoped>
#packet-list {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /*color: #2c3e50;*/
  margin-top: 60px;
  max-height: 150px;
  border-color: #2c3e50;
  border-style: solid;
  border-width: thin;
  overflow: scroll;
}
.active{
}
.hovered{
  background-color: #2c3e50;
  color:red;
}
</style>
