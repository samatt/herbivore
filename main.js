const ToolManager = require('./network-scripts/ToolManager');
const electron = require('electron');
const app = electron.app;
const io = require('socket.io').listen(7777);
const BrowserWindow = electron.BrowserWindow;
let toolManager = new ToolManager()

let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({width: 1280, height: 840});
    BrowserWindow.addDevToolsExtension("/Users/surya/Library/Application Support/Google/Chrome/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/2.3.1_0")
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
}

// Electron stuff
app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

// Ajooba stuff
io.on('connection', function (socket) {
    toolManager.client = socket

    socket.on('list', function(){
        toolManager.listTools()

    })
    socket.on('load', function(toolname){
        toolManager.load(toolname)

    })

    socket.on('init', function(){
        toolManager.init()

    })

    socket.on('start', function(){
        toolManager.start()

    })

    socket.on('stop', function(){
        toolManager.stop()

    })
});