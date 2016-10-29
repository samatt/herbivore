const pcap = require('pcap')
const fs = require('fs')
const pcapFilters = require('./pcap-filters')



class PacketParser{
  constructor () {
    this._if = 'en0'
    this.tcp_tracker = new pcap.TCPTracker()
    this.pcap = pcap.createSession(this._if, pcapFilters.http)
    this.wroteOne = false
    this.socketConnections = []
  }

  init () {
    this.pcap.on('packet', this.packetCb.bind(this))
  }

  packetCb (raw) {
    // console.log(raw)
    const packet = pcap.decode.packet(raw)
    const parsed = this.parse(packet)
    // console.log(parsed.http)

    if (!this.wroteOne) {
      this.savePacket('test.json', parsed)
      this.wroteOne = true
    }

    for (var i = 0; i < this.socketConnections.length; i++) {
      this.socketConnections[i].emit('data', parsed);
    }
  }

  parse (packet) {
    const ts = packet.pcap_header.tv_sec
    const eth = packet.payload
    const ip = eth.payload
    const tcp = ip.payload
    const httpRaw = tcp.data.toString('utf8').split('\r\n')
    const httpHeaders = httpRaw.filter(function (o) {
                                      if(o.indexOf(':') > -1 && o.length < 200){
                                        return true;
                                      }
                                      else{
                                        return false
                                      }
                                    })
    // console.log(httpHeaders)
    return  { ts: ts, eth: eth, ip: ip, tcp: tcp, http: httpHeaders}
  }

  savePacket (filename, packet) {
    fs.writeFileSync(filename, JSON.stringify(packet))
  }

  addSocket (socket) {
    this.socketConnections.push(socket)
  }
}

module.exports = PacketParser

// console.log(raw.buf.length)
// console.log(raw.buf.slice(0, 6))
// console.log(raw.buf.slice(6, 12))
// console.log(raw.buf.slice(12, 14))
// console.log(raw.buf.slice(14).length)