<template>
  <div class="nav-container">

    <ul class="nav-tools">
      <li :class="['nav-tool', index == selectedIdx ? 'nav-tool-active' : '']"
          v-for="(tool, index) in tools"
          @click="updateTools(tools, index)">
          {{tool}}
      </li>
    </ul>
    <div class="nav-views" >
    <template v-for="view in views">
      <div :class="['nav-view', (selectedView == view) ? 'nav-view-active' : '']"
          @click="updateView(view)">
          {{view}}
      </div>
    </template>
    </div>
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
      console.log(name)
      this.selectedView = name;
    },
    keyup (e) {
    }
  }
}
</script>

<style scoped>

</style>
