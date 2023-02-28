const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setMainWin: () => ipcRenderer.send('set-main-win'),
    setFocusWin: () => ipcRenderer.send('set-focus-win'),
    showNotif: () => ipcRenderer.send('show-notif'),
    closeWindows: () => ipcRenderer.send('close-windows'),
    minimizeWindows: () => ipcRenderer.send('minimize-windows'),
    maximizeWindows: () => ipcRenderer.send('maximize-windows'),
    runNextTimer: (callback) => ipcRenderer.on('run-next-timer', callback)
})

//default code
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }
  })

