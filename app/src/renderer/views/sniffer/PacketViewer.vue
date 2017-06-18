<template>
<div class="title is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h1 class="title">Packets</h1>
          <div class="block is-flex">
          <collapse  accordion is-fullwidth>

          <collapse-item :class="getClasses(packet, index)" v-for="(packet, index) in packets" :title="title(packet)">
            Host: {{packet.payload.host}}
            &nbsp
            Source IP: {{packet.ip.saddr | stringifyIp}}
            &nbsp
            Dest IP: {{packet.ip.daddr | stringifyIp}}
            &nbsp
            Source port: {{packet.tcp.sport}}
            &nbsp
            Dest port: {{packet.tcp.dport}}
          <collapse>
          <collapse-item class='handle-overflow' title="Packet Payload">
          <pre>{{packet.payload}}</pre>
          </collapse-item>
          </collapse>
          </collapse-item>
          </collapse>
          </div>
        </article>
      </div>
</div>

</template>

<script>
import { stringifyMac, prettifyTs, stringifyIp } from '../../filters'
import { mapGetters } from 'vuex'
import { Collapse, Item as CollapseItem } from 'vue-bulma-collapse'

export default {
  name: 'sniffer',
  created () {
    window.addEventListener('keyup', this.keyup)
    // this.$socket.emit('init')
  },
  data () {
    return {
      hoverIndex: 0
    }
  },
  components: {
    Collapse,
    CollapseItem
  },
  filters: {
    stringifyMac,
    stringifyIp,
    prettifyTs
  },
  computed: mapGetters({
    packets: 'packets'
  }),
  methods: {
    title (packet) {
      return packet.tcp.sport === 443 || packet.tcp.dport === 443 ? `🔒 ${prettifyTs(packet.ts)} ${packet.payload.host} ` : `🔓 ${prettifyTs(packet.ts)} ${packet.payload.host}`
    },
    collapseItem (packet) {
      return `${prettifyTs(packet.ts)} ${stringifyIp(packet.ip.saddr)} ${stringifyIp(packet.ip.daddr)}`
    },
    updateCurrent (packet, index) {
      this.selectedPacket = packet
      this.selectedIndex = index
      this.hoverIndex = index
    },
    getClasses (packet, index) {
      if (index === this.hoverIndex) {
        return ['selectable-text', 'highlighted', 'small-title', 'has-text-left']
      } else {
        return ['selectable-text', 'small-title', 'has-text-left']
      }
    },
    keyup (e) {
      // console.log(e.keyCode)
      // DOWN
      if ((e.keyCode || e.which) === 40) {
        if (this.hoverIndex < this.packets.length - 1) {
          this.hoverIndex += 1
        }
        // UP
      } else if ((e.keyCode || e.which) === 38) {
        if (this.hoverIndex > 0) {
          this.hoverIndex -= 1
        }
      } else if ((e.keyCode || e.which) === 13) {

      }
    }
  }
}
</script>

<style scoped>
.highlighted {
  background-color: green
}

.card-header{
  font-weight: 100;
  font-size: 0.75em;
}


.handle-overflorw{
  overflow: scroll;
}
</style>
