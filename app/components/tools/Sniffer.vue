<template>
  <div v-if="!toolRunning">
    This is the packet sniffer.
    Currently it is only sniffing HTTP packets
  </div>
  <div v-else>
    <ul id="packet-list">
      <li :id="'p-idx-'+index"
          :class="[index == selectedIndex ? activeClass : '',
                   index == hoverIndex ? hoverClass : '']"
          v-for="(packet, index) in packets"
          @click="updateCurrent(packet, index)">
        {{ packet.ts | prettifyTs}} {{packet.eth.shost.addr | stringifyMac}} -> {{packet.eth.dhost.addr | stringifyMac}}
      </li>
    </ul>
  </div>

</template>

<script>
import {stringifyMac, prettifyTs} from '../../filters'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'sniffer',
  props: ['packets'],
  created () {
    window.addEventListener('keyup', this.keyup)
    this.$socket.emit('init')
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
  computed: mapGetters({
    toolRunning: 'toolRunning'
  }),
  components:{
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

</style>
