const pcap = require('pcap')
const fs = require('fs')
const pcapFilters = require('./pcap-filters')

class PcapSniffer{

  constructor () {
    this.name = 'PcapSniffer'
    this.sniff = false
    this._if = 'en0'
    this.initComplete = false;
    this._client = null
    this.mac = "60:03:08:93:6b:ba"
    try{
      this.session = pcap.createSession(this._if, pcapFilters.http)
    }
    catch(err){
      this.session = null
    }
  }

  info (){
    console.log(`[${this.name}] : ${msg}`)
  }

  error (){
    console.log(`[${this.name} - Err] : ${msg}`)
  }

  set client(socket) {
    this._client = socket
  }

  get client() {
    return this._client
  }

  init (){
    if(this.session && !this.initComplete){
      this.session.on('packet', this._cb.bind(this))
      this.initComplete = true
      // setInterval(() => {
      //   this.arpPack()
      // }, 5000)
    }
    if(this.session === null){
      if(this._client){
        this._client.emit('bpfError');
      }
      else{
        this.error('Client socket not found!')
      }
    }
  }

  start (socket) {
    this.sniff = true
  }

  stop (socket) {
    this.sniff = false
  }

// src ip  (the node you're describing)
// src mac
// target ip : gw (the node youre telling)
// target mac: gw

  arpPack (config = {
            'op': 'request',
            'src_ip': '192.168.1.35',
            'src_mac': 'e4:ce:8f:54:88:06',
            'dst_ip': '192.168.1.1',
            'dst_mac': '6c:72:20:6b:89:44'
            })
  {

    let pkt = {};
    pkt.dst = this.mac_to_arr("ff:ff:ff:ff:ff:ff");
    pkt.src = this.mac_to_arr(this.mac);

    // ARP
    pkt.ether_type = [0x08, 0x06];
    pkt.hw_type = [0x00, 0x01];
    pkt.proto_type = [0x08, 0x00];
    pkt.hw_len = [0x06];
    pkt.proto_len = [0x04];
    pkt.op = [0x00, 0x02];

    pkt.src_mac = this.mac_to_arr(this.mac);
    pkt.src_mac = this.mac_to_arr(config.src_mac);
    pkt.src_ip = this.ip_to_arr(config.src_ip);
    pkt.dst_mac = this.mac_to_arr(config.dst_mac);
    pkt.dst_ip = this.ip_to_arr(config.dst_ip);

    var x;
    var pktArr = [];
    for (x in pkt) {
      pktArr = pktArr.concat(pkt[x]);
    }

    var arpRequest = new Buffer(pktArr);
    this.session.inject(arpRequest);
    // console.log('packet sent');
  }

  _cb (raw) {
    // if(this.sniff){

      const packet = pcap.decode.packet(raw)
      const parsed = this._parse(packet)
      if(this._client){
        this._client.emit('newPacket', parsed);
      }
      else{
        this.error('Client socket not found!')
      }

    // }
  }

  _parse (packet) {
    const ts = packet.pcap_header.tv_sec
    const eth = packet.payload
    const ip = eth.payload
    const tcp = ip.payload
    // console.log(ip.saddr, ip.daddr)
    // console.log(eth.dhost, eth.shost)
    let httpRaw = tcp.data.toString('utf8').split('\r\n')
    const httpHeaders = httpRaw.filter(function (o) {
                                      if(o.indexOf(':') > -1 && o.length < 200){
                                        return true;
                                      }
                                      else{
                                        return false
                                      }
                                    })
    // if(httpRaw.length > 20){
    //   httpRaw = httpRaw.slice(0,20)
    // }
    // return  { ts: ts, eth: eth, ip: ip, tcp: tcp, payload: httpHeaders}
    return  { ts: ts, eth: eth, ip: ip, tcp: tcp, payload: httpRaw }
  }

  mac_to_arr(macAddr) {
    var mac_arr = macAddr.split(':');
    var x;
    for (x in mac_arr) {
      mac_arr[x] = '0x' + mac_arr[x];
    }
    return mac_arr;
  }


  ip_to_arr(ipAddr) {
    var ip_arr = ipAddr.split('.');
    var x;
    for (x in ip_arr) {
      ip_arr[x] = ip_arr[x];
    }
    return ip_arr;
  }
}

module.exports = PcapSniffer