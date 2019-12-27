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
    const quickinputHost = document.getElementById('quick-input-host');
    const quickInputContainer = document.getElementById('quick-host-container');
    const quickInput = document.getElementById('quick-input');
    let isquckInputEnable = false;

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
    quickActionIcon.onmouseenter = () => {
        currentWindow.setIgnoreMouseEvents(false, { forward: false });
    }

    quickInput.onkeypress = (event) => {
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
});