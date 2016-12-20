<template>

  <div id="viz-main"  class="viz-container">
  <svg id="test"> </svg>
  </div>

</template>

<script>
import Grid from './Grid'
import * as d3Force from 'd3-force'
import {mapGetters, mapActions} from 'vuex'
export default {
  name: 'Viz',
  props: [ ],
  created () {
    window.addEventListener('load', () => {
      const w = this.$el.clientWidth
      const h = this.$el.clientHeight;
      this.vis = this.$d3.select("svg").attr("width", w).attr("height", h);
      this.background = this.vis.append("g");
      this.grid = new Grid(w, h)
      this.grid.init()

      let gridCanvas = this.vis.append("svg:g").attr("class", "gridcanvas");
      this.grid.cells.map(function(c) {
          gridCanvas.append("svg:circle").attr("cx", c.x).attr("cy", c.y).attr("r", 2).style("fill", "#555").style("opacity", .3);
      });

      this.dummy = this.loadDummy()

      this.simulation = this.$d3.forceSimulation()
                          .force("link", this.$d3.forceLink().iterations(4).id(function(d) { return d.id; }))
                          .force("charge", this.$d3.forceManyBody().strength(-18))
                          .force("center", this.$d3.forceCenter(w/2 ,h/2));

      this.link = this.vis.append("g")
                        .attr("class", "links")
                        .selectAll("line")
                        .data(this.dummy.links)
                        .enter().append("line")
                        .attr("stroke", function(d) { return 'blue'; })
                        .attr("stroke-width", function(d) { return Math.sqrt(d.weight); });

      this.node = this.vis.append("g")
                    .attr("class", "nodes")
                    .selectAll("circle")
                    .data(this.dummy.nodes)
                    .enter().append("circle")
                    .attr("r", 6)
                    .attr("fill", function(d) { return 'red'; })
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
    })
  },
  data() {
    return{
      dummy: {},
      node:{},
      link:{},
      force : {},
      simulation: {},
      vis:{},
      background: {},
      grid: {}
    }
  },
  components:{
  },
  filters:{
  },
  computed: mapGetters({
  }),
  methods:{
    loadDummy: function(){
        let dummy = {nodes:[], links:[]}
          for(var i = 0; i < 10; i++) {
              var node = { id : i };
              dummy.nodes.push(node);
          }

          for(var i = 0; i < dummy.nodes.length; i++) {
              for(var j = 0; j < i; j++) {
                  if(Math.random() > .99-Math.sqrt(i)*.02)
                      dummy.links.push({
                          source : i,
                          target : j,
                          weight :2
                      });
              }
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
    }
  }
}
</script>

<style scoped>

</style>
