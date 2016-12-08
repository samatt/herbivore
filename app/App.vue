<template>
  <div id="app">
    <ToolBar> </ToolBar>
    <Console v-bind:views="views"></Console>
  </div>
</template>

<script>
import Console from './components/Console'
import ToolBar from './components/ToolBar'

export default {
  name: 'app',
  props: ['packets'],
  components: {
    Console,
    ToolBar
  },
  data () {
    return {
     views: ['Console'],
     currentTool:''
    }

  },
  methods:{
    onEnter () {
      console.log('ENTER')
    }
  }
}
</script>
<style lang="sass" src="../styles/main.scss"></style>
