<template>
  <div>
    <div v-for="p in packet.payload">
      {{p}}
    </div>

  </div>
</template>

<script>
// import {payloadParser} from '../../filters'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'snifferPayload',
  props: ['packet'],
  created () {

  },
  computed: mapGetters({
    toolRunning: 'toolRunning',
    packets: 'packets'
  }),
  components:{
  },
  filters:{
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
