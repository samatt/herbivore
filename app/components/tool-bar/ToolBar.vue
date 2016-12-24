<template>
<div class='main-container'>
  <div class="nav-container">
    <ul class="nav-tools">
      <li :class="['nav-tool', index == selectedIdx ? 'nav-tool-active' : '']"
          v-for="(tool, index) in toolNames"
          @click="updateTools(tool, index)">
          {{tool | toolNameFilter}}
      </li>
    </ul>
  </div>
  <Viz></Viz>
</div>
</template>
<script>
import {mapGetters} from 'vuex'
import {toolNameFilter} from '../../filters'
import Viz from '../viz/Viz'

export default {
  name: 'ToolBar',
  props: [],
  created () {
  },
  data () {
    return {
     selectedIdx: "",
    }
  },
  computed: mapGetters({
    toolNames: 'toolNames'
  }),
  components: {
    Viz
  },
  filters:{
    toolNameFilter
  },
  methods: {
    updateTools (tool, index) {
      this.selectedIdx = index;
      this.$store.dispatch('stop')
      this.$socket.emit('stop')
      this.$store.dispatch('changeTool', tool)
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
