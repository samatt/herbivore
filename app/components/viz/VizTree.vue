<template>
  <div id="viz-main">
    <svg> </svg>
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
      testData: {
        "name": "Gateway",
        "router" :true,
        "children": [
          {
            "name": "192.168.1.10",
            "children": [
              { "name": "Son of A" },
              { "name": "Daughter of A" }
            ]
          },
          { "name": "192.168.1.10" },
          { "name": "192.168.1.10" },
          { "name": "192.168.1.10" },
          { "name": "192.168.1.10" },
          { "name": "192.168.1.10" },
          { "name": "192.168.1.10" },
          { "name": "192.168.1.10" },
          { "name": "192.168.1.10" },
          { "name": "192.168.1.10" },
          { "name": "192.168.1.10" },

          { "name": "192.168.1.10" },
          { "name": "192.168.1.10" }
        ]
      }
    }
  },
  sockets:{
    info: function(info){
      const gn = {ip: this.gateway, mac:'', id: 0, router: true }
      const n = {ip: this.privateIp, mac: this.mac, id: 1, router: false }
      const l = {source: 0, target: 1, weight: 4}
      this.vdata.nodes.push(gn)
      this.vdata.nodes.push(n)
      this.vdata.links.push(l)
      this.init()
    },
    clearStyles: function () {
    },
    clearViz: function () {
    },
    addNode: function(node) {
      // const idx = this.vdata.nodes.length;
      // node.router = node.ip === this.gateway;
      // node.id = idx
      // if(node.router){
      //   this.$store.dispatch('updateRouterMac', node)
      // }
      // else{
      //   const l = {source: 0, target: idx, weight: 4}
      //   this.$store.dispatch('addNewNode', node)
      //   this.vdata.nodes.push(node)
      //   this.vdata.links.push(l)
      // }
      // this.refresh()
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
  },
  methods: {
    init: function () {
      this.svg = this.$d3.select("svg")
                    .attr("width", this.width)
                    .attr("height", this.height);
      this.g =  this.svg.append("g").attr("transform", `translate(0,${this.height/4})`)//"translate(" + (this.width / 2 + 40) + "," + (this.height / 2 + ")")
      this.root = this.$d3.hierarchy(this.testData, function(d) { return d.children; });
      this.root.x0 = 0;
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
          .data(nodes, (d) => { return d.id || (d.id = ++this.i); });

      let nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .attr("width", "10px")
          .attr("height", "10px")
          .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
          .on("click", this.click);

      nodeEnter.append('path')
          .attr("d",  (d) => {return  d.data.router ? this.router : this.devices})
          .attr("transform", function (d) {return d.data.router ? "translate(-25,-990)" : "translate(-10,0)"} )
          .style("fill", function(d) {
              return d.data.router ? "#70C041" : "#EC5D57";
          });
          // .attr('class', 'node')
          // .attr('r', 1e-6)
          // .attr("dx", "-7em")
          // .attr("dy", "0.4em")
      nodeEnter.append('text')
          .attr("transform", (d) => {
            return this.testData.children.length < 15 ? 'rotate(0)' : 'rotate(270)'
          })
          .attr("dx", (d) => {
            if (d.data.router) {
              return "-2.0em"
            }
            console.log(this.testData.children.length); return this.testData.children.length < 15 ? "-2.6em" : "-7em"
          })
          .attr("dy", (d) => {
            if (d.data.router) {
              return "-0.2em"
            }
            return this.testData.children.length < 15 ? "3.36em" : "0.4em"
          })
          .text(function(d) { return d.data.name; });
          // .attr("text-anchor", function(d) {
          //     return d.children || d._children ? "end" : "start";
          // })
      let nodeUpdate = nodeEnter.merge(node);
      nodeUpdate.transition()
          .duration(this.duration)
          .attr("transform", function(d) {
              return "translate(" + d.x + "," + d.y + ")";
           });

      nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style("fill", function(d) {
          return d._children ? "lightsteelblue" : "#fff";
        })
        .attr('cursor', 'pointer');

      let nodeExit = node.exit().transition()
        .duration(this.duration)
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
          var o = {x: source.y0, y: source.y0}
          return this.diagonal(o, o)
        });

      let linkUpdate = linkEnter.merge(link);

      linkUpdate.transition()
        .duration(this.duration)
        .attr('d', (d) => { return this.diagonal(d, d.parent) });

    let linkExit = link.exit().transition()
      .duration(this.duration)
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
  clearNodesStyles: function () {
    this.$d3.selectAll("circle")
            .filter(function(d, i) { return typeof d !== 'undefined'})
            .attr('fill','#584f9e').attr('r', 8)

    this.$d3.selectAll("circle")
            .filter(function(d, i) { return (typeof d === 'undefined') ? false : d.router })
            .attr('fill','#6f737d').attr('r', 8)
    if(this.target){
      let target = this.target
      this.$d3.selectAll("circle")
              .filter(function(d, i) { return (typeof d === 'undefined') ? false : (d.ip === target.ip); })
              .attr('fill','orange');
    }

  }
  }
}
</script>

<style>
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
