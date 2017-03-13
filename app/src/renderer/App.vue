<template>
  <div id="#app">
    <router-view></router-view>
  </div>
</template>

<script>
  // import store from 'renderer/vuex/store'
import {mapActions} from 'vuex'
import {HostInfo, NetworkInfo} from './network-events/'
export default {
    created () {
      this.startNetworkEvents()
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

<style>
  @import url(https://fonts.googleapis.com/css?family=Lato:300);

  * {
    margin: 0;
    padding: 0;
  }

  html,
  body { height: 100%; }

  body {
    align-items: center;
    background:
      radial-gradient(
        ellipse at center,
        rgba(255, 255, 255, 1) 0%,
        rgba(229, 229, 229, .85) 100%
      );
    background-position: center;
    display: flex;
    font-family: Lato, Helvetica, sans-serif;
    justify-content: center;
    text-align: center;
  }
</style>
