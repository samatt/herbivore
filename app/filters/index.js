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

export function prettifyTs (ts){
  const pretty = new Date(ts * 1000)
  return pretty.toLocaleString();
}