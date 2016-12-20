

class Info{

  constructor () {
    this.name = 'Info'
    this._client = null
    this.public = ""

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

  }




  start (socket) {
  }

  stop (socket) {

  }
}

module.exports = Info