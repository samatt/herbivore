<template>

  <div  class="viz-container">
  <svg>

  </svg>
  </div>

</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  name: 'Viz',
  props: [ ],
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
