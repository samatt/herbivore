<template>
  <pre> {{network}} {{Date.now()}}</pre>

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
    // NetworkInfo.init()
    // networkEvents.on('info_available', (info) => {
      // this.info = info
    // console.log(NetworkEvents)
    // })
  },
  computed: mapGetters(['network'])
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
