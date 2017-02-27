<template>
  <div class="selectable text">
     <span v-if="!packet"> Click a packet to see its payload information. You can use the up and down keys to navigate</span>
     <template v-else>
         <template v-if="packet.payload.type !== 'https'">

           <template v-if="packet.payload.type === 'request'">
             <div class="selectable-text" ><strong>Type</strong> : Request</div>
             <div class="selectable-text" ><strong>Method</strong> : {{packet.payload.method}}</div>
             <div class="selectable-text" ><strong>Url</strong>: {{packet.payload.host}}{{packet.payload.url}}</div>
           </template>

           <template v-else>
             <div class="selectable-text"><strong>Type</strong> : Response</div>
             <div class="selectable-text" ><strong>Response Code</strong> : {{packet.payload.code}} {{packet.payload.status}}</div>
           </template>

         </template>
          <div v-else>
            This is an encrypted HTTPS packet for {{packet.payload.host}}
         </div>
        <div class="selectable-text" v-for="p in packet.payload.headers">
          <strong>{{p[0]}}:</strong> {{p[1]}}
        </div>
     </template>
  </div>
</template>

<script>

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
