<template>
  <div id="viz-main">
    <svg>
      <defs>
      <linearGradient id="Router" x1="0%" y1="100%" x2="100%" y2="0%" >
        <stop offset="0%" style="stop-color:rgb(191,31,151);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgb(0,255,255);stop-opacity:1" />
      </linearGradient>
      <linearGradient id="Device" x1="93%" y1="100%" x2="7%" y2="0%" >
        <stop offset="0%" style="stop-color:rgb(148,255,198);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgb(0,0,255);stop-opacity:1" />
      </linearGradient>
      <linearGradient id="Target" x1="0%" y1="100%" x2="100%" y2="0%" >
        <stop offset="0%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
      </linearGradient>
      <linearGradient id="Link" x1="0%" y1="34%" x2="100%" y2="66%" >
        <stop offset="0%" style="stop-color:rgb(15,191,97);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgb(0,255,255);stop-opacity:1" />
      </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { nodeStyle, svgStyle } from './VizStyleParams'

// nodeStyle
export default {
  name: 'Viz',
  data () {
    return {
      i: 0,
      g: {},
      dummy: {},
      width: 0,
      height: 0,
      tree: {},
      root: {},
      treeData: {},
      largeMax: 20,
      duration: 1000,
      shortDuration: 250,
      horizontal: false
    }
  },
  mounted () {
    this.width = this.$el.clientWidth
    this.height = 240 // this.$el.clientHeight < 800 ? 250 : this.$el.clientHeight
    this.vTransform = svgStyle.getVTransform(this.width, this.height)
    this.hTransform = svgStyle.getHTransform(this.width, this.height)
    this.populateTree(this.devices)
    this.init()
  },
  watch: {
    hover (val) {
      if (val) {
        this.tableHover(val)
      } else {
        this.clearNodesStyles()
      }
    },
    target (val) {
      if (!val) {
        this.clearNodesStyles()
      }
    },
    devices (deviceArray) {
      if (this.treeData.length < 1) {
        this.populateTree(deviceArray)
        this.init()
      } else {
        let latest = deviceArray[deviceArray.length - 1]
        let t = {
          id: deviceArray.length - 1,
          ip: latest.ip,
          mac: latest.mac,
          router: latest.router,
          name: latest.name,
          host: latest.host
        }
        this.treeData.children.push(t)
        this.updateVTree()
      }
    }
  },
  computed: mapGetters({
    host: 'host',
    gateway: 'gateway',
    devices: 'devices',
    hover: 'hover',
    target: 'target'
  }),
  methods: {
    populateTree: function (deviceArray) {
      let d = deviceArray.map(function (device, index) {
        return {
          id: index + 1,
          ip: device.ip,
          mac: device.mac,
          name: device.name,
          router: device.router,
          host: device.host
        }
      })
      const routerIndex = d.findIndex(function (device) {
        return device.router === true
      })
      this.treeData = d.splice(routerIndex, 1)[0]
      this.treeData.children = d
    },
    init: function () {
      this.svg = this.$d3.select('svg')
                    .attr('width', this.width)
                    .attr('height', this.height)
      this.g = this.svg.append('g', 'test')
                        .attr('transform', this.horizontal ? `translate(${this.hTransform.x},${this.hTransform.y})` : `translate(${this.vTransform.x},${this.vTransform.y})`)
      // this.initHTree()
      this.initVTree()
      this.update()
    },
    initVTree: function (target) {
      this.root = this.$d3.hierarchy(this.treeData, function (d) { return d.children })
      this.root.x0 = this.width / 2
      this.root.y0 = 0
      this.root.children.forEach(this.collapse)
      this.tree = this.$d3.tree().size(this.osize())
    },
    updateVTree: function (target) {
      this.tree = this.$d3.tree().size(this.osize())
      const newTree = this.$d3.hierarchy(this.treeData, function (d) { return d.children })
      const tD = this.tree(newTree)
      const newNodes = []
      tD.children.forEach((e, j) => {
        let isNew = true
        this.root.children.forEach(function (c, i) {
          if (e.data.ip === c.data.ip) {
            isNew = false
          }
        })
        if (isNew) {
          newNodes.push(e)
        }
      })
      newNodes.forEach((e) => {
        this.root.children.push(e)
      })
      this.update()
    },
    update: function () {
      this.tree = this.$d3.tree().size(this.osize())
      let source, treeData
      if (this.horizontal) {
        source = this.hRoot
        treeData = this.tree(this.hRoot)
      } else {
        source = this.root
        treeData = this.tree(this.root)
      }
      const nodes = treeData.descendants()
      const links = treeData.descendants().slice(1)
      this.g.transition()
      .duration(this.duration)
      .attr('transform', (d) => {
        return this.horizontal ? `translate(${this.hTransform.x},${this.hTransform.y})` : `translate(${this.vTransform.x},${this.vTransform.y})`
      })
      nodes.forEach((d) => { d.y = this.horizontal ? d.depth * 400 : d.depth * 100 })
      const node = this.g.selectAll('g.node')
          .data(nodes, (d) => { return d.id })
      const nodeEnter = node.enter().append('g')
          .attr('class', 'node')
          .attr('transform', (d) => {
            return 'translate(' + this.ox(d) + ',' + this.oy(d) + ')'
          })
          .on('mouseover', this.mouseover())
          .on('mouseout', this.mouseout())
          .on('click', this.clickNode())
      // SVG path styling for Router, Device, Target, HomeNode
      nodeEnter.append('path')
          .attr('class', 'icon')
          .attr('d', (d) => {
            if (d.data.router) {
              return nodeStyle.path.router
            }
            if (this.horizontal) {
              return nodeStyle.path.devices
            }
            return this.treeData.children.length < this.largeMax ? nodeStyle.path.devices : nodeStyle.path.circle
          })
          .attr('transform', (d) => {
            if (d.data.router) {
              return nodeStyle.transform.router
            }
            if (this.horizontal) {
              return nodeStyle.transform.large
            }
            return this.treeData.children.length < this.largeMax ? nodeStyle.transform.large : nodeStyle.transform.small
          })
          .attr('fill', function (d) {
            // need to figure out how to get home mac, so black if(d.data.mac === this mac)
            // need to figure out how to set this color dynamically, so not just on init
            if (d.data.host) {
              return 'url(#Link)'
            }
            return d.data.router ? 'url(#Router)' : 'url(#Device)'
          })
      // Text styling for Router, Device, Target, HomeNode
      nodeEnter.append('text')
          .attr('transform', (d) => {
            if (d.data.router) {
              return nodeStyle.textTransformRotate.router
            }
            if (this.horizontal) {
              return nodeStyle.textTransformRotate.large
            }
            return this.treeData.children.length < this.largeMax ? nodeStyle.textTransformRotate.large : nodeStyle.textTransformRotate.small
          })
          .attr('dx', (d) => {
            if (d.data.router) {
              return nodeStyle.textTransformXOffset.router
            }
            if (this.horizontal) {
              return nodeStyle.textTransformXOffset.large
            }
            return this.treeData.children.length < this.largeMax ? nodeStyle.textTransformXOffset.large : nodeStyle.textTransformXOffset.small
          })
          .attr('dy', (d) => {
            if (d.data.router) {
              return nodeStyle.textTransformYOffset.router
            }
            if (this.horizontal) {
              return nodeStyle.textTransformYOffset.large
            }
            return this.treeData.children.length < this.largeMax ? nodeStyle.textTransformYOffset.large : nodeStyle.textTransformYOffset.small
          })
          .attr('fill', function (d) {
            // need to figure out how to get home mac, so black if(d.data.mac === this mac)
            // need to figure out how to set this color dynamically, so not just on init
            if (d.data.host) {
              return 'url(#Link)'
            }
            return d.data.router ? 'url(#Router)' : 'url(#Device)'
          })
          .text((d) => { return this.horizontal ? d.data.name : d.data.ip })
      const nodeUpdate = nodeEnter.merge(node)
      nodeUpdate.transition()
      .duration(this.duration)
      .attr('transform', (d) => {
        return 'translate(' + this.ox(d) + ',' + this.oy(d) + ')'
      })
      const nodeExit = node.exit().transition()
        .duration(this.shortDuration)
        .attr('transform', (d) => {
          // const p = { x: source.x, y: source.y }
          return 'translate(' + this.ox(d) + ',' + this.oy(d) + ')'
        })
        .remove()
      nodeExit.select('circle')
        .attr('r', 1e-6)
      nodeExit.select('text')
        .style('fill-opacity', 1e-6)
      const link = this.g.selectAll('path.link')
                        .data(links, function (d) { return d.id })
      const linkEnter = link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('d', (d) => {
          const p = { x: source.x0, y: source.y0 }
          const k = { x: this.ox(p), y: this.oy(p) }
          return this.diagonal(k, k)
        })
        // .attr('stroke', function (d) { return 'url(#Link)' })
      const linkUpdate = linkEnter.merge(link)
      linkUpdate.transition()
        .duration(this.duration)
        .attr('d', (d) => {
          return this.diagonal(
            { x: this.ox(d), y: this.oy(d) },
            { x: this.ox(d.parent), y: this.oy(d.parent) }
          )
        })
        // .attr('d', (d) => { return this.diagonal(d, d.parent) })
      link.exit().transition()
        .duration(this.shortDuration)
        .attr('d', (d) => {
          let o = { x: this.ox(source), y: this.oy(source) }
          return this.diagonal(o, o)
        })
        .remove()
        // .attr('stroke', function (d) { return 'url(#Link)' })
      nodes.forEach(function (d) {
        d.x0 = d.x
        d.y0 = d.y
      })
    },
    mouseover: function () {
      const vue = this
      return function (d) {
        if (vue.currentTool === 'Network') {
          vue.clearNodesStyles()
          vue.$d3.select(this).attr('fill', 'url(#Target)')
          // vue.$store.dispatch('setHoverNode', d.data)
        }
      }
    },
    mouseout: function (d) {
      const vue = this
      return function (d) {
        if (vue.currentTool === 'Network') {
          vue.clearNodesStyles()
        }
      }
    },
    clickNode: function (d) {
      const vue = this
      return function (d) {
        if (vue.currentTool === 'Network' && !d.data.router) {
          vue.clearNodesStyles()
          vue.$d3.select(this).attr('fill', 'url(#Target)')
          // vue.$store.dispatch('setTarget', d.data)
        }
      }
    },
    collapse: function (d) {
      if (d.children) {
        d._children = d.children
        d._children.forEach(this.collapse)
        d.children = null
      }
    },
    diagonal: function (s, d) {
      return this.horizontal ? this.hDiagonal(s, d) : this.vDiagonal(s, d)
    },
    vDiagonal: function (s, d) {
      return `M ${s.x} ${s.y}
              C ${s.x} ${(s.y + d.y) / 2},
              ${d.x} ${(s.y + d.y) / 2},
              ${d.x} ${d.y}`
    },
    hDiagonal: function (s, d) {
      const path = `M ${s.x} ${s.y}
              C ${(s.x + d.x) / 2} ${s.y},
                ${(s.x + d.x) / 2} ${d.y},
                ${d.x} ${d.y}`
      return path
    },
    ox: function (d) {
      return this.horizontal ? d.y : d.x
    },
    oy: function (d) {
      return this.horizontal ? d.x : d.y
    },
    osize: function () {
      if (this.horizontal) {
        return [this.height, this.width]
      } else {
        return [this.width, this.height]
      }
    },
    tableHover: function (node) {
      this.clearNodesStyles()
      this.$d3.selectAll('path.icon')
              .filter(function (d, i) { return (typeof d.data === 'undefined') ? false : (d.data.ip === node.ip) })
              .attr('fill', 'url(#Target)')
      if (this.target) {
        const target = this.target
        this.$d3.selectAll('path.icon')
                .filter(function (d, i) { return (typeof d.data === 'undefined') ? false : (d.data.ip === target.ip) })
                .attr('fill', 'url(#Target)')
      }
    },
    setTarget: function (node) {
      this.clearNodesStyles()
      this.$d3.selectAll('path.icon')
            .filter(function (d, i) { return (typeof d.data === 'undefined') ? false : (d.data.ip === node.ip) })
            .attr('fill', 'url(#Target)')
    },
    clearNodesStyles: function () {
      this.$d3.selectAll('path.icon')
              .filter(function (d, i) { return typeof d.data !== 'undefined' })
              .attr('fill', 'url(#Device)')
      this.$d3.selectAll('path.icon')
              .filter(function (d, i) { return (typeof d.data === 'undefined') ? false : d.data.router })
              .attr('fill', 'url(#Router)')

      this.$d3.selectAll('path.icon')
              .filter(function (d, i) { return (typeof d.data === 'undefined') ? false : d.data.host })
              .attr('fill', 'url(#Link)')
      if (this.target) {
        const target = this.target
        this.$d3.selectAll('path.icon')
                .filter(function (d, i) { return (typeof d.data === 'undefined') ? false : (d.data.ip === target.ip) })
                .attr('fill', 'url(#Target)')
      }
    }
  }
}

</script>
<style>
  .icon {
    /*color: white;*/
  }
  .viz-main{
    background: white;
  }
  .node circle {
    fill: #fff;
    stroke: steelblue;
    stroke-width: 3px;
  }
  .node text {
    font: 12px sans-serif;
  }
  .link {
    fill: none;
    stroke: #bbb;
    stroke-width: 2px;
  }
</style>
