<template>

  <div  class="console-container">
    <div class='view-options'>
      <div :class="['view-option-button', (selectedView == view) ? 'view-option-button-active' : '']"
          @click="updateView(view)"
          v-for="view in views">
          <div class="view-option-button-text"> {{view}}</div>
      </div>
    </div>
  <div :class="['view-contanier', currentView === 'Console'?'view-console': 'view-info']" >
        Current Tool: {{ currentTool}} Current View: {{ currentView}}
        <sniffer v-if="currentTool === 'Sniffer'" v-bind:packets="packets"> </sniffer>
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
      selectedView: ""
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
      this.selectedView = name
      this.$store.dispatch('changeView', name)
    }
  }
}
</script>

<style scoped>

</style>
