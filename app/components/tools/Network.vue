<template>
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
