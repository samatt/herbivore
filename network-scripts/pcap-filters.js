module.exports = {
  http: 'tcp port 80 and (((ip[2:2] - ((ip[0]&0xf)<<2)) - ((tcp[12]&0xf0)>>2)) != 0)',
  https: 'tcp port 80 or port 443 or port 8443',
  tcp: 'ip proto \\tcp'
}