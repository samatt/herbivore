<template>

  <div id="viz-main"  class="viz-container">
  <svg id="test"> </svg>
  </div>

</template>

<script>
import Grid from './Grid'
import * as d3Force from 'd3-force'
import {mapGetters} from 'vuex'
export default {
  name: 'Viz',
  props: [ 'vdata', 'newNode' ],
  mounted () {
    this.dummy = this.loadDummy()
    this.width = this.$el.clientWidth
    this.height = this.$el.clientHeight;
  },
  watch: {
    newNode: function (){
              console.log('there!')
          }
  },
  data() {
    return{
      dummy: {},
      width: 0,
      height: 0,
      node:{},
      link:{},
      force : {},
      simulation: {},
      viz:{},
      background: {},
      grid: {}
    }
  },
  components:{
  },
  filters:{
  },
  methods:{
    initViz: function(){
      this.vis = this.$d3.select("svg").attr("width", this.width).attr("height", this.height);
      this.background = this.vis.append("g");
      this.grid = new Grid(this.width, this.height)
      this.grid.init()
      let gridCanvas = this.vis.append("svg:g").attr("class", "gridcanvas");
      this.grid.cells.map(function(c) {
          gridCanvas.append("svg:circle").attr("cx", c.x).attr("cy", c.y).attr("r", 2).style("fill", "#555").style("opacity", .3);
      });

      this.dummy = this.loadDummy()
      this.dummy.nodes = this.vdata.nodes
      this.dummy.links = this.vdata.links

      this.simulation = this.$d3.forceSimulation()
                          .force("link", this.$d3.forceLink().iterations(4))
                          .force("charge", this.$d3.forceManyBody().strength(-18))
                          .force("center", this.$d3.forceCenter(this.width/2 ,this.height/2));
      // console.log(this.nodes)
      this.link = this.vis.append("g")
                        .attr("class", "links")
                        .selectAll("line")
                        .data(this.dummy.links)
                        .enter().append("line")
                        .attr("stroke", function(d) { return '#6f737d'; })
                        .attr("stroke-width", function(d) { return Math.sqrt(d.weight); });

      this.node = this.vis.append("g")
                    .attr("class", "nodes")
                    .selectAll("circle")
                    .data(this.dummy.nodes)
                    .enter().append("circle")
                    .attr("r", 6)
                    .attr("fill", function(d) { return '#584f9e'; })
                    .call(this.$d3.drag()
                              .subject(this.dragsubject)
                              .on("start", this.dragstarted)
                              .on("drag", this.dragged)
                              .on("end", this.dragended));
      this.simulation
          .nodes(this.dummy.nodes)
          .on("tick", this.gridTicked);

      this.simulation.force("link")
          .links(this.dummy.links);
    },
    loadDummy: function(){
        let dummy = {nodes:[], links:[]}
          for(var i = 0; i < 50; i++) {
              var node = { id : i, ip:'192.168.0.1', mac:'AA:BB', router:false };
              dummy.nodes.push(node);
          }
          for(var i = 0; i < dummy.nodes.length; i++) {
              dummy.links.push({
                  source : 0,
                  target : i,
                  weight :2
              });
          }
          return dummy;
    },
    ticked: function () {
      this.link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      this.node.attr("cx", function(d) { return d.x; })
               .attr("cy", function(d) { return d.y; });
    },
    gridTicked: function() {
      this.vis.select("g.gridcanvas").remove();
      this.grid.init();
      let gridCanvas = this.vis.append("svg:g").attr("class", "gridcanvas");
      this.grid.cells.map(function(c) {
          gridCanvas.append("svg:circle").attr("cx", c.x).attr("cy", c.y).attr("r", 2).style("fill", "#555").style("opacity", .3);
      });

      this.node.attr("transform", (d) =>{
        var gridpoint = this.grid.occupyNearest(d);
        if(gridpoint) {
            d.screenX = d.screenX || gridpoint.x;
            d.screenY = d.screenY || gridpoint.y;
            d.screenX += (gridpoint.x - d.screenX) * .2;
            d.screenY += (gridpoint.y - d.screenY) * .2;
            d.x += (gridpoint.x - d.x) * .05;
            d.y += (gridpoint.y - d.y) * .05;
        }else{
            d.screenX = d.x;
            d.screenY = d.y;
        }
        return "translate(" + d.screenX + "," + d.screenY + ")";
      })

      this.link.attr("x1", function(d) {return d.source.screenX;})
                .attr("y1", function(d) { return d.source.screenY;})
                .attr("x2", function(d) { return d.target.screenX;})
                .attr("y2", function(d) {return d.target.screenY;});
    },
    dragstarted: function(d) {
      if (!this.$d3.event.active) this.simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    },
    dragged: function(d) {
      d.fx = this.$d3.event.x;
      d.fy = this.$d3.event.y;
    },
    dragended: function(d) {
      if (!this.$d3.event.active) this.simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    },
    dragsubject: function() {
      return this.simulation.find(this.$d3.event.x, this.$d3.event.y);
    },
    init_olds: function () {
      this.vis = this.$d3.select("svg").attr("width", this.width).attr("height", this.height);
      this.background = this.vis.append("g");
      this.grid = new Grid(this.width, this.height)
      this.grid.init()
      let gridCanvas = this.vis.append("svg:g").attr("class", "gridcanvas");
      this.grid.cells.map(function(c) {
          gridCanvas.append("svg:circle").attr("cx", c.x).attr("cy", c.y).attr("r", 2).style("fill", "#555").style("opacity", .3);
      });
      console.log('Grid set up complete')
      this.link = this.vis.append("g")
                        .attr("class", "links")
                        .attr("stroke", function(d) { return '#6f737d'; })
                        .selectAll("line")

      this.node = this.vis.append("g")
                    .attr("class", "nodes")
                    .attr("r", 6)
                    .attr("fill", function(d) { return '#584f9e'; })
                    .selectAll("circle")


      console.log('Set up nodes + links')                          // .force("link", this.$d3.forceLink().iterations(4).id(function(d, i) { return d.id; }))
      this.simulation = this.$d3.forceSimulation()
                          .force("link", this.$d3.forceLink().iterations(4))
                          .force("charge", this.$d3.forceManyBody().strength(-18))
                          .force("center", this.$d3.forceCenter(this.width/2 ,this.height/2))
                          .on("tick", this.gridTicked);

      console.log('Set up simulation')
      this.refresh_old()


    },
    refresh_old: function () {

        console.log(this.dummy.nodes, this.vdata.nodes)
        // this.dummy.nodes = this.vdata.nodes
        // this.dummy.links = []
        this.node = this.node.data(this.dummy.nodes, function(d) { return d.id;});
        // console.log(this.dummy.nodes.length)
        this.node.exit().remove();
        this.node = this.node
                        .enter().append("circle")
                        .attr("r", 6)
                        .attr("fill", function(d) { return '#584f9e'; })
                        .merge(this.node);
        // Apply the general update pattern to the links.

        this.link = this.link.data(this.dummy.links, function(d) { return d.source.id + "-" + d.target.id; });
        this.link.exit().remove();
        this.link = this.link
                        .enter().append("line")
                        .attr("stroke", function(d) { return '#6f737d'; })
                        .attr("stroke-width", function(d) { return Math.sqrt(d.weight); })

        // Update and restart the simulation.
        // this.simulation.nodes(this.dummy.nodes);
        // this.simulation.force("link").links(this.dummy.links);
        // this.simulation.alpha(1).restart();
    },
  }
}
</script>

<style scoped>

</style>
