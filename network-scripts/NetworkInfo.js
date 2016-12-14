const arp = require('arp-a')
const network = require('network')

class NetworkInfo{

  constructor () {
    this.name = 'NetworkInfo'
    this._client = null
    this.tbl = []
    this.public = ""
    this.local = ""
    this.gw = ""
    this.mac = ""
    this.interface = ""
    this.netmask = ""
    this.type = ""

  }
  info (msg) {
    console.log(`[${this.name}] : ${msg}`)
  }

  error (){
    console.error(`[${this.name}] ERR : ${msg}`)
  }

  set client(socket) {
    this._client = socket
  }

  get client() {
    return this._client
  }


  init (){
    if(this.public === ''){
      network.get_public_ip( (err, ip) => {
        if (!!err) return this.error(' get public ip: ' + err.message)
        if (!ip) return this.error(' get public ip:  no ip found')
        this.info(`public: ${ip} `)
        this.public = ip
        if(this._client){
          this._client.emit('updatePublicIp', this.public);
        }
        else{
          this.error('Client socket not found!')
        }
      })
    }

    if(this.local === ''){
      network.get_active_interface((err, obj) => {
        if (!!err) return this.error('get_active_interface : ' + err.message)
        if (!obj) return this.error('get_active_interface:  no interface found')
        console.log("%j", obj)

        this.local = obj.ip_address
        this.gw = obj.gateway_ip
        this.interface = obj.name
        this.netmask = obj.netmask
        this.mac = obj.mac_address
        this.type = obj.type
        let data = {private_ip: this.local, iface: this.interface, gateway: this.gw, netmask: this.netmask, mac: this.mac, type: this.type}
        if(this._client){
          this._client.emit('info', data);
        }
        else{
          this.error('Client socket not found!')
        }

      })
    }
    if(this.tbl.length === 0 ){
      arp.table( (err, entry) => {
        if (!!err) return console.log('arp: ' + err.message);
        if (!entry) return;
          this.tbl.push(entry)
          // this.info(`Found device: ${entry.mac} `)
          if(this._client){
            this._client.emit('addNode', entry);
          }
          else{
            this.error('Client socket not found!')
          }
      })
    }
  }

  start (socket) {
  }

  stop (socket) {

  }
}

module.exports = NetworkInfo