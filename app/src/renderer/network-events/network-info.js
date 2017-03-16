import EventEmitter from 'events'
import ipSubCal from 'ip-subnet-calculator'
import ping from 'ping'
import {exec} from 'child_process'
import arp from 'arp-a'
import oui from 'oui'

const SMALL_SCAN_LIMIT = 255
const fullIpRange = (start, end) => Array.from({length: (end - start)}, (v, k) => ipSubCal.toString(k + start))

class NetworkInfo extends EventEmitter {

  get self () {
    return this.self
  }

  get network () {
    return this.network
  }

  constructor (host, gateway) {
    super()
    this.iface = ''
    this.host = ''
    this.gateway = ''
    this.netmask = ''
    this.maxDevices = 0
    this.ipRange = []
    this.table = []
    this.hostInterval = null
    this.hostIntervalPeriod = 1000
  }

  run (name, host, gateway, netmask) {
    this.iface = name
    this.host = host
    this.getHostName(host)
    this.gateway = gateway
    this.netmask = netmask
    const {ipLow, ipHigh} = ipSubCal.calculateCIDRPrefix(host, netmask)
    this.ipRange = fullIpRange(ipLow, ipHigh)
    this.maxDevices = this.ipRange.length
    this.unresolvedIps = []
    this.emit('maxPossibleDevices', this.maxDevices)
    if (this.maxDevices < SMALL_SCAN_LIMIT) {
      // Currently not pinging full network if the range is too big
      this.pingSubnet(this.ipRange)
    } else {
      this.emit('largeNetworkDetected')
    }
    this.checkHost()
    this.scanArpTable()

    // let count = 0
    // while (count < 10) {
    //   this.generateDummyDevices()
    //   count++
    // }
    // setInterval(() => {
    //   this.generateDummyDevices()
    // }, 1000)
  }

  generateDummyDevices () {
    let dummy = {
      ip: `192.168.1.${Math.round(Math.random() * 255)}`,
      mac: 'AB:CA:2F:4B:CD:3E',
      name: 'dum dum',
      vendor: 'dd inc',
      host: false,
      router: false
    }
    this.emit('addDevice', dummy)
  }
  getVendorInfo (mac) {
    const vendorInfo = oui(mac)
    if (vendorInfo != null && vendorInfo.indexOf('\n') > -1) {
      return vendorInfo.split('\n')[0]
    } else {
      return ''
    }
  }

  pingSubnet (range) {
    range.forEach(function (ip) {
      ping.sys.probe(ip, () => {})
    })
  }

  scanArpTable () {
    arp.table((err, entry) => {
      if (err) this.emit('error', err.message)

      if (!entry) return

      if (this.iface !== entry.ifname) {
        return
      }
      if (entry.mac === 'ff:ff:ff:ff:ff:ff') {
        return
      }
      const inSubnet = this.ipRange.filter((e) => {
        return e === entry.ip
      })
      if (inSubnet.length < 1) {
        return
      }
      const exisiting = this.table.filter((e) => {
        return e.mac === entry.mac
      })
      if (exisiting.length > 0) {
        return
      }

      this.table.push(entry)
      entry.isRouter = entry.ip === this.gateway
      entry.vendor = this.getVendorInfo(entry.mac)
      this.emit('addDevice', entry)
      this.unresolvedIps.push(entry.ip)
    })
  }

  getHostName (ip) {
    exec(`dig -x ${ip} -p 5353 @224.0.0.251`, (err, stdout, stderr) => {
      if (err) { this.emit('warning', err); return }
      if (stderr) { this.emit('warning', stderr); return }
      const text = stdout
      const lines = text.split('\n')
      const line = lines[11]
      if (typeof line === 'undefined') {
        return
      }
      const hostAdd = line.split('\t').pop()
      const hostname = hostAdd.split('.')[0]

      this.emit('updateName', { ip: ip, name: hostname })
    })
  }

  getHostBuffer () {
    const bufferSize = 10
    if (this.unresolvedIps.length < 1) {
      return
    } else {
      let cur = []
      if (this.unresolvedIps.length > bufferSize) {
        cur = this.unresolvedIps.splice(0, bufferSize)
      } else {
        cur = this.unresolvedIps.splice(0, this.unresolvedIps.length)
      }
      for (const c in cur) {
        this.getHostName(cur[c])
      }
    }
  }

  checkHost () {
    if (this.hostInterval) {
      clearInterval(this.hostInterval)
      this.hostInterval = null
      this.checkHost()
    } else {
      this.hostInterval = setInterval(() => {
        this.getHostBuffer()
      }, this.hostIntervalPeriod)
    }
  }
}

export default new NetworkInfo()
