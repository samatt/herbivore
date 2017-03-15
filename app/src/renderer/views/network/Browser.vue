<template>
<section>
  <nav class="panel">
    <div class="panel-block">
      <p class='control has-icon'>
        <input class="input" type="text" placeholder="Search Devices" v-model="filterKey">
        <span class="icon">
          <i class="fa fa-search"> </i>
        </span>
      </p>
    </div>
    <nav class="level is-marginless info-bar">
      <div class="level-left">
      Showing {{filteredData.length}} of {{devices.length}}
      </div>
      <div class="level-right">
        <a @click="clearTarget()" class="level-item button info-bar is-outlined" > Clear Target</a>
      </div>
    </nav>
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
      <tr @click="setTargetClick(node)"
          @mouseover="mouseOver(node)"
          :class="[node.active ? 'active' : '', node.homeNode ? 'homeNode' : '']"
          v-for="node in filteredData">
        <td>{{ node.mac | upperMac }} </td>
        <td>{{ node.ip }}</td>
        <td>{{ node.vendor }}</td>
        <td>{{ node.name }}</td>
        <td>{{ node.router }}</td>
      </tr>
    </tbody>
  </table>
  </nav>
  <div class="container">
  </div>
</section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { upperMac, capitalize } from '../../filters'
// import PagePreview from './PagePreview'
// console.log(PagePreview)

export default {
  name: 'Browser',
  created () {
  },
  components () {
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
      filterKey: '',
      offset: 0,
      numDocs: 2
    }
  },
  computed: {
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.devices
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
      devices: 'devices'
    })
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    mouseOver: function (node) {
      this.setHover(node)
    },
    setTargetClick: function (node) {
      this.setTarget(node)
      this.goToSniffer()
    },
    clearTarget: function (node) {
      this.clearTarget()
    },
    goToSniffer: function () {
      this.$router.push({
        path: '/sniffer'
      })
    },
    ...mapActions([
      'setHover',
      'clearHover',
      'clearTarget',
      'setTarget'])
  },
  filters: {
    upperMac,
    capitalize
  }
}
</script>

<style lang='scss'>
@import "../../globals.scss";
.stick{
  position: fixed;
  width: 100%;
}
.network-body{
  /*margin-top: 12px;*/
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
.container {
  max-height: 300px;
}
.info-bar{
  /*background-color: $purplecolor;*/
  /*color: white;*/
}
/*nav{
  background-color: $light-green;
}*/
</style>
