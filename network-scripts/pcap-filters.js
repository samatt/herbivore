module.exports = {
  http: 'tcp port 80 and (((ip[2:2] - ((ip[0]&0xf)<<2)) - ((tcp[12]&0xf0)>>2)) != 0)',
  tcp: 'ip proto \\tcp'
}