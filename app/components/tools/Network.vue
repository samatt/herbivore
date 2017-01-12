<template>
  <!-- <div v-if="toolRunning"> -->
  <table class="table">
    <thead>
    <tr>
      <th>MAC Address</th>
      <th>IP Address</th>
      <th>Vendor</th>
      <th>Hostname</th>
      <th>Router</th>

    </tr>
  </thead>
  <tbody>
    <tr :class="[node.active ? 'active' : '']"
        v-for="node in nodes">
      <td>{{ node.mac | upperMac }} </td>
      <td>{{ node.ip }}</td>
      <td>{{ node.vendor }}</td>
      <td>{{ node.hostname }}</td>
      <td>{{ node.router }}</td>
    </tr>
  </tbody>
  </table>
<!--   <div style="float:left;">
  Type of Connection{{ type}}
  </br> Num devices on network: {{ this.nodes.length - 1}}
  </br> Mac: {{ mac }}
  </br>Network Interface: {{ this.interface}}
  </br>IP on local network{{ privateIp }}
  </br>Public IP :{{ publicIp}}
  </br>Router IP: {{ gateway}}
  </div>
  <div v-if="clickedNode" style="float:right; padding-right: 10px;">
   Current Node:
   </br>Mac: {{clickedNode.mac}}
   </br>IP: {{clickedNode.ip}}
   </br>Is Router: {{clickedNode.router}}
   </div> -->

  <!-- </div> -->
<!--   <div v-else>
    Use this tool to get information about your current network.
    Click the play button to gather your networks information
  </div> -->

  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {upperMac} from '../../filters'

export default {
  name: 'Network',
  created () {
  },
  data () {
    return {
     selectedIdx: "",
     styleObject:{
        backgroundColor: '#116cd6',
        color:'#fff'}
    }
  },
  computed: mapGetters({
    toolRunning: 'toolRunning',
    mac: 'mac',
    privateIp: 'privateIp',
    publicIp: 'publicIp',
    gateway: 'gateway',
    interface: 'interface',
    netmask: 'netmask',
    type: 'type',
    nodes: 'nodes',
    clickedNode: 'clickedNode'
  }),
  filters:{
    upperMac
  }
}
</script>

<style scoped>
  .active{
    color: #fff;
    background-color: #116cd6;
  }
</style>
