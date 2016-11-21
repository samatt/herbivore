<template>
  <div class="nav-container">

    <ul class="nav-tools">
      <li :class="['nav-tool', selectedIdx ? 'nav-active-tool' : '']"
          v-for="(tool, index) in tools"
          @click="updateTools(tools)">
          {{tool}}
      </li>
    </ul>

    <ul class="nav-views">
      <li :class="['nav-view', (selectedView == view) ? 'nav-active-view' : '']"
          v-for="view in views"
          @click="updateView(view)">
          {{view}}
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
     selectedView: ""
    }
  },
  filters:{
  },
  methods: {
    updateTools (packet, index) {
      this.selectedIdx = index;
    },
    updateView (name) {
      this.selectedView = name;
    },
    keyup (e) {
    }
  }
}
</script>

<style scoped>

</style>
