<template>
<div>
  <div>
    <input class="form-control" type="text" placeholder="Search nodes" v-model="filterKey">
    <span> {{filteredData.length}} items </span>
  </div>
  <table class="table">
    <thead>
    <tr>
    <th v-for="key in columns"
      @click="sortBy(key)"
      :class="{ active: sortKey == key }">
        {{key  | capitalize}}
      <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
      </span>
    </th>
    </tr>
  </thead>
  <tbody>
    <tr :class="[node.active ? 'active' : '']"
        v-for="node in filteredData">
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
import {upperMac, capitalize} from '../../filters'

export default {
  name: 'Network',
  created () {
  },
  data () {
    let columns = ['mac', 'ip', 'vendor', 'hostname', 'router']
    let sortOrders = {}
    columns.forEach(function (key) {
      sortOrders[key] = 1
    })
    return {
     sortKey: '',
     sortOrders: sortOrders,
     columns: columns,
     filterKey: ''
    }
  },
  computed: {
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.nodes
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    },
    ...mapGetters({
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
    })},
  methods:{
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    }
  },
  filters:{
    upperMac,
    capitalize
  }
}
</script>

<style scoped>
.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #333;
  float: right;
  margin-top: 8px;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #333;
  float: right;
  margin-top: 8px;
}

.active{
    color: #fff;
    background-color: #116cd6;
}
</style>