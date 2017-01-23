var moment = require('moment')
export function  stringifyMac (addr) {
  if(typeof addr !== 'undefined' && addr.length > 0){
    let addrStr = '';
    for (var i = 0; i < addr.length; i++) {

        addrStr += addr[i].toString(16).toUpperCase() ;
        if(i == addr.length -1){
          continue
        }
        addrStr += ':'
    }
    return addrStr;
  }
  else{
    return ''
  }

}

export function stringifyIp (ip) {
  return ip.addr.join('.')
}

export function  upperMac (addr) {
   return (typeof addr !== 'undefined')?addr.toUpperCase(): '';
}

export function toolNameFilter (tn){
  if(tn === 'PcapSniffer'){
    return 'Sniffer'
  }
  return tn
}

export function prettifyTs (ts){
  const pretty = new Date(ts * 1000)
  return pretty.toLocaleString().split(',')[1];
}
export function capitalize (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
}

// export function parseToolNames (tn){
//   ps_i = tn.findIndex(function(element){return element == 'PcapSniffer'})
//   if( ps_i > -1){
//     tn[ps_i] = Sniffer
//   }

//   return tn;
// }

