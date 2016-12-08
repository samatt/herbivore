<template>

  <div  class="console-container">
    <div class='view-options'>
      <div :class="['view-option-button', (currentView == view) ? 'view-option-button-active' : '']"
          @click="updateView(view)"
          v-for="view in views">
          <div class="view-option-button-text"> {{view}}</div>
      </div>
    </div>
  <div :class="['view-container', 'view-console']" >
        Current Tool: {{ currentTool}} Current View: {{ currentView}}
        <sniffer v-if="currentTool === 'PcapSniffer'"
                 v-bind:packets="packets"> </sniffer>
          <table class="packets-table">
            <thead class="packets-table__header">
              <tr>
                <th scope="col">Number</th>
                <th scope="col">Host Name</th>
                <th scope="col">Packet Type</th>
                <th scope="col">Source IP</th>
                <th scope="col">Dest IP</th>
              </tr>
            </thead>
            <tbody>
                <tr class="packets-table__row">
<!--                 hard-coded to test styling -->
                  <td scope="row">Lorem ipsum</td>
                  <td scope="row">www.duckduckgo.com</td>
                  <td scope="row">TCP</td>
                  <td scope="row">192.168.1.3</td>
                  <td scope="row">192.168.1.4</td>
                </tr>
                <tr class="packets-table__row">
                  <td scope="row">Lorem ipsum</td>
                  <td scope="row">www.duckduckgo.com</td>
                  <td scope="row">TCP</td>
                  <td scope="row">192.168.1.3</td>
                  <td scope="row">192.168.1.4</td>
                </tr>
                <tr class="packets-table__row">
                  <td scope="row">Lorem ipsum</td>
                  <td scope="row">www.duckduckgo.com</td>
                  <td scope="row">TCP</td>
                  <td scope="row">192.168.1.3</td>
                  <td scope="row">192.168.1.4</td>
                </tr>
                <tr class="packets-table__row">
                  <td scope="row">Lorem ipsum</td>
                  <td scope="row">www.duckduckgo.com</td>
                  <td scope="row">TCP</td>
                  <td scope="row">192.168.1.3</td>
                  <td scope="row">192.168.1.4</td>
                </tr>
                <tr class="packets-table__row">
                  <td scope="row">Lorem ipsum</td>
                  <td scope="row">www.duckduckgo.com</td>
                  <td scope="row">TCP</td>
                  <td scope="row">192.168.1.3</td>
                  <td scope="row">192.168.1.4</td>
                </tr>
                <tr class="packets-table__row">
                  <td scope="row">Lorem ipsum</td>
                  <td scope="row">www.duckduckgo.com</td>
                  <td scope="row">TCP</td>
                  <td scope="row">192.168.1.3</td>
                  <td scope="row">192.168.1.4</td>
                </tr>
            </tbody>
          </table>
  </div>

</template>

<script>
import Sniffer from './Sniffer'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'Console',
  props: ['packets','views'],
  created () {
  },
  data () {
    return {
    }

  },
  components:{
    Sniffer
  },
  filters:{
  },
  computed: mapGetters({
    currentTool: 'currentTool',
    currentView: 'currentView'
  }),
  methods:{
    updateView (name) {
      this.currentView = name
      this.$store.dispatch('changeView', name)
    }
  }
}
</script>

<style scoped>

</style>
