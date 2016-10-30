const PacketParser = require('./network-scripts/pcap-parser');
const electron = require('electron');
const app = electron.app;


// TODO: CLEAN THIS UP

const fs =require('fs')
// const debugData = JSON.parse(fs.readFileSync(`${__dirname}/test-packet.json`))
// let str = ""
// for (i in debugData.tcp.data.data){
//     str+=String.fromCharCode(debugData.tcp.data.data[i]);
// }
// debugData.tcp.data.data = str
let parser = new PacketParser()
parser.init()
//

const io = require('socket.io').listen(7777);
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow () {
    // create the browser window
    mainWindow = new BrowserWindow({width: 1280, height: 960});
    // render index.html which will contain our root Vue component
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // dereference the mainWindow object when the window is closed
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
}

// call the createWindow() method when Electron has finished initializing
app.on('ready', createWindow);

// when all windows are closed, quit the application on Windows/Linux
app.on('window-all-closed', function () {
    // only quit the application on OS X if the user hits cmd + q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // re-create the mainWindow if the dock icon is clicked in OS X and no other
    // windows were open
    if (mainWindow === null) {
        createWindow();
    }
});

// TODO: removeSocket functionality
io.on('connection', function (socket) {
  parser.addSocket(socket);
});