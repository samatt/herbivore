<template>

<!--   <ul id="packet-list">
    <li :id="'p-idx-'+index"
        :class="[index == selectedIndex ? activeClass : '',
                 index == hoverIndex ? hoverClass : '']"
        v-for="(packet, index) in packets"
        @click="updateCurrent(packet, index)">
      {{ packet.ts | prettifyTs}} {{packet.eth.shost.addr | stringifyMac}} -> {{packet.eth.dhost.addr | stringifyMac}}
    </li>
  </ul> -->

  <table class="table">
    <thead>
    <tr>
      <th>Timestamp</th>
<!--       <th>Source MAC</th>
      <th>Destination MAC</th> -->
      <th>Source IP</th>
      <th>Destination IP</th>
      <th>Source Port</th>
      <th>Destination Port</th>
      <th>Payload</th>

    </tr>
  </thead>
  <tbody>
    <tr
        v-for="packet in packets">
      <td>  {{ packet.ts | prettifyTs}}</td>
<!--       <td>{{packet.eth.shost.addr | stringifyMac}}</td>
      <td>{{packet.eth.dhost.addr | stringifyMac}}</td> -->
      <td>{{packet.ip.saddr | stringifyIp}}</td>
      <td>{{packet.ip.daddr | stringifyIp}}</td>
      <td>{{packet.tcp.sport }}</td>
      <td>{{packet.tcp.dport }}</td>
      <td>{{packet.payload }}</td>
    </tr>
  </tbody>
  </table>

</template>

<script>
import {stringifyMac, prettifyTs, stringifyIp} from '../../filters'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'sniffer',
  props: [],
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
    toolRunning: 'toolRunning',
    packets: 'packets'
  }),
  components:{
  },
  filters:{
    stringifyMac,
    stringifyIp,
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
          const cur = document.getElementsByClassName('hovered')[0];
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
