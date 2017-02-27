const Sniffer = require('./Sniffer')
const Network = require('./Network')

class ToolManager {

  constructor (logDebug = false) {
    this.name = 'ToolManager'
    this._client = { id: 'not connected' }
    this._currentTool = null
    this.logDebug
    // this.toolnames = ['Network', 'Info', 'Sniffer']
    this.tools = this.loadTools()
  }

  loadTools () {
    const tools = []
    const sniffer = new Sniffer()
    const network = new Network()
    tools.push(sniffer)
    tools.push(network)
    return tools
  }

  info (msg) {
    console.log(`[ INFO ] [${this.name}]: ${msg}`)
  }

  debug (msg) {
    if (this.logDebug) {
      console.log(`[ DEBUG ] [${this.name}]: ${msg}`)
    }
  }

  error (msg) {
    console.log(`[ ERROR ] [${this.name}]: ${msg}`)
  }

  registerClients (socket) {
    for (var tool of this.tools) {
      tool.client = socket
      this.info(`Registering ${tool.client.id} to ${tool.name}`)
    }
  }

  set client (socket) {
    this._client = socket
  }

  get client () {
    return this._client
  }

  set currentTool (toolname) {
    this._currentTool = toolname
  }

  get currentTool () {
    return this._currentTool
  }

  listTools () {
    // Placeholder for when I make the tools modular
    this._client.emit('listTools', this.toolnames)
  }

  load (toolname) {
    const t = this.tools.find(function (tool) {
      return tool.name === toolname
    })
    this._currentTool = t
    if (t === undefined) {
      this.error(`Not Loaded ${toolname}`)
    } else {
      this.info(`Loaded ${toolname}`)
      this.init()
    }
  }

  init () {
    if (!this._currentTool || !this._client) {
      this.error(`Bad Init Attempted`)
      return false
    } else {
      this._currentTool.init(this._client)
    }
  }

  cmd (name, ...args) {
    if (!this._currentTool || !this._client) {
      this.error(`Bad Start Attempted`)
      return false
    } else {
      this.info(`${name}: ${args}`)
      this._currentTool.cmd(name, ...args)
    }
  }

  start () {
    if (!this._currentTool || !this._client) {
      this.error(`Bad Start Attempted`)
      return false
    } else {
      this._currentTool.start(this._client)
    }
  }

  stop () {
    if (!this._currentTool || !this._client) {
      this.error(`Bad Stop Attempted`)
      return false
    } else {
      this._currentTool.stop(this._client)
    }
  }

  // updateTarget (data) {
  //   if (!this._currentTool || !this._client || this.currentTool.name !== 'Sniffer') {
  //     this.error(`Cant sniff, probably because current tool is not sniffer`)
  //     return false
  //   } else {
  //     this._currentTool.updateTarget(this._client, data)
  //   }
  // }
}
module.exports = ToolManager
