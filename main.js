const ToolManager = require('./network-scripts/ToolManager');
const electron = require('electron');
const app = electron.app;
const io = require('socket.io').listen(7777);
const BrowserWindow = electron.BrowserWindow;
let toolManager = new ToolManager()
let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({width: 1280, height: 840});
    BrowserWindow.addDevToolsExtension("/Users/surya/Library/Application Support/Google/Chrome/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/3.0.6_0")
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
// TODO: Remove socket/refresh functionality
io.on('connection', function (socket) {
    toolManager.client = socket
    toolManager.registerClients(socket)

    socket.on('list', function(){
        toolManager.listTools()
    })

    socket.on('load', function(toolname){
        toolManager.load(toolname)
        //FIXME: Need a better way of doing this
        socket.emit('clearStyles')
    })

    socket.on('init', function(){
        toolManager.init()
    })

    socket.on('start', function(){
        console.log("HERE")
        toolManager.start()
    })

    socket.on('stop', function(){
        toolManager.stop()
    })

    socket.on('updateTarget', function(data){
        toolManager.updateTarget(data)
    })
});