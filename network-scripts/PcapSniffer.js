const pcap = require('pcap')
const fs = require('fs')
const pcapFilters = require('./pcap-filters')

class PcapSniffer{

  constructor () {
    this.name = 'PcapSniffer'
    this.sniff = false
    this._if = 'en0'
    this._client = null
    this.session = pcap.createSession(this._if, pcapFilters.http)
  }

  error (){
    console.error(`[${this.name}] : ${msg}`)
  }

  set client(socket) {
    this._client = socket
  }

  get client() {
    return this._client
  }


  init (){
    this.session.on('packet', this._cb.bind(this))
  }

  start (socket) {
    this.sniff = true
  }

  stop (socket) {
    this.sniff = false
  }

  _cb (raw) {
    if(this.sniff){
      // console.log(this.session.decode)
      const packet = pcap.decode.packet(raw)
      const parsed = this._parse(packet)
      if(this._client){
        this._client.emit('data', parsed);
      }
      else{
        this.error('Client socket not found!')
      }

    }
  }

  _parse (packet) {
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
    if(httpRaw.length > 20){
      httpRaw = httpRaw.slice(0,20)
    }
    return  { ts: ts, eth: eth, ip: ip, tcp: tcp, http: httpRaw }
  }
}

module.exports = PcapSniffer