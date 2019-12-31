const { app } = require('electron')

const { onAppInit } = require('./index')

app.on('ready', () => {
    app.plugins = [{
        getQuickActions: () => {
            return {
                todo: {
                    exec: (query) => {
                        console.log(query)
                    },
                    icon: './assets/t1.png'
                }
            }
        }
    }]
    app.config = {
        'quick-app': ['todo']
    }
    onAppInit(app);
})

app.on('window-all-closed', () => {
    app.quit();
})