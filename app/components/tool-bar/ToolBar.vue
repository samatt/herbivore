<template>
  <div class="nav-container">
    <ul class="nav-tools">
      <li :class="['nav-tool', index == selectedIdx ? 'nav-tool-active' : '']"
          v-for="(tool, index) in toolNames"
          @click="updateTools(tool, index)">
          {{tool | toolNameFilter}}
      </li>
    </ul>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {toolNameFilter} from '../../filters'

export default {
  name: 'ToolBar',
  props: ['views'],
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
