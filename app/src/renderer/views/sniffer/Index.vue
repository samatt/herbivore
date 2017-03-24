<template>
<div>
  <sniffer-menu/>
  <packet-inspector/>
<div v-if="target" class="sniff-table">
  <table class="table sniff-body">
     <thead>
    <tr>
      <th >Timestamp</th>
      <th >Host</th>
      <th>Content Type</th>
      <th>Source IP</th>
      <th>Destination IP</th>
      <th>Source Port</th>
      <th>Destination Port</th>
    </tr>
  </thead>
  <tbody>
    <tr :id="'p-idx-'+index"
        v-for="(packet, index) in packets"
        @click="updateCurrent(packet, index)">
      <td class="selectable-text">  {{ packet.ts | prettifyTs}}</td>
      <td class="selectable-text">{{packet.payload.host }}</td>
      <td class="selectable-text">{{packet.payload.type !== 'https' ? packet.payload.contentType : '' }}</td>
      <td class="selectable-text">{{packet.ip.saddr | stringifyIp}}</td>
      <td class="selectable-text">{{packet.ip.daddr | stringifyIp}}</td>
      <td class="selectable-text">{{packet.tcp.sport }}</td>
      <td class="selectable-text">{{packet.tcp.dport }}</td>
    </tr>
  </tbody>
  </table>
  </div>
  <div v-else>
    A target hasn't been selected please go to the network view and select one.
  </div>
  </div>
</template>

<script>
import { stringifyMac, prettifyTs, stringifyIp } from '../../filters'
import { mapGetters, mapActions } from 'vuex'
import SnifferMenu from './SnifferMenu'
import PacketInspector from './PacketInspector'

export default {
  name: 'sniffer',
  created () {
    // window.addEventListener('keyup', this.keyup)
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
  computed: {
    displayPackets () {
      if (this.packets.length < 20) {
        return this.packets
      } else {
        const start = this.packets.length - 20
        const end = this.packets.length - 1
        return this.packets.slice(start, end)
      }
    },
    ...mapGetters({
      packets: 'packets',
      target: 'target'
    })
  },
  components: {
    SnifferMenu,
    PacketInspector
  },
  filters: {
    stringifyMac,
    stringifyIp,
    prettifyTs
  },
  methods: {
    getContentHeader (packet) {
      if (packet.payload.headers) {
        const header = packet.payload.headers.filter(function (header) {
          return header[0] === 'Content-Type'
        })
        return header ? header[1] : ''
      } else {
        return ''
      }
    },
    updateCurrent (packet, index) {
      this.selectedPacket = packet
      this.setPacket(packet)
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
    },
    ...mapActions([
      'setPacket',
      'clearPacket'
    ])
  }
}
</script>

<style lang='scss'>
.sniff-table{
  height: 700px;
  /*position: relative;*/
  overflow-y: scroll;
}
.sniff-body{
  /*margin-top: 12px;*/
  /*max-height: 500px;*/
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
</style>
