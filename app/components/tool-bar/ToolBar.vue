<template>
      <nav class="nav-group">
          <h5 class="nav-group-title">Tools</h5>
            <span
              :class="['nav-group-item', index == selectedIdx ? 'active' : '']"
              v-for="(tool, index) in toolNames"
              @click="updateTools(tool, index)">
              <span :class="['icon', icons[tool] ]"></span>
              {{tool | toolNameFilter}}
            </span>
      </nav>
  <!-- <div class="nav-container"> -->
<!--     <ul class="nav-tools">
      <li :class="['nav-tool', index == selectedIdx ? 'nav-tool-active' : '']"
          v-for="(tool, index) in toolNames"
          @click="updateTools(tool, index)">
          {{tool | toolNameFilter}}
      </li>
    </ul> -->
  <!-- </div> -->
  <!-- <Viz></Viz> -->
</template>
<script>
// import Viz from '../viz/Viz.vue'
import {mapGetters} from 'vuex'
import {toolNameFilter} from '../../filters'
export default {
  name: 'ToolBar',
  props: [],
  created () {
  },
  data () {
    return {
     selectedIdx: "",
     icons: {
      'Network': 'icon-search',
      'Info':'icon-info',
      'PcapSniffer':'icon-signal'
     }
    }
  },
  computed: mapGetters({
    toolNames: 'toolNames'
  }),
  components: {
  },
  filters:{
    toolNameFilter
  },
  methods: {
    updateTools (tool, index) {
      this.selectedIdx = index;
      this.$store.dispatch('stop')
      this.$store.dispatch('changeTool', tool)
      this.$socket.emit('stop')
      this.$socket.emit('load',tool)
    },
    updateView (name) {
      this.$store.dispatch('changeView', name)
    },
    keyup (e) {
    }
  }
}
</script>

<style scoped>

</style>
