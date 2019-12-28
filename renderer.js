const { ipcRenderer: ipc, remote } = require('electron');
const currentWindow = remote.getCurrentWindow();
window.addEventListener('mousemove', event => {
    if (event.target === document.documentElement) // <html>-element
        currentWindow.setIgnoreMouseEvents(true, { forward: true })   // {forward: true} keeps generating MouseEvents
    else
        currentWindow.setIgnoreMouseEvents(false, { forward: false })
});
window.addEventListener('DOMContentLoaded', () => {
    const quickActionIcon = document.getElementById('icon');
    const quickinputHost = document.getElementById('host');
    const quickInputContainer = document.getElementById('quick-host-container');
    const quickInput = document.getElementById('quick-input');
    const suggestionsList = document.querySelector('.suggestion>ul')
    let isquckInputEnable = false;
    let quickActions = [];
    quickinputHost.onmouseenter = () => {
        if (!isquckInputEnable) {
            currentWindow.setIgnoreMouseEvents(true, { forward: true });
            return;
        }
        currentWindow.setIgnoreMouseEvents(false, { forward: false });
    }
    quickinputHost.onmouseleave = () => {
        currentWindow.setIgnoreMouseEvents(false, { forward: false });
    }

    quickActionIcon.onclick = (event) => {
        event.preventDefault();
        currentWindow.setIgnoreMouseEvents(false, { forward: false });
        quickInputContainer.style['visibility'] = isquckInputEnable ? 'hidden' : 'visible';
        let quickActionItems = document.getElementsByClassName('quick-icon');
        for (let i = 0; i < quickActionItems.length; i++) {
            if (isquckInputEnable) {
                quickActionItems[i].classList.remove(`icon-${i + 1}`);
            } else {
                quickActionItems[i].classList.add(`icon-${i + 1}`);
            }
        }
        isquckInputEnable = !isquckInputEnable;
    }

    quickInput.onkeypress = (event) => {
        const input = quickInput.value + event.key;
        suggestions(input);
        if (event.shiftKey && event.key == 'Enter') {
            let rows = Number(quickInput.attributes['rows'].value)
            if (rows < 3) {
                quickInput.attributes['rows'].value = rows + 1;
            } else {
                event.preventDefault();
            }
            return;
        }
        if (event.key == 'Enter') {
            sendQuery(quickInput.value);
            quickInput.value = '';
            event.preventDefault();
            quickInput.attributes['rows'].value = 1;
            return;
        }
        
    }
    quickInput.onkeydown = (event) => {
        if (event.key == 'Backspace') {
            const lines = quickInput.value.split('\n');
            if (!lines[lines.length - 1]) {
                const rowsCount = (quickInput.value.split('\n').length || 1) - 1;
                if (rowsCount > 0 && rowsCount <= 3)
                    quickInput.attributes['rows'].value = rowsCount;
            }
        }
    }

    const sendQuery = (query) => {
        ipc.send('quick-query', query);
    }

    loadQuickActions().then((data) => {
        quickActions = data;
    });
    suggestionsList.onclick = (event) => {
        quickInput.value = event.target.textContent;
    }
    const suggestions = (input) => {
        const lines = input.split('\n');
        const lineCount = lines.length;
        if (lineCount == 1 && lines[0].indexOf(':') == -1) {
            items = quickActions.filter(item => item.toUpperCase().indexOf(input.toUpperCase()) > -1);
            let suggestionHtml = items.map(itm => `<li>${itm}</li>`).join(' ')
            suggestionsList.innerHTML = suggestionHtml;
            if(!items.length) {
                document.getElementById('suggestion').style.display = 'none';
            }else {
                document.getElementById('suggestion').style.display = '';
            }
        }else {
            document.getElementById('suggestion').style.display = 'none';
        }
    }
});

function loadQuickActions() {
    return new Promise((resolve, reject) => {
        try {
            ipc.send('quick-app-ready');
            ipc.on('init', (event, args) => {
                resolve(args);
            })
        } catch (error) {
            reject(error);
        }

    });
}