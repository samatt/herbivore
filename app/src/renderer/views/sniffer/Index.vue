<template>
<div>
<div class="sniff-table">
  <table class="table stick">
  </table>
  <table class="table padded sniff-body">
     <thead>
    <tr>
      <th class="oh">Timestamp</th>
      <th class="hh">Host</th>
      <th>Source IP</th>
      <th>Destination IP</th>
      <th>Source Port</th>
      <th>Destination Port</th>
    </tr>
  </thead>
  <tbody>
    <tr :id="'p-idx-'+index"
        :class="[index == hoverIndex ? hoverClass : '']"
        v-for="(packet, index) in packets"
        @click="updateCurrent(packet, index)">
      <td class="selectable-text oh">  {{ packet.ts | prettifyTs}}</td>
      <td class="selectable-text hh">{{packet.payload.host }}</td>
      <td class="selectable-text">{{packet.ip.saddr | stringifyIp}}</td>
      <td class="selectable-text">{{packet.ip.daddr | stringifyIp}}</td>
      <td class="selectable-text">{{packet.tcp.sport }}</td>
      <td class="selectable-text">{{packet.tcp.dport }}</td>
    </tr>
  </tbody>
  </table>
  </div>
  <!-- <SnifferPayload class="sniff-payload " v-bind:packet="selectedPacket"> </SnifferPayload> -->
  </div>
</template>

<script>
import { stringifyMac, prettifyTs, stringifyIp } from '../../filters'
import { mapGetters } from 'vuex'
// import SnifferPayload from './SnifferPayload'
export default {
  name: 'sniffer',
  props: [],
  created () {
    window.addEventListener('keyup', this.keyup)
    // this.$socket.emit('init')
  },
  data () {
    return {
      selectedPacket: null,
      selectedIndex: -1,
      hoverIndex: -1,
      activeClass: 'activepacket',
      hoverClass: 'hovered'
    }
  },
  computed: mapGetters({
    packets: 'packets'
  }),
  components: {
  },
  filters: {
    stringifyMac,
    stringifyIp,
    prettifyTs
  },
  methods: {
    updateCurrent (packet, index) {
      this.selectedPacket = packet
      this.selectedIndex = index
      this.hoverIndex = index
    },
    keyup (e) {
      // DOWN
      if ((e.keyCode || e.which) === 40) {
        if (this.hoverIndex < this.packets.length - 1) {
          this.hoverIndex += 1
        }
        if (document.getElementsByClassName('hovered')) {
          const cur = document.getElementsByClassName('hovered')[0]
          if (cur) {
            const id = cur.id.split('-')
            id.pop()
            this.selectedPacket = this.packets[this.hoverIndex]
            cur.scrollIntoViewIfNeeded({ block: 'end', behavior: 'smooth' })
          }
        } // UP
      } else if ((e.keyCode || e.which) === 38) {
        if (this.hoverIndex > 0) {
          this.hoverIndex -= 1
        }
        if (document.getElementsByClassName('hovered')) {
          const cur = document.getElementsByClassName('hovered')[0]
          if (cur) {
            const id = cur.id.split('-')
            id.pop()
            this.selectedPacket = this.packets[this.hoverIndex]
            cur.scrollIntoViewIfNeeded({ block: 'end', behavior: 'smooth' })
          }
        }
      } else if ((e.keyCode || e.which) === 13) {
        if (document.getElementsByClassName('hovered')) {
          const cur = document.getElementsByClassName('hovered')[0]
          if (cur) {
            const id = cur.id.split('-')
            const index = id.pop()
            this.selectedPacket = this.packets[index]
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.sniff-table{
  height: 258px;
  overflow: scroll;
}
.sniff-body{
  margin-top: 12px;
}
.sniff-payload{
  border-width: 1px;
  border-style: solid;
  height: 250px;
  overflow: scroll;
}
.activepacket{
  background: blue;
}
.hovered{
  background: #584f9e;
}
.stick{
  position: fixed;
  width: 100%;
}
.oh{
  overflow: hidden;
  max-width: 45px;
}
.hh{
  overflow: hidden;
  max-width: 100px;
}
