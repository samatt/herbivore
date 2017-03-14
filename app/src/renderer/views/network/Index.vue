<template>
  <div>
    <info/>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Info from './Info'
export default {
  created () {
  },
  components: {
    Info
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
