<template>
<div>
  Router Info
  <pre> {{gateway}}</pre>
  Host info
  <pre> {{host}}</pre>
  Max Possible devices on network (this is based on calculating range of ips using the gateway and subnet mask)
  <pre> {{maxPossibleDevices}}</pre>
  Number of devices seen
  <pre> {{devices.length}}</pre>

</div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  created () {
    // Set $route values that are not preset during unit testing
    if (process.env.NODE_ENV === 'testing') {
      this.$route = {
        name: 'landing-page',
        path: '/landing-page'
      }
    }
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

  p { line-height: 24px; }
</style>
