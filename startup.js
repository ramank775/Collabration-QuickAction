const { app } = require('electron')

const { onAppInit } = require('./index')

app.on('ready', () => {
    onAppInit(app);
})

app.on('window-all-closed', () => {
    app.quit();
})