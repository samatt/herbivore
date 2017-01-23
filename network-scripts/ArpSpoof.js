const arp = require('arpjs');

class ArpSpoof{

  constructor () {
    // this._if =
    this.tcp_tracker = new pcap.TCPTracker()
    this.pcap = pcap.createSession(this._if, pcapFilters.http)
    this.wroteOne = false
    this.socketConnections = []
  }

  init () {
  }


  parse (packet) {

  }

  savePacket (filename, packet) {
    fs.writeFileSync(filename, JSON.stringify(packet))
  }

  addSocket (socket) {
    this.socketConnections.push(socket)
  }
}

module.exports = PacketParser
