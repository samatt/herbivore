const pcap = require('pcap')
const fs = require('fs')
const pcapFilters = require('./pcap-filters')


class PcapSniffer{

  constructor () {
    this._if = 'en0'
    this.tcp_tracker = new pcap.TCPTracker()
    this.pcap = pcap.createSession(this._if, pcapFilters.http)
    this.wroteOne = false
    this.socketConnections = []
  }

  init () {
    this.pcap.on('packet', this.packetCb.bind(this))
    this.tcp_tracker.on('session', function (session) {
      console.log("Start of session between " + session.src_name + " and " + session.dst_name);
      console.log(session.recv_bytes_payload);
      session.on('end', function (session) {
            console.log("End of TCP session between " + session.src_name + " and " + session.dst_name);
      });
    });
  }

  packetCb (raw) {
    // console.log(raw)

    const packet = pcap.decode.packet(raw)
    // this.tcp_tracker.track_packet(packet);
    const parsed = this.parse(packet)
    // console.log(parsed.http)
    // console.log(packet)
    // if (!this.wroteOne) {
    //   this.savePacket('test.json', parsed)
    //   this.wroteOne = true
    // }

    for (var i = 0; i < this.socketConnections.length; i++) {
      this.socketConnections[i].emit('data', parsed);
    }
  }

  parse (packet) {
    const ts = packet.pcap_header.tv_sec
    const eth = packet.payload
    const ip = eth.payload
    const tcp = ip.payload
    let httpRaw = tcp.data.toString('utf8').split('\r\n')
    const httpHeaders = httpRaw.filter(function (o) {
                                      if(o.indexOf(':') > -1 && o.length < 200){
                                        return true;
                                      }
                                      else{
                                        return false
                                      }
                                    })
    // console.log(httpHeaders)
    if(httpRaw.length > 20){
      httpRaw = httpRaw.slice(0,20)
    }
    return  { ts: ts, eth: eth, ip: ip, tcp: tcp, http: httpRaw }
  }

  savePacket (filename, packet) {
    fs.writeFileSync(filename, JSON.stringify(packet))
  }

  addSocket (socket) {
    this.socketConnections.push(socket)
  }

  removeSocket (socket_id) {

    this.socketConnections.filter(function (e){
      if
    }).push(socket)
  }
}

module.exports = PacketParser

// console.log(raw.buf.length)
// console.log(raw.buf.slice(0, 6))
// console.log(raw.buf.slice(6, 12))
// console.log(raw.buf.slice(12, 14))
// console.log(raw.buf.slice(14).length)