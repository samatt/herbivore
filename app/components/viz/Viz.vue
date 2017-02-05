<template>
  <div id="viz-main">
    <svg id="test"> </svg>
  </div>
</template>

<script>
import Grid from './Grid'
import * as d3Force from 'd3-force'
import {mapGetters} from 'vuex'
export default {
  name: 'Viz',
  props: [ ],
  mounted () {
    this.dummy = this.loadDummy()
    this.width = this.$el.clientWidth
    this.height = this.$el.clientHeight < 500? 400 :this.$el.clientHeight;
    // if (this.vdata.node.length > 0){
    //   // this.init()
    //   // TODO: STORE GRAPH STATE
    // }
  },
  update () {
    console.log("VIZ UPDATE")
  },
  components:{
  },
  data() {
    return{
      dummy: {},
      vdata: {nodes:[], links:[]},
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
      // console.log(this.$d3.selectAll('.links'))
      this.$d3.selectAll('line').attr("stroke", '#6f737d')
      // this.$d3.selectAll('.links').attr("stroke", '#6f737d')
      // this.$d3.selectAll(".nodes")
      //               .attr("fill",'blue')
    },
    addNode: function(node) {
      const idx = this.vdata.nodes.length;
      node.router = node.ip === this.gateway;
      node.id = idx
      if(node.router){
        // this.vdata.nodes[0].mac = node.mac
        this.$store.dispatch('updateRouterMac', node)
      }
      else{
        const l = {source: 0, target: idx, weight: 4}
        this.$store.dispatch('addNewNode', node)
        this.vdata.nodes.push(node)
        this.vdata.links.push(l)
      }
      this.refresh()
    }
  },
  computed: mapGetters({
      gateway:'gateway',
      privateIp:'privateIp',
      mac: 'mac',
      gatewayMac: 'gatewayMac',
      currentTool: 'currentTool'
  }),
  filters:{
  },
  methods:{
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

      this.node.attr("cx", function(d) {return d.x; })
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
            return "translate(" + d.screenX + "," + d.screenY + ")";
        }else{
            d.screenX = d.x ;
            d.screenY = d.y ;
            return "translate(" + d.screenX + "," + d.screenY + ")";
        }

      })

      this.link.attr("x1", function(d) {return d.source.screenX;})
                .attr("y1", function(d) { return d.source.screenY;})
                .attr("x2", function(d) { return d.target.screenX;})
                .attr("y2", function(d) {return d.target.screenY;});
    },
    mouseover: function(){
      const vue = this
      return function (d) {
        if(vue.currentTool === 'Network'){
          vue.$d3.select(this).attr('fill','#4D74AB').attr('r', 10)
          vue.$store.dispatch('updateClickedNode', d)
        }
      }
    },
    mouseout: function(d) {
      const vue = this
      return function (d) {
        if(vue.currentTool === 'Network'){
          const fill =  d.router? '#6f737d' :'#584f9e';
          vue.$d3.select(this).attr('fill',fill).attr('r', 8)
          vue.$store.dispatch('updateClickedNode', d)
        }
      }
    },
    mouseoverLink: function(d){
      const vue = this
      return function (d) {
        if(vue.currentTool === 'PcapSniffer'){
          vue.$d3.select(this).attr("stroke-width", 6)
          // vue.$d3.select(this).attr('fill','#4D74AB').attr('r', 10)
            // console.log( d.source.ip, d.source.mac)
            // console.log( d.target.ip, d.target.mac)
          // vue.$store.dispatch('updateClickedNode', d)
        }
      }
    },
    mouseoutLink: function(d){
      const vue = this
      return function (d) {
        if(vue.currentTool === 'PcapSniffer'){
          vue.$d3.select(this).attr("stroke-width",4)
          // console.log( d.source.ip, d.source.mac)
          // console.log( d.target.ip, d.target.mac)
        // vue.$store.dispatch('updateClickedNode', d)
        }
      }
    },
    clickLink: function(d){
      const vue = this
      return function (d) {
        if(vue.currentTool === 'PcapSniffer'){
          vue.$d3.selectAll('line').attr("stroke", '#6f737d')
          vue.$d3.select(this).attr("stroke", 'orange')
          vue.$store.dispatch('updateClickedLink', d.target)
          vue.$socket.emit('updateTarget', {'target_ip':d.target.ip,
                                            'target_mac':d.target.mac,
                                            'self_mac':vue.mac,
                                            'gw_ip': vue.gateway,
                                            'gw_mac': vue.gatewayMac})
          // console.log( d.source.ip, d.source.mac)
          // console.log( d.target.ip, d.target.mac)
        // vue.$store.dispatch('updateClickedNode', d)
        }
      }
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
    init: function () {
      this.vis = this.$d3.select("svg").attr("width", this.width).attr("height", this.height);
      this.background = this.vis.append("g");
      this.grid = new Grid(this.width, this.height)
      this.grid.init()
      let gridCanvas = this.vis.append("svg:g").attr("class", "gridcanvas");
      this.grid.cells.map(function(c) {
          gridCanvas.append("svg:circle").attr("cx", c.x).attr("cy", c.y).attr("r", 2).style("fill", "#555").style("opacity", .3);
      });

      this.link = this.vis.append("g")
                        .attr("class", "links")
                        .attr("stroke", function(d) { return '#6f737d'; })
                        .selectAll("line")

      this.node = this.vis.append("g")
                    .attr("class", "nodes")
                    .attr("r", 8)
                    .attr("fill", function(d) { '#584f9e'; })
                    .selectAll("circle")

      this.simulation = this.$d3.forceSimulation()
                          .force("link", this.$d3.forceLink().iterations(4).id(function(d, i) { return d.id; }))
                          .force("charge", this.$d3.forceManyBody().strength(-200))
                          .force("center", this.$d3.forceCenter(this.width/2 ,this.height/2))
                          .on("tick", this.gridTicked);

      this.refresh()

    },
    refresh: function () {

        this.node = this.node.data(this.vdata.nodes, function(d) { return d.id;});
        this.node.exit().remove();
        this.node = this.node
                        .enter().append("circle")
                        .attr("r", 8)
                        .attr("id", function (d){return d.id})
                        .attr("fill", function(d) { return d.router? '#6f737d' :'#584f9e'; })
                        .merge(this.node)
                        .on('mouseover',this.mouseover())
                        .on('mouseout',this.mouseout())
                        .call(this.$d3.drag()
                                  .subject(this.dragsubject)
                                  .on("start", this.dragstarted)
                                  .on("drag", this.dragged)
                                  .on("end", this.dragended));

        // Apply the general update pattern to the links.
        this.link = this.link.data(this.vdata.links, function(d, i) { return d.id + "-" + d.target.id; });
        this.link.exit().remove();
        this.link = this.link
                        .enter().append("line")
                        .attr("stroke", function(d) { return '#6f737d'; })
                        .attr("stroke-width", function(d) { return d.weight; })
                        .merge(this.link)
                        .on('mouseover',this.mouseoverLink())
                        .on('mouseout',this.mouseoutLink())
                        .on('click',this.clickLink())

        // Update and restart the simulation.
        this.simulation.nodes(this.vdata.nodes);
        this.simulation.force("link").links(this.vdata.links);
        this.simulation.alpha(1).restart();
    },
  }
}
</script>

<style scoped>

</style>
