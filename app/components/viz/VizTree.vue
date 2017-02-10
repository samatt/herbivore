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
      <linearGradient id="Target" x1="0%" y1="34%" x2="100%" y2="66%" >
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

export default {
  name: 'VizTree',
  props: [ ],
  mounted () {
    this.width = this.$el.clientWidth
    this.height = this.$el.clientHeight < 800 ? 400 :this.$el.clientHeight;
  },
  update () {
    console.log("VIZ UPDATE")
  },
  components:{
  },
  data() {
    return{
      devices:`M-1,19.072v-14.4c0-1.139,0.952-2.044,2.151-2.044h22.438c1.201,0,2.152,0.905,2.152,2.044v4.469h-2.95V5.402H1.95v12.912
      h15.922v2.832h-3.073v2.279h1.723c0.276,0,0.521,0.234,0.521,0.497v1.432c0,0.263-0.245,0.497-0.521,0.497H8.251
      c-0.276,0-0.522-0.234-0.522-0.497v-1.432c0-0.263,0.247-0.497,0.522-0.497h1.722v-2.279H1.151C-0.017,21.119-1,20.212-1,19.072z
       M29,23.864v-0.583v-0.438v-9.699v-0.497c0-0.905-0.768-1.665-1.691-1.665h-5.777c-0.922,0-1.69,0.759-1.69,1.665v0.497v10.721
      v0.293c0,0.904,0.769,1.663,1.69,1.663h5.777c0.924,0,1.691-0.759,1.691-1.663V23.864z`,
      router:`M4.954,938.337c-0.54,0-1.117,0.267-1.416,0.75c-0.298,0.483-0.317,1.118-0.052,1.62l7.538,15.09H5.499
    c-2.088,0-3.819,1.733-3.819,3.82v9.823c0,2.085,1.731,3.82,3.819,3.82h41.468c2.087,0,3.82-1.735,3.82-3.82v-9.823
    c0-2.087-1.733-3.82-3.82-3.82h-5.523l7.537-15.09c0.272-0.509,0.243-1.167-0.066-1.654c-0.312-0.486-0.856-0.715-1.4-0.715
    c-0.572,0-1.214,0.369-1.465,0.903l-8.288,16.557H14.708L6.42,939.24C6.161,938.692,5.528,938.337,4.954,938.337z M5.499,959.072
    h41.468c0.333,0,0.547,0.215,0.547,0.545v9.823c0,0.329-0.214,0.547-0.547,0.547H5.499c-0.331,0-0.545-0.218-0.545-0.547v-9.823
    C4.954,959.286,5.168,959.072,5.499,959.072z M7.682,960.163c-0.883,0-1.637,0.946-1.637,1.636v5.459
    c0,0.855,0.78,1.634,1.637,1.634h5.456c0.857,0,1.637-0.779,1.637-1.634v-5.459c0-0.856-0.78-1.636-1.637-1.636H7.682z
     M17.503,960.163c-0.882,0-1.636,0.946-1.636,1.636v5.459c0,0.855,0.781,1.634,1.636,1.634h5.456c0.859,0,1.639-0.779,1.639-1.634
    v-5.459c0-0.856-0.779-1.636-1.639-1.636H17.503z M27.156,960.163c-0.8,0.082-1.472,0.833-1.469,1.636v5.459
    c0,0.855,0.782,1.634,1.637,1.634h5.457c0.856,0,1.637-0.779,1.637-1.634v-5.459c0-0.856-0.78-1.636-1.637-1.636h-5.457
    C27.268,960.159,27.21,960.159,27.156,960.163z M42.057,960.163c-2.39,0-4.365,1.973-4.365,4.362c0,2.396,1.976,4.367,4.365,4.367
    c2.392,0,4.368-1.971,4.368-4.367C46.425,962.136,44.448,960.163,42.057,960.163z M9.32,963.438h2.182v2.182H9.32V963.438z
     M19.142,963.438h2.182v2.182h-2.182V963.438z M28.961,963.438h2.184v2.182h-2.184V963.438z M42.057,963.438
    c0.625,0,1.095,0.468,1.095,1.087c0,0.626-0.47,1.095-1.095,1.095c-0.622,0-1.089-0.469-1.089-1.095
    C40.968,963.906,41.435,963.438,42.057,963.438z`,
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
    }
  },
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
      this.root = this.$d3.hierarchy(empty, function(d) { return d.children; });
      this.root.x0 = this.width/2;
      this.root.y0 = 0;
      this.update(this.root)

      this.root = this.$d3.hierarchy(this.testData, function(d) { return d.children; });
      this.root.x0 = this.width/2;
      this.root.y0 = 0;
      this.root.children.forEach(this.collapse);
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
        console.log(val)
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

      nodes.forEach(function(d){ d.y = d.depth * 180});
      let node = this.g.selectAll("g.node")
          .data(nodes, (d) => { return d.id });

      let nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .attr("width", "10px")
          .attr("height", "10px")
          .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
          .on('mouseover',this.mouseover())
          .on('mouseout',this.mouseout())
          .on('click', this.clickNode());

      nodeEnter.append('path')
          .attr("class", "icon")
          .attr("d",  (d) => {return  d.data.router ? this.router : this.devices})
          .attr("transform", function (d) {return d.data.router ? "translate(-25,-990)" : "translate(-10,0)"} )
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
