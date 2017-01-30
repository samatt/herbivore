<template>
  <div class="selectable text">
     <span v-if="!packet"> Click a packet to see its payload information. You can use the up and down keys to navigate</span>
     <template v-else>
         <template v-if="packet.payload.type !== 'https'">

           <template v-if="packet.payload.type === 'request'">
             <div><strong>Type</strong> : Request</div>
             <div><strong>Method</strong> : {{packet.payload.method}}</div>
             <div><strong>Url</strong>: {{packet.payload.host}}{{packet.payload.url}}</div>
           </template>

           <template v-else>
              <div><strong>Type</strong> : Response</div>
             <div><strong>Response Code</strong> : {{packet.payload.code}} {{packet.payload.status}}</div>
           </template>

         </template>
          <div v-else>
            This is an encrypted HTTPS packet for {{packet.payload.host}}
         </div>
        <div v-for="p in packet.payload.headers">
          <strong>{{p[0]}}:</strong> {{p[1]}}
        </div>
     </template>
  </div>
</template>

<script>
// import {payloadParser} from '../../filters'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'snifferPayload',
  props: ['packet']
}
</script>

<style scoped>
 .group-overflow{
  overflow: scroll;
 }
</style>
