<template>
  <section>
    <browser/>
  </section>
</template>

<script>
import {mapGetters} from 'vuex'
import Browser from './Browser'
export default {
  created () {
  },
  components: {
    Browser
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
