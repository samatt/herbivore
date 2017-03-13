<template>
  <div id="#app">
  <Navbar :show="true" />
    <router-view></router-view>
  </div>
</template>

<script>
  // import store from 'renderer/vuex/store'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import {mapActions} from 'vuex'
import {HostInfo, NetworkInfo} from './network-events/'
export default {
    created () {
      this.startNetworkEvents()
    },
    components: {
      Navbar,
      Sidebar
    },
    methods: {
      startNetworkEvents: function () {
        // Always set Network Before Host
        this.setNetworkListeners()
        this.setHostListeners()
      },
      setHostListeners: function () {
        HostInfo.on('host_info_available', (info) => {
          const { ip_address, vendor, gateway_ip, name, netmask, mac_address } = info

          this.setHostInfo({ip: ip_address,
            interface: name,
            mac: mac_address,
            vendor: vendor
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
          console.warn(warn)
          console.log('^^^^ if its the dig command that is normal')
        })
      },
      ...mapActions(['setNetworkInfo',
        'setHostInfo',
        'addDevice',
        'updateName',
        'maxPossibleDevices'
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
