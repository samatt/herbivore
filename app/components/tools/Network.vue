<template>
<div>
  <div>
    <input class="form-control" type="text" placeholder="Search nodes" v-model="filterKey">
  </div>
  <div class="network-table">
  <table class="table stick">
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
  </table>
  <table class="table padded network-body">
  <tbody>
    <tr @click="setTarget(node)"
        @mouseover="mouseOver(node)"
        @mouseout="mouseOut()"
        :class="[node.active ? 'active' : '', node.homeNode ? 'homeNode' : '']"
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
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { upperMac, capitalize } from '../../filters'

export default {
  name: 'Network',
  created () {
  },
  data () {
    const columns = ['mac', 'ip', 'vendor', 'hostname', 'router']
    const sortOrders = {}
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
    })
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    mouseOver: function (node) {
      this.$store.dispatch('setHoverNode', node)
    },
    mouseOut: function () {
      this.$store.dispatch('clearHoverNode')
    },
    setTarget: function (node) {
      this.$store.dispatch('setTarget', node)
    },
    setHomeNode: function () {
      this.$store.emit('setHomeNode')
    }
  },
  filters: {
    upperMac,
    capitalize
  }
}
</script>

<style scoped>

.stick{
  position: fixed;
  width: 100%;
}
.network-body{
  margin-top: 12px;
}
.network-table{
  max-height: 326px;
  overflow: scroll;
}

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

.active {
    color: #fff;
    background-color: #116cd6;
}

.homeNode {
    color: #fff;
    background-color: black;
}
</style>
