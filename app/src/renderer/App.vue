  <template>
  <div id="#app">
  <Navbar/>
  <Alerts/>
  <sidebar :show="sidebar.opened && !sidebar.hidden"></sidebar>
  <app-main/>
  </div>
</template>

<script>
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import AppMain from './components/layout/AppMain'
import Alerts from './components/layout/Alerts'
import {mapActions, mapGetters} from 'vuex'
import {HostInfo, NetworkInfo, Sniffer} from './network-events/'
export default {
  created () {
    window.addEventListener('keyup', this.keyup)
    this.clearPackets()
  },
  data () {
    return {
      views: ['home', 'network', 'sniffer'],
      viewIndex: 0
    }
  },
  mounted () {
    setTimeout(() => {
      this.startNetworkEvents()
    }, 1000)
  },
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Alerts
  },
  watch: {
    target (val) {
      const t = {
        'target_ip': val.ip,
        'target_mac': val.mac,
        'self_mac': this.host.mac,
        'gw_ip': this.gateway.ip,
        'gw_mac': this.gateway.mac
      }
      if (val.host) {
        Sniffer.updateTarget(t, {stop: true})
      } else if (val.router) {
        console.log('cant target router')
      } else {
        Sniffer.updateTarget(t)
      }
      this.startSniffer()
    },
    running (val) {
      if (val) {
        Sniffer.start()
      } else {
        Sniffer.stop()
      }
    }
  },
  computed: mapGetters([
    'gateway',
    'host',
    'target',
    'running',
    'sidebar']),
  methods: {
    startNetworkEvents: function () {
      // Always set Network Before Host
      this.setNetworkListeners()
      this.setHostListeners()
      HostInfo.init()
    },
    setHostListeners: function () {
      HostInfo.on('setPublicIp', (info) => {
        this.setPublicIp(info)
      })

      HostInfo.on('host_info_available', (info) => {
        const { ip_address, vendor, gateway_ip, name, netmask, mac_address } = info
        const host = {ip: ip_address,
          interface: name,
          mac: mac_address,
          vendor: vendor
        }
        this.setHostInfo(host)
        Sniffer.init(host)

        Sniffer.on('newPacket', (packet) => {
          this.newPacket(packet)
        })

        this.setNetworkInfo({gateway: {
          ip: gateway_ip,
          mac: null,
          vendor: null,
          name: null,
          host: false,
          router: true},
          netmask: netmask,
          publicIp: null
        })
        // Once we have information from the host we can query the network
        NetworkInfo.run(name, ip_address, gateway_ip, netmask)
      })
    },
    setNetworkListeners: function () {
      NetworkInfo.on('maxPossibleDevices', (max) => {
        this.maxPossibleDevices(max)
      })

      NetworkInfo.on('addDevice', (device) => {
        this.addDevice(device)
      })

      NetworkInfo.on('updateName', (info) => {
        this.updateName(info)
      })

      NetworkInfo.on('error', (error) => {
        // this.addDevice(error)
        console.warn(error)
      })

      NetworkInfo.on('warning', (warn) => {
        // console.warn(warn)
        // console.log('^^^^ if its the dig command that is normal')
      })
    },
    keyup (e) {
      // left
      console.log(this.$route.name)
      if ((e.keyCode || e.which) === 37) {
        if (this.viewIndex > 0) {
          this.viewIndex -= 1
          this.$router.push({
            path: `/${this.views[this.viewIndex]}`
          })
        } else if (this.viewIndex === 0) {
          this.reverseAnimation(false)
        }
      // right
      } else if ((e.keyCode || e.which) === 39) {
        if (this.viewIndex < this.views.length - 1) {
          this.viewIndex += 1
          this.$router.push({
            path: `/${this.views[this.viewIndex]}`
          })
        } else if (this.viewIndex === this.views.length - 1) {
          this.reverseAnimation(true)
        }
      }
    },
    ...mapActions(['setNetworkInfo',
      'setHostInfo',
      'addDevice',
      'updateName',
      'setPublicIp',
      'clearPackets',
      'newPacket',
      'maxPossibleDevices',
      'reverseAnimation',
      'toggleSidebar',
      'startSniffer'
    ])
  }
}
</script>

<style lang='scss'>
@import '~animate.css';
.animated {
  animation-duration: .377s;
}
@import '~bulma';
/*@import '~wysiwyg.css/wysiwyg.sass';*/
$fa-font-path: '~font-awesome/fonts/';
@import '~font-awesome/scss/font-awesome';
html {
  background-color: whitesmoke;
}
.nprogress-container {
  position: fixed !important;
  width: 100%;
  height: 50px;
  z-index: 2048;
  pointer-events: none;
  #nprogress {
    $color: #48e79a;
    .bar {
      background: $color;
    }
    .peg {
      box-shadow: 0 0 10px $color, 0 0 5px $color;
    }
    .spinner-icon {
      border-top-color: $color;
      border-left-color: $color;
    }
  }
}
</style>

