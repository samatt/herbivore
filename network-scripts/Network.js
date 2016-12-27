const arp = require('arp-a')
const ping = require('ping')
const network = require('network')

class Network{

  constructor () {
    this.name = 'Network'
    this._client = null
    this.tbl = []
    this.public = ""
    this.local = ""
    this.gw = ""
    this.subnet = ""
    this.mac = ""
    this.interface = ""
    this.netmask = ""
    this.type = ""

  }
  info (msg) {
    console.log(`[${this.name}] : ${msg}`)
  }

  error (msg){
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
        this.info("%j", obj)

        this.local = obj.ip_address
        this.gw = obj.gateway_ip
        this.interface = obj.name
        this.netmask = obj.netmask
        this.mac = obj.mac_address
        this.subnet = this.gw.split('.')
        this.subnet.pop()
        this.type = obj.type
        let data = {private_ip: this.local, iface: this.interface, gateway: this.gw, netmask: this.netmask, mac: this.mac, type: this.type}
        this._pingSubnet()
        if(this._client){
          this._client.emit('info', data);
        }
        else{
          this.error('Client socket not found!')
        }
        if(this.tbl.length === 0 ){
          this._scanArpTable();
        }
      })
    }

  }

  _scanArpTable () {
      arp.table( (err, entry) => {
          if (!!err) return console.log('arp: ' + err.message);
          if (!entry) return;
          let t = entry.ip.split('.')
          t.pop()

          if(this.interface !== entry.ifname){
            this.info(`wrong interface: ${entry.ifname} ${this.interface} `);
            return;
          }

          if(entry.mac !== "ff:ff:ff:ff:ff:ff"){
            this.info(`ignore broadcast: ${entry.ifname} ${this.interface} `);
            return;
          }

          if(t.join('.') !== this.subnet.join('.')){
            this.info(`wrong subnet: ${t} ${this.subnet} `);
            return;
          }

          this.tbl.push(entry)

          this.info(`Found device: ${entry.mac} `)
          if(this._client){
            this._client.emit('addNode', entry);
          }
          else{
            this.error('Client socket not found!')
          }
      })
  }

  _pingSubnet () {
    const subnet = this.gw.split('.')
    subnet.pop()
    for (var i = 0; i < 255; i++) {
      let n = this.subnet.concat(i)
      let toPing = n.join('.')
      ping.sys.probe(toPing, function(isAlive){
        var msg = isAlive ? 'host ' + toPing + ' is alive' : 'host ' + toPing + ' is dead';
        if(isAlive){
          this.info(msg);
        }
      });
    }
  }

  start (socket) {
  }

  stop (socket) {

  }
}

module.exports = Network