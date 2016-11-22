<template>
  <div id="console-container">
    Current Selection: {{ current}}
    <sniffer v-bind:packets="packets"
             v-if="current == 'Sniffer'">
    </sniffer>
  </div>
</template>

<script>
import Sniffer from './Sniffer'

export default {
  name: 'Console',
  props: ['current', 'packets'],
  created () {
    window.addEventListener('keyup', this.keyup)
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
    Sniffer
  },
  filters:{
  },
  methods: {
    updateCurrent (packet, index) {
      this.selectedPacket = packet;
      this.selectedIndex = index;
      this.hoverIndex = index;
    },
    keyup (e) {
      //DOWN

    }
  }
}
</script>

<style scoped>

</style>
