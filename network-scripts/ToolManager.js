const toolnames = require('./config')['tools']
const PcapSniffer = require('./PcapSniffer')
const Network = require('./Network')

class ToolManager {

  constructor () {
    this._client = {id: 'not connected'}
    this._currentTool = null
    this.toolnames = toolnames
    this.tools = this.loadTools()
  }

  loadTools () {
    let tools = []
    let sniffer = new PcapSniffer()
    let network = new Network()
    // let info = new Info()

    tools.push(sniffer)
    tools.push(network)
    // tools.push(info)

    return tools
  }

  error (msg) {
    console.error(`[ToolManager] ERR : ${msg}`)
  }

  info (msg) {
    console.info(`[ToolManager] : ${msg}`)
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
    this._client.emit('listTools', this.toolnames)
  }

  load (toolname) {
    let t = this.tools.find(function (tool) {
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

  updateTarget (data) {
    if (!this._currentTool || !this._client || this.currentTool.name !== 'PcapSniffer') {
      this.error(`Cant sniff, probably because current tool is not sniffer`)
      return false
    } else {
      this._currentTool.updateTarget(this._client, data)
    }
  }
}
module.exports = ToolManager
