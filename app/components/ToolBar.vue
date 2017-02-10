<template>
<header class="toolbar toolbar-header">
  <h1 class="title"> Herbivore</h1>
  <div class="toolbar-actions">
    <span class='margin-center'> <span v-if="target"> Target:</span> <span :class=" target ? 'target' : '' "> {{targetSet}} </span> </span>

    <button v-if="target" @click="clearTarget()"
             class="btn btn-default">
      <span class="icon icon icon-cancel"></span>
    </button>

    <button @click="rescan()"
             class="btn btn-default pull-right">
      <span class="icon icon icon-cw"></span>
    </button>
    <span v-if="hoveredNode" class="pull-right margin-right-more"> {{hoveredNode | statusString }} {{moreInfoString}}</span>
</header>
</div>
</template>
<script>

import {mapGetters} from 'vuex'
import {statusString} from '../filters'
export default {
  name: 'ToolBar',
  props: [],
  created () {
  },
  data () {
    return {
      isClicked:false
    }
  },
  computed: {
    moreInfoString () {
      if (typeof this.hoveredNode === 'undefined') return '';
      if (this.hoveredNode && !this.hoveredNode.router) {
        let node = this.nodes.filter( (n) => {return n.ip === this.hoveredNode.ip})
        return node ? `${node[0].mac}  ${node[0].ip}   ${node[0].hostname}` : 'cant find node :('
      } else {
        return ''
      }
    },
    targetSet () {
      if(this.target){
        // Have to do this because of stupid d3/vuex data mismatch
        let t = this.nodes.filter( (n) => { return n.ip === this.target.ip} )
        return `${this.target.mac.toUpperCase()} ${t[0].hostname}`
      }

      if(this.hoveredNode){
        return 'Click selected node to make it your target'
      } else {
        return ''
      }
    },
    ...mapGetters({
      toolNames: 'toolNames',
      currentTool: 'currentTool',
      hoveredNode: 'hoveredNode',
      target: 'target',
      nodes: 'nodes'
    })},
  components: {
  },
  filters:{
    statusString
  },
  methods: {
    clear () {
      this.$store.dispatch('clearAllState')
      this.$socket.emit('clear')
    },
    clearTarget () {
      this.$store.dispatch('clearTarget')
      this.$socket.emit('cmd', 'updateTarget', {'stop':true})
    },
    rescan () {
      if (this.currentTool === 'Network') {
        this.$socket.emit('cmd', 'rescan')
      }
      else if (this.currentTool === 'Sniffer') {
        this.$store.dispatch('clearSnifferInfo')
      }

    },
    clicked (name) {
      this.isClicked = !this.isClicked
    },
    keyup (e) {
    }
  }
}
</script>

<style scoped>

.margin-right-more{
  margin-right: 10px;
}
.margin-center{
  margin-left: 526px;
}

.target {
  color: #5997ce;
}

</style>
