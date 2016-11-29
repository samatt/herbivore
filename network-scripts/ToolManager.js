const fs = require('fs');
const path = require('path');
const toolnames = require('./config')['tools']
const PcapSniffer = require('./PcapSniffer');


class ToolManager{

  constructor () {
    this._client = {id:'not connected'}
    this._currentTool = null
    this.toolnames = toolnames
    this.tools = this.loadTools()
  }

  loadTools () {
    let tools = []
    let sniffer =  new PcapSniffer()
    tools.push(sniffer)
    return tools
  }

  error (msg) {
    console.error(`[ToolManager] ERR : ${msg}`)
  }

  info (msg) {
    console.info(`[ToolManager] : ${msg}`)
  }

  registerClients(socket){
    for(var tool of this.tools){

      tool.client = socket
      this.info(tool.client)
      // this.info(` Registering ${tool.client.id} to ${tool.name}`)
    }
  }

  set client(socket){
    this._client = socket
  }

  get client(){
    return this._client
  }

  set currentTool(toolname){
  this._currentTool = toolname
  }

  get currentTool(){
    return this._currentTool
  }

listTools () {
    this._client.emit('listTools', this.toolnames)
}

load(toolname){
   let t =  this.tools.find(function(tool){
      return tool.name === toolname
    })
   this._currentTool = t
   if(t === undefined){
    this.error(`Not Loaded ${toolname}`)
   }
   else{
      this.info(`Loaded ${toolname}`)
   }
  }


  init () {
    if(!this._currentTool || !this._client){
      this.error(`Client:${this._client.id} Tool:${this.currentTool.name}`)
      return false
    }
  else{
    this._currentTool.init(this._client)
    }
  }

  start () {
    if(!this._currentTool || !this._client){
      this.error(`Client:${this._client.id} Tool:${this.currentTool.name}`)
      return false
    }
    else{
      this._currentTool.start(this._client)
    }
  }

  stop () {
    if(!this._currentTool || !this._client){
      this.error(`Client:${this._client.id} Tool:${this.currentTool.name}`)
      return false
    }
    else{
      this._currentTool.stop(this._client)
    }
  }
}
module.exports = ToolManager