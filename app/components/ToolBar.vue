<template>
  <div class="nav-container">
    <ul class="nav-tools">
      <li :class="['nav-tool', index == selectedIdx ? 'nav-tool-active' : '']"
          v-for="(tool, index) in tools"
          @click="updateTools(tool, index)">
          {{tool}}
      </li>
    </ul>
  </div>
</template>
<script>

export default {
  name: 'ToolBar',
  props: ['tools', 'views'],
  created () {
  },
  data () {
    return {
     selectedIdx: "",
    }
  },
  filters:{
  },
  methods: {
    updateTools (tool, index) {
      this.selectedIdx = index;
      this.$emit('select', tool)
      this.$store.dispatch('changeTool', tool)
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
