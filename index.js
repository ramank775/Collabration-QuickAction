const { BrowserWindow, screen, ipcMain } = require('electron')
const path = require('path');
const url = require('url');

let win;
let actionMapping = {};
const onAppInit = (app) => {
    console.log('app plugins', app.plugins);
    mapPluginWithQuickAction(app.plugins);
    createWindow();
    handleIPC();
}

function createWindow() {
    const display = screen.getPrimaryDisplay();

    const windowOptions = {
        width: 460,
        height: 300,
        title: 'Sticky App',
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true
        },
        x: display.workAreaSize.width - 460,
        y: display.workAreaSize.height - 305
    };
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
    ipcMain.on('quick-app-ready', (event, args) => {
        event.reply('init', Object.keys(actionMapping).filter(k => typeof k === 'string'))
    })
    ipcMain.on('quick-query', (event, query) => {
        const parsedQuery = queryParser(query);
        console.log("parsed Query", parsedQuery);
        const quickAction = Object.keys(actionMapping).find(f => f.toUpperCase() == parsedQuery.app.toUpperCase());
        console.log('quick Action', quickAction);
        if (quickAction) {
            actionMapping[quickAction].exec(parsedQuery);
        }
    })
}

function mapPluginWithQuickAction(plugins) {
    plugins = plugins || [];
    actionMapping = {};
    plugins.forEach(plugin => {
        if (plugin.getQuickActions) {
            try {
                const quickies = plugin.getQuickActions();
                Object.assign(actionMapping,quickies);
            } catch (e) {
                console.log('error', e);
            }
        }
    });
    console.log('action Mapping ', actionMapping);
}

module.exports = {
    onAppInit
}