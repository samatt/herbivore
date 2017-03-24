<template>
<div>
  <template v-if="packet.payload.type !== 'https'">
  <div v-if="tab === 'Summary' ">
       <template v-if="packet.payload.type === 'request'">
         <div class="selectable-text" ><strong>Type</strong> : Request</div>
         <div class="selectable-text" ><strong>Method</strong> : {{packet.payload.method}}</div>
         <div class="selectable-text" ><strong>Url</strong>: {{packet.payload.host}}{{packet.payload.url}}</div>
       </template>

       <template v-else>
         <div class="selectable-text"><strong>Type</strong> : Response</div>
         <div class="selectable-text" ><strong>Response Code</strong> : {{packet.payload.code}} {{packet.payload.status}}</div>
       </template>
  </div>
  <div v-else-if="tab === 'Headers' ">
    <div class="selectable-text" v-for="p in packet.payload.headers">
      <strong>{{p[0]}}:</strong> {{p[1]}}
    </div>
  </div>
  <div v-else-if="tab === 'Payload' ">
     <template v-if="packet.payload.type !== 'https'">
     <pre class="has-text-left">
     {{packet.payload.payload}}
     </pre>

     </template>

  </div>
  </template>
  <div v-else>
    This is an encrypted HTTPS packet for {{packet.payload.host}}
 </div>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'PacketInspectorPayload',
  props: ['tab'],
  computed: {
    ...mapGetters({
      packet: 'inspectorPacket'
    })
  },
  methods: {
    close () {
      clearTimeout(this.timer)
      this.show = false
    }
  }

}
</script>
<style lang='scss'>


</style>
