const arp = require('arp-a')
const ping = require('ping')
const network = require('network')
const oui = require('oui')
const spawn = require('child-process-promise').spawn

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
    console.error(`[${this.name}] Error : ${msg}`)
  }

  set client(socket) {
    this._client = socket
  }

  get client() {
    return this._client
  }

  init (){

    if(this.local === ''){
      network.get_active_interface((err, obj) => {

        if (!!err){
          let data = {iface: 'No active interface', connected: false}
          this._client.emit('info', data);
          this.error('get_active_interface : ' + err.message)
          return
        }

        if (!obj){
          let data = {iface: 'No active interface', connected: false}
          this._client.emit('info', data);
          this.error('get_active_interface:  no interface found')
          return
        }

        this.local = obj.ip_address
        this.gw = obj.gateway_ip
        this.interface = obj.name
        this.netmask = obj.netmask
        this.mac = obj.mac_address
        this.vendor = oui(obj.mac_address).split('\n')[0]
        this.subnet = this.gw.split('.')
        this.subnet.pop()
        this.type = obj.type

        let data = { connected: true,
                     private_ip: this.local,
                     iface: this.interface,
                     gateway: this.gw,
                     netmask: this.netmask,
                     mac: this.mac,
                     type: this.type,
                     vendor:this.vendor}

        this._pingSubnet()
        if(this._client){
          this._client.emit('info', data);
            try{
              this._getHostName(this.local)
            }
            catch(err){
              this.error(err)
            }

        }
        else{
          this.error('Client socket not found!')
        }
        if(this.tbl.length === 0 ){
            try{
              this._scanArpTable();
            }
            catch(err){
              this.error(err)
            }

        }

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

      })
    }

  }

  _getHostName (ip) {
    this.info(`Finding host for ip: ${ip}`)
    // TODO: Add linux version
    spawn('dig', ['-x',ip,'-p','5353','@224.0.0.251'], { capture: [ 'stdout', 'stderr' ]})
    .then((result) => {
      let text = result.stdout.toString();
      let lines = text.split('\n')
      let line = lines[11]
      let hostAdd = line.split('\t').pop()
      let hostname = hostAdd.split('.')[0]
      this.info(hostname)
      this._client.emit('updateHostname', {ip: ip, hostname: hostname});
    })
    .catch(function (err) {
        this.error(err.stderr);
    })
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

          if(entry.mac === "ff:ff:ff:ff:ff:ff"){
            this.info(`ignore broadcast: ${entry.ifname} ${this.mac} `);
            return;
          }

          if(t.join('.') !== this.subnet.join('.')){
            this.info(`wrong subnet: ${t} ${this.subnet} `);
            return;
          }

          this.tbl.push(entry)

          this.info(`Found device: ${entry.mac} `)
          if(this._client){
            let vendor_info = oui(entry.mac)
            if(vendor_info != null && vendor_info.indexOf('\n') > -1){
              entry.vendor = vendor_info.split('\n')[0]
            }
            else{
             entry.vendor = ''
            }

            entry.hostname = ''
            this._getHostName(entry.ip)
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

// arpPromise (ip) {
//     return new Promise(
//         function (resolve, reject) {
//             narp.getMAC(ip,
//                 (err, entry) => {
//                     if (err) {
//                         reject(err);
//                     }
//                     resolve({ip: ip, mac: entry});
//                 });
//         });
// }
// _scanLan () {
//   const subnet = this.gw.split('.')
//   subnet.pop()
//   let promises = []
//   for (var i = 0; i < 255; i++) {
//     let n = this.subnet.concat(i)
//     let toPing = n.join('.')
//     promises.push(this.arpPromise(toPing))
//   }

//   Promise.all(promises)
//   .then( (result) => {
//     result.forEach((r) => {
//       if(r.mac !== '(incomplete)'){
//         r.vendor = oui(r.mac).split('\n')[0]
//         this._client.emit('addNode', r)
//       }
//     })

//   })
//   .catch(function (err) {
//       console.error('[spawn] stderr: ', err);
//   })
// }
