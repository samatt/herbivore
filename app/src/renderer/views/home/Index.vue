<template>
<section>
<div class="splash">
  <h1 class="title">Welcome to Herbivore</h1>

  <div class="subtitle is-3"></div>
    A tool that lets you take a deeper look at the packets traveling through your networks.
    </br>
    First go checkout whats happening on your
    <router-link to="/network" :exact="true">
      current network
    </router-link>
  </div>
</div>
</section>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  created () {
  },
  computed: mapGetters(['gateway',
    'host',
    'devices',
    'maxPossibleDevices'])
}
</script>

<style scoped>
  code {
    background-color: rgba(40, 56, 76, .5);
    border-radius: 3px;
    color: #fff;
    font-weight: bold;
    padding: 3px 6px;
    margin: 0 3px;
    vertical-align: bottom;
  }

  .splash {
    padding-top: 25%;
  }
</style>
