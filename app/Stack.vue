<template>
  <div id="stack">
    <h1>{{ msg }}</h1>
    <div style="padding-left: 20%; padding-right: 20%;">

      <div class="stack-container">
        <div class="stack-element" @mouseout="currentHover=''" @mouseover="onMouseOver('eth',$event)"> Ethernet </div>
        <div class="stack-element" @mouseout="currentHover=''" @mouseover="onMouseOver('ip',$event)"> IP </div>
        <div class="stack-element" @mouseout="currentHover=''" @mouseover="onMouseOver('tcp',$event)"> TCP </div>
        <div class="stack-element" @mouseout="currentHover=''" @mouseover="onMouseOver('http',$event)"> HTTP </div>
      </div>

      <div style="details-container">
        <ul>
          <li  v-bind:class="currentHover === 'eth' ? activeClass : ''"> Source MAC: {{packet.eth.shost.addr.join(":")}}</li>
          <br/>
          <li  v-bind:class="currentHover === 'eth' ? activeClass : ''"> Destination MAC: {{packet.eth.dhost.addr.join(":")}}</li>
          <br/>
          <li v-bind:class="currentHover === 'ip' ? activeClass : ''"> Source IP: {{packet.ip.saddr.addr.join(".")}}</li>
          <br/>
          <li v-bind:class="currentHover === 'ip' ? activeClass : ''"> Dest IP: {{packet.ip.daddr.addr.join(".")}}</li>
          <br/>
          <li v-bind:class="currentHover === 'tcp' ? activeClass : ''"> Source Port: {{packet.tcp.sport}}</li>
          <br/>
          <li v-bind:class="currentHover === 'tcp' ? activeClass : ''"> Dest Port: {{packet.tcp.dport}}</li>
          <br/>
        </ul>
      </div>
      <!-- {{packet}} -->
      <pre v-bind:class="currentHover === 'http' ? activeClass : ''" style=" text-align:left;">{{packet.tcp.data.data}}</pre>
  </div>
  </div>
</template>

<script>
  export default {
    name: 'stack',
    props: {
      packet: {eth: '', ip: '', tcp: ''}
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

  .highlighted{
    background-color: yellow;
  }
</style>
