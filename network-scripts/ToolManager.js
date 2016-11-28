const fs = require('fs');
const path = require('path');
const tools = require('./config')['tools']

class ToolManager{

  constructor () {
    this._client = {id:'not connected'}
    this._currentTool = null
    this.tools = tools
    // try{
    //  // fs.accessSync(path.resolve(__dirname, 'config.json'), fs.R_OK | fs.W_OK)
    //  // console.log(path.resolve(__dirname, 'config.json'))

    //  // fs.readFile(path.resolve(__dirname, 'config.json'),'utf-8', (d) => {
    //  //      // this.tools = d['tools']
    //  //      console.log(d)
    //  //    })

    //  }catch(e){
    //    console.error(`Looks like it couldnt find ajooba/network-scripts.
    //                   But heres what the error says ${e}.
    //                   Setting tools to []`)
    //    this.tools = []
    //  }

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
    return this.tools
}

load(toolname){
  if(this.tools.indexOf(toolname) > -1){
    this.tool = _loadModule(toolname)
      // const toolPath = path.resolve(__dirname, )
      if(this.tool){
        return true
      }
      else{
        return false
      }
    }
    else{
      console.error(`${toolname}: not configured in ajooba/network-scripts/config.json `)
      return false
    }
  }

  _loadModule (toolname) {
    try{
     fs.accessSync(path.resolve(__dirname, 'toolname.js'), fs.R_OK | fs.W_OK)
     return  require(`./${toolname}`)
   }catch(e){
     console.error(`Couldn't load the tool: ${toolname}.
      error ${e}`)
     return false;
   }
 }

  init (){
    if(!this._currentTool || !!this._client){
      console.error(`Client:${this._client.id} Tool:${this.currentTool}`)
      return false
    }
  else{
    this._currentTool.init(this._client)
    _}
  }

  currentTool (){
    if(!this._currentTool || !!this._client){
      console.error(`Client:${this._client.id} Tool:${this.currentTool}`)
      return false
    }
    else{
      this._currentTool.start(this._client)
    _}
  }

  currentTool (){
    if(!this._currentTool || !!this._client){
      console.error(`Client:${this._client.id} Tool:${this.currentTool}`)
      return false
    }
    else{
      this._currentTool.stop(this._client)
    _}
  }
}
module.exports = ToolManager