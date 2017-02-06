<template>
<header class="toolbar toolbar-header">
  <h1 class="title"> Herbivore</h1>
  <div class="toolbar-actions">
    <button @click="rescan()"
             class="btn btn-default pull-right">
      <span class="icon icon icon-cw"></span>
    </button>
</header>
</div>
</template>
<script>

import {mapGetters} from 'vuex'
import {toolNameFilter} from '../filters'
export default {
  name: 'ToolBar',
  props: [],
  created () {
  },
  data () {
    return {}
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
    clear () {
      this.$store.dispatch('clearAllState')
      this.$socket.emit('clear')
    },
    rescan () {
      this.$socket.emit('cmd', 'rescan')
    },
    updateView (name) {
    },
    keyup (e) {
    }
  }
}
</script>

<style scoped>

</style>
