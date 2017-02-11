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
import Grid from './Grid'
import * as d3Force from 'd3-force'
import {mapGetters} from 'vuex'
import flare from '../../filters'
import {linkStyle, nodeStyle} from './VizTreeStyleParams'
export default {
  name: 'VizTree',
  props: [ ],
  mounted () {
    this.width = this.$el.clientWidth
    this.height = this.$el.clientHeight < 800 ? 300  :this.$el.clientHeight;
    // this.styleParams = styleParams
    // console.log(styleParams)
  },
  update () {
    console.log("VIZ UPDATE")
  },
  components:{
  },
  data() {
    return {
    i:0,
    g:{},
    dummy: {},
    vdata: {nodes:[], links:[]},
    width: 0,
    height: 0,
    tree: {},
    root: {},
    svg: {},
    duration: 750,
    shortDuration: 250,
    testData: {
      id: 0,
      name: "Gateway",
      ip : "",
      router :true,
      children: []
    }
  }},
  watch: {
    gatewayMac (val) {
      testData.mac = val
    }
  },
  sockets:{
    info: function(info){
      this.testData.ip = this.gateway

      this.testData.children.push({
          id: 1,
          ip : this.privateIp,
          mac : this.mac,
          router: false
      })
      this.init()
      // setInterval(() => { this.testAddNodes() }, 1000)
      // this.testAddNodes()
    },
    clearStyles: function () {
    },
    clearViz: function () {
    },
    addNode: function(node) {
      const idx = this.testData.children.length + 1 ;
      const empty = {
        id: 0,
        name: "Gateway",
        ip : "",
        router :true,
        children: []
      }
      node.router = node.ip === this.gateway;
      node.id = idx
      if(node.router){
        this.$store.dispatch('updateRouterMac', node)
      }
      else{
        this.testData.children.push({
            id: idx,
            ip : node.ip,
            mac : node.mac,
            hostname : node.hostname,
            router: false
        })
        this.$store.dispatch('addNewNode', node)
      }

      let newTree = this.$d3.hierarchy(this.testData, function(d) { return d.children; });
      let treeData = this.tree(newTree)
      this.root.children.push(treeData.children.pop())
      this.update(this.root)

    }
  },
  computed: mapGetters({
      gateway:'gateway',
      privateIp:'privateIp',
      mac: 'mac',
      gatewayMac: 'gatewayMac',
      currentTool: 'currentTool',
      hoveredNode: 'hoveredNode',
      target: 'target'
  }),
  watch: {
    hoveredNode (val) {
      if (val) {
        this.tableHover(val)
      }
      else{
        this.clearNodesStyles()
      }

    },
    target (val) {
      if (val) {
        // console.log(val)
        this.setTarget(val)
      } else {
        this.clearNodesStyles()
      }
    }
  },
  methods: {
    init: function () {
      this.svg = this.$d3.select("svg")
                    .attr("width", this.width)
                    .attr("height", this.height);
      this.g =  this.svg.append("g").attr("transform", `translate(0,${this.height/4})`)//"translate(" + (this.width / 2 + 40) + "," + (this.height / 2 + ")")
      this.root = this.$d3.hierarchy(this.testData, function(d) { return d.children; });
      this.root.x0 = this.width/2;
      this.root.y0 = 0;
      this.root.children.forEach(this.collapse);

      this.tree =  this.$d3.tree()
                            .size([this.width, this.height])
                            // .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });


      this.update(this.root)

    },
    update: function (source) {
      let treeData = this.tree(this.root);
      let nodes = treeData.descendants(),
          links = treeData.descendants().slice(1);

      nodes.forEach(function(d){ d.y = d.depth * 50});
      let node = this.g.selectAll("g.node")
          .data(nodes, (d) => { return d.id });

      let nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
          .on('mouseover',this.mouseover())
          .on('mouseout',this.mouseout())
          .on('click', this.clickNode());

      nodeEnter.append('path')
          .attr("class", "icon")
          .attr("d",  (d) => {
            let path = nodeStyle.path.devices
            if (this.testData.children.length > 10 ) {
              path = nodeStyle.path.circle
            }
            return  d.data.router ? nodeStyle.path.router : path
          })
          .attr("transform", function (d) {
            let translate = nodeStyle.transform.large
            if (typeof this.testData === 'undefined'){
              translate = nodeStyle.transform.large
            }
            else if (  this.testData.children.length > 10 ) {
              translate = nodeStyle.transform.small
            }
            return d.data.router ? nodeStyle.transform.router : translate
          })
          .attr("fill", function(d) {
              return d.data.router ? "url(#Router)" : "url(#Device)";
          });

      nodeEnter.append('text')
          .attr("transform", (d) => {
            if (d.data.router) {
              return "rotate(0)"
            }
            return this.testData.children.length < 15 ? 'rotate(0)' : 'rotate(270)'
          })
          .attr("dx", (d) => {
            if (d.data.router) {
              return "-2.0em"
            }
            return this.testData.children.length < 15 ? "-2.6em" : "-9em"
          })
          .attr("dy", (d) => {
            if (d.data.router) {
              return "-0.2em"
            }
            return this.testData.children.length < 15 ? "3.36em" : "0.4em"
          })
          .text(function(d) { return d.data.ip; });

      let nodeUpdate = nodeEnter.merge(node);
      nodeUpdate.transition()
          .duration(this.duration)
          .attr("transform", function(d) {
              return "translate(" + d.x + "," + d.y + ")";
           });

      let nodeExit = node.exit().transition()
        .duration(this.shortDuration)
        .attr("transform", function(d) {
          return "translate(" + source.x + "," + source.y + ")";
        })
        .remove();

      nodeExit.select('circle')
        .attr('r', 1e-6);

      nodeExit.select('text')
        .style('fill-opacity', 1e-6);

      let link = this.g.selectAll('path.link')
          .data(links, function(d) { return d.id; });

      let linkEnter = link.enter().insert('path', "g")
        .attr("class", "link")
        .attr('d', (d) => {
          var o = {x: source.x0, y: source.y0}
          return this.diagonal(o, o)
        });

      let linkUpdate = linkEnter.merge(link);

      linkUpdate.transition()
        .duration(this.duration)
        .attr('d', (d) => { return this.diagonal(d, d.parent) });

    let linkExit = link.exit().transition()
      .duration(this.shortDuration)
      .attr('d', (d) => {
        var o = {x: source.x, y: source.y}
        return this.diagonal(o, o)
      })
      .remove();

    nodes.forEach(function(d){
      d.x0 = d.x;
      d.y0 = d.y;
    });
  },
  collapse: function (d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(this.collapse);
        d.children = null;
      }
    },
  click: function(d){
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    this.update(d)
  },
  diagonal: function(s, d) {

   return `M ${s.x} ${s.y}
            C ${s.x} ${(s.y + d.y) / 2},
              ${d.x} ${(s.y + d.y) / 2},
              ${d.x} ${d.y}`
  },
  mouseover: function(){
    const vue = this
    return function (d) {
      if(vue.currentTool === 'Network'){
        vue.clearNodesStyles()
        // console.log(this.path)
        vue.$d3.select(this).attr('fill','url(#Target)')
        vue.$store.dispatch('setHoverNode', d.data)
      }
    }
  },
    mouseout: function(d) {
      const vue = this
      return function (d) {
        if (vue.currentTool === 'Network') {
          let fill =  d.data.router? 'url(#Router)' :'url(#Device)';
          if (vue.target) {
            fill = (vue.target.ip === d.data.ip) ? 'url(#Target)' :'url(#Device)' ;
          }
          vue.$d3.select(this).attr('fill',"#222")
        }
      }
    },
  clickNode: function (d) {
    const vue = this
    return function (d){
      if (vue.currentTool === 'Network' && !d.data.router) {
        vue.clearNodesStyles()
        vue.$d3.select(this).attr('fill','url(#Target)')
        vue.$store.dispatch('setTarget', d.data)
      }
    }
  },
  tableHover: function (node) {

    this.clearNodesStyles()
    this.$d3.selectAll("path.icon")
            .filter(function(d, i) {  return (typeof d.data === 'undefined') ? false : (d.data.ip === node.ip); })
            .attr('fill','url(#Target)')
    if (this.target){
      const target = this.target
      this.$d3.selectAll("path.icon")
              .filter(function(d, i) { return (typeof d.data === 'undefined') ? false : (d.data.ip === target.ip); })
              .attr('fill','url(#Target)')
    }
  },
  setTarget: function (node) {
    this.clearNodesStyles()
    this.$d3.selectAll("path.icon")
            .filter(function(d, i) { console.log(d.data.ip === node.ip); return (typeof d.data === 'undefined') ? false : (d.data.ip === node.ip); })
            .attr('fill','url(#Target)');
  },
  clearNodesStyles: function () {
    this.$d3.selectAll("path.icon")
            .filter(function(d, i) { return typeof d.data !== 'undefined'})
            .attr('fill','url(#Device)')

    this.$d3.selectAll("path.icon")
            .filter(function(d, i) { return (typeof d.data === 'undefined') ? false : d.data.router })
            .attr('fill','url(#Router)')
    if(this.target){
      let target = this.target
      this.$d3.selectAll("icon")
              .filter(function(d, i) { return (typeof d.data === 'undefined') ? false : (d.data.ip === target.ip); })
              .attr('fill','url(#Target)');
    }
  },
  testAddNodes: function () {
    let newTree = this.$d3.hierarchy(this.testData, function(d) { return d.children; });
    let treeData = this.tree(newTree)
    this.root.children.push(treeData.children.pop())
    this.update(this.root)
  }
  }
}
</script>

<style>
  .icon {
    /*color: white;*/
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
    stroke: #ccc;
    stroke-width: 2px;
  }
</style>
