<template>
<div>
  <template  class="inspector"v-if="packet.payload.type !== 'https'">
  <div v-if="tab === 'Summary' ">
       <template v-if="packet.payload.type === 'request'">
         <div class="has-text-left" ><strong>Type</strong> : Request</div>
         <div class="has-text-left" ><strong>Method</strong> : <span class="selectable-text "> {{packet.payload.method}} </span> </div>
         <div class="has-text-left" ><strong>Url</strong>: <span class="selectable-text "> {{packet.payload.host}}{{packet.payload.url}} </span></div>
       </template>

       <template v-else>
         <div class="has-text-left"><strong>Type</strong> : Response</div>
         <div class="has-text-left" ><strong>Response Code</strong> : <span class="selectable-text ">{{packet.payload.code}} {{packet.payload.status}} </span></div>
       </template>
  </div>
  <div v-else-if="tab === 'Headers' ">
    <div class="has-text-left" v-for="p in packet.payload.headers">
      <strong>{{p[0]}}:</strong> <span class="selectable-text "> {{p[1]}} </span>
    </div>
  </div>
  <div v-else-if="tab === 'Payload' ">
     <template v-if="packet.payload.type !== 'https'">
     <pre class=" payload has-text-left">
     {{packet.payload.payload}}
     </pre>
     </template>
  </div>
  <div v-else-if="tab === 'Raw' ">
     <template v-if="packet.payload.type !== 'https'">
     <pre class=" payload has-text-left">
     {{packet.raw}}
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
@import '../../globals.scss';
.inspector{
  max-height: 300px;

}
.payload{
  overflow-wrap: break-all;
  word-wrap: break-word;
  white-space: pre-wrap
  // overflow-x: scroll;
}

</style>
