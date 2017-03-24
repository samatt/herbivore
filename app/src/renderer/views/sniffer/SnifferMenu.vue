<template>
<nav class="level is-marginless">
  <div class="level-left">
    <div class="level-item">
    <p class="control">
    <button class="button" @click="clearPackets" >
      Clear Packets
    </button>
    <button v-if="inspectorPacket" class="button" @click="clearPacket" >
      Close Inspector
    </button>
    </p>
    </div>
  </div>

  <div class="level-right">
    <div class="level-item">
      <p class="control">
      <button
        @click="startSniffer"
        class="button">
          Start Sniffer
      </button>
      <button
      @click="stopSniffer"
      class="button">
        Stop Sniffer
      </button>
      </p>
    </div>
  </div>
</nav>
</template>

<script >
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'SnifferMenu',
  computed: mapGetters({
    packets: 'packets',
    target: 'target',
    inspectorPacket: 'inspectorPacket'

  }),
  methods: {
    ...mapActions([
      'clearPackets',
      'clearPacket',
      'startSniffer',
      'stopSniffer'
    ])
  }
}
</script>
<style >

</style>
