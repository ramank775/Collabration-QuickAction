const { ipcRenderer: ipc, remote } = require('electron');
const currentWindow = remote.getCurrentWindow();
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


