var moment = require('moment')
export function  stringifyMac (addr){
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

export function  upperMac (addr){
    return addr.toUpperCase();
}

export function toolNameFilter (tn){
  if(tn === 'PcapSniffer'){
    return 'Sniffer'
  }
  return tn
}

export function prettifyTs (ts){
  const pretty = new Date(ts * 1000)
  return pretty.toLocaleString();
}

// export function parseToolNames (tn){
//   ps_i = tn.findIndex(function(element){return element == 'PcapSniffer'})
//   if( ps_i > -1){
//     tn[ps_i] = Sniffer
//   }

//   return tn;
// }

