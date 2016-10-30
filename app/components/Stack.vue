<template>
  <div id="stack">
    <h1>{{ msg }}</h1>
    <div style="padding-left: 20%; padding-right: 20%;">

      <div class="stack-container" style="float:left;">
        <div class="stack-element" @mouseout="currentHover=''" @mouseover="onMouseOver('eth',$event)"> Ethernet </div>
        <div class="stack-element" @mouseout="currentHover=''" @mouseover="onMouseOver('ip',$event)"> IP </div>
        <div class="stack-element" @mouseout="currentHover=''" @mouseover="onMouseOver('tcp',$event)"> TCP </div>
        <div class="stack-element" @mouseout="currentHover=''" @mouseover="onMouseOver('http',$event)"> HTTP </div>
      </div>

      <div class="details-container" style="float:right;">
        <ul>
          <li  v-bind:class="currentHover === 'eth' ? activeClass : ''"> Source: {{packet.eth.shost.addr | stringifyMac}}</li>
          <br/>
          <li  v-bind:class="currentHover === 'eth' ? activeClass : ''"> Destination: {{packet.eth.dhost.addr | stringifyMac}}</li>
          <br/>
          <li v-bind:class="currentHover === 'ip' ? activeClass : ''"> Source: {{packet.ip.saddr.addr.join(".")}}</li>
          <br/>
          <li v-bind:class="currentHover === 'ip' ? activeClass : ''"> Dest: {{packet.ip.daddr.addr.join(".")}}</li>
          <br/>
          <li v-bind:class="currentHover === 'tcp' ? activeClass : ''"> Source: {{packet.tcp.sport}}</li>
          <br/>
          <li v-bind:class="currentHover === 'tcp' ? activeClass : ''"> Dest: {{packet.tcp.dport}}</li>
          <br/>
        </ul>
      </div>
      <!-- {{packet}} -->
  </div>
  <pre v-bind:class="[currentHover === 'http' ? activeClass : '','http']">{{packet.http}}</pre>
  </div>
</template>

<script>
import {stringifyMac} from '../filters'
  export default {
    name: 'stack',
    props: {
      packet: {eth: '', ip: '', tcp: ''},
      mymsg: ''
    },
    data () {
      return {
        msg: 'This is the stack component',
        currentHover: '',
        activeClass: 'highlighted'
      }
    },
    methods: {
      onMouseOver (msg, e) {
        this.currentHover = msg
      }
    },
    filters:{
      stringifyMac
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
    text-align: left;
  }

  li {
    display: inline-block;
    margin: 0 0px;
  }

  a {
    color: #42b983;
  }
  .stack-container{

  }

  .stack-element{
    background-color: #42b8b9;
    margin-bottom: 5px;
    border-style: solid;
    border-width: thin;
    font-size: 2em;

  }

  .stack-element:hover {
    background-color: #e8e53d;
  }
  .http{
    text-align:left;
    padding-top: 222px;
  }
  .highlighted{
    background-color: yellow;
  }
</style>
