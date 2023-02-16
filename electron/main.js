const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const createWindow = () => {
  // Création de la fenêtre de navigateur.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  
  mainWindow.webContents.openDevTools()
  // et chargement de l'index.html de l'application.
  mainWindow.loadFile("windows/main/main.html");

  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
  })
};

// Cette méthode sera appelée quand Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quant cet événement est émit.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // Sur macOS il est commun de re-créer une fenêtre  lors
    // du click sur l'icone du dock et qu'il n'y a pas d'autre fenêtre ouverte.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quitter quand toutes les fenêtres sont fermées, sauf sur macOS. Dans ce cas il est courant
// que les applications et barre de menu restents actives jusqu'à ce que l'utilisateur quitte
// de manière explicite par Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// gestion de la nouvelle fenetre
function createTimerWindow() {
  timerWindow = new BrowserWindow({
    width: 300,
    height: 200,
    alwaysOnTop: true,
    frame: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  timerWindow.loadFile("timer.html");
  
}


function showTimerWindow() {
  if (!timerWindow) {
    createTimerWindow();
  }

  if (mainWindow) {
    mainWindow.hide();
  }

  timerWindow.setAlwaysOnTop(true);
  timerWindow.show();
}

