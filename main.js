const ToolManager = require('./network-scripts/ToolManager')
const electron = require('electron')
const path = require('path')
const app = electron.app
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow
const io = require('socket.io').listen(7777)
require('electron-debug')({ showDevTools: true })

const sudo = require('sudo-prompt')
const options = {
  name: 'Herbivore'
}

const toolManager = new ToolManager()
let mainWindow

const template = [
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      },
      {
        role: 'quit'
      }
    ]
  },
  {
    label: 'About',
    submenu: [
      {
        label: 'About',
        role: 'about'
      }
    ]
  },
  {
    label: 'Permissions',

    submenu: [
      {
        label: 'Set',
        click () {
          sudo.exec('chmod o+r /dev/bpf*', options, function (error, stdout, stderr) {
            if (error) console.log(error)
            sudo.exec('sysctl -w net.inet.ip.forwarding=1', options, function (error, stdout, stderr) {
              if (error) console.log(error)
              sudo.exec('sysctl -w net.inet.ip.fw.enable=1', options, function (error, stdout, stderr) {
                if (error) console.log(error)
              })
            })
          })

          console.log('Set Permissions')
        }
      },
      {
        label: 'Clear',
        click () {
          sudo.exec('chmod o-r /dev/bpf*', options, function (error, stdout, stderr) {
            if (error) console.log(error)
            sudo.exec('sysctl -w net.inet.ip.fw.enable=0', options, function (error, stdout, stderr) {
              if (error) console.log(error)
              sudo.exec('chmod o-r /dev/bpf*', options, function (error, stdout, stderr) {
                if (error) console.log(error)
              })
            })
          })
          console.log('Clear Permissions')
        }
      }
    ]
  }
]
const menu = Menu.buildFromTemplate(template)

function createWindow () {
  Menu.setApplicationMenu(menu)
  mainWindow = new BrowserWindow({ width: 1280, height: 840, frame: false })
  // BrowserWindow.addDevToolsExtension('/Users/surya/Library/Application Support/Google/Chrome/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/3.0.8_0')
  mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

// Electron stuff
app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

// Ajooba stuff
// TODO: Remove socket/refresh functionality
io.on('connection', function (socket) {
  toolManager.client = socket
  toolManager.registerClients(socket)

  socket.on('list', function () {
    toolManager.listTools()
  })

  socket.on('load', function (toolname) {
    toolManager.load(toolname)
    // FIXME: Need a better way of doing this
    socket.emit('clearStyles')
  })

  socket.on('clear', function () {
    socket.emit('clearViz')
  })

  socket.on('init', function () {
    toolManager.init()
  })

  socket.on('start', function () {
    console.log('HERE')
    toolManager.start()
  })

  socket.on('stop', function () {
    toolManager.stop()
  })

  socket.on('cmd', function (name, ...args) {
    toolManager.cmd(name, ...args)
  })

  socket.on('updateTarget', function (data) {
    toolManager.updateTarget(data)
  })
})
