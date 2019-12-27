const { BrowserWindow, screen, ipcMain } = require('electron')
const path = require('path');
const url = require('url');

let win;
const onAppInit = (app) => {
    createWindow();
    handleIPC();
}

function createWindow() {
    const display = screen.getPrimaryDisplay();

    const windowOptions = {
        width: 400,
        height: 400,
        title: 'Sticky App',
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true
        },
        x: display.workAreaSize.width - 400,
        y: display.workAreaSize.height - 420
    };
    console.log(windowOptions);
    win = new BrowserWindow(windowOptions);
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    win.setAlwaysOnTop(true, "floating");
    win.on('closed', () => {
        win = null
    });
    win.webContents.openDevTools();
}


function handleIPC() {
    const { queryParser } = require('./queryParser');
    ipcMain.on('quick-query', (event, query) => {
        const parsedQuery = queryParser(query);
        console.log("parsed Query", parsedQuery);
    })
}

module.exports = {
    onAppInit
}