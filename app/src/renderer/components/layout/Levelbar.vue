<template>
<section>
  <nav v-if="this.$route.name==='Network'" class="level stats-network is-marginless">
    <div v-for="stat in networkStats" class="level-item has-text-centered">
      <div>
        <p class="heading">{{stat.heading}}</p>
        <p class="title">{{stat.title}}</p>
      </div>
    </div>
  </nav>
  <nav v-if="this.$route.name==='Sniffer'" class="level stats-sniffer is-marginless">
    <div v-for="stat in snifferStats" class="level-item has-text-centered">
      <div>
        <p class="heading">{{stat.heading}}</p>
        <p class="title">{{stat.title}}</p>
      </div>
    </div>
  </nav>
</section>
</template>

<script>
// import Breadcrumb from 'vue-bulma-breadcrumb'
// import Tooltip from 'vue-bulma-tooltip'
import {mapGetters} from 'vuex'
export default {
  components: {
  },
  data () {
    return {
      list: null
    }
  },
  created () {
    this.getList()
  },
  computed: {
    codelink () {
      if (this.$route.meta && this.$route.meta.link) {
        return 'https://github.com/vue-bulma/vue-admin/blob/master/client/views/' + this.$route.meta.link
      } else {
        return null
      }
    },
    name () {
      return this.$route.name
    },
    networkStats () {
      let text = []
      text.push({
        heading: 'Devices On Network',
        title: this.devices.length
      })
      text.push({
        heading: 'Host Name',
        title: this.host.name
      })
      text.push({
        heading: 'Private IP',
        title: this.host.ip
      })
      text.push({
        heading: 'Public IP🌍',
        title: this.publicIp ? this.publicIp : 'Not available'
      })
      return text
    },
    snifferStats () {
      let text = []
      let deviceText = ''
      if (this.target.host) {
        deviceText = '💻 This Computer 💻'
      } else {
        deviceText = this.target.name ? this.target.name : this.target.mac
      }

      text.push({
        heading: 'Current Target',
        title: deviceText
      })
      text.push({
        heading: 'Host Name',
        title: this.host.name
      })
      return text
    },
    ...mapGetters([
      'host',
      'target',
      'publicIp',
      'devices',
      'maxPossibleDevices'])
  },
  methods: {
    getList () {
      let matched = this.$route.matched.filter(item => item.name)
      let first = matched[0]
      if (first && (first.name !== 'Home' || first.path !== '')) {
        matched = [{ name: 'Home', path: '/' }].concat(matched)
      }
      this.list = matched
    }
  },
  watch: {
    $route () {
      this.getList()
    }
  }
}
</script>
<style lang='scss'>
@import '../../globals.scss';
.stats-network.level {
  background-color: $bright-orange;
}
.stats-sniffer.level {
  background-color: $infra-red;
}
.heading {
  color: whitesmoke;
}
.title {
  color: $purplecolor;

}
</style>
