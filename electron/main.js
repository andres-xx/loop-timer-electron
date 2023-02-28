const { app, BrowserWindow, ipcMain, screen } = require("electron");
const { Notification } = require('electron')
const path = require("path");

try {
	require('electron-reloader')(module);
} catch {}

let mainWindow;
let focusWindows;
let screenWidth;
let screenHeight;
let mainWidth = 750;
let mainHeight = 700;
let focusWidth = 100;
let focusHeight = 58;
let notification;

const createWindow = () => {
  // Création de la fenêtre de navigateur.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    center: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  
  //afficher la console
  mainWindow.webContents.openDevTools()
  // et chargement de l'index.html de l'application.
  mainWindow.loadFile("windows/main/main.html");
};


// Cette méthode sera appelée quand Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quant cet événement est émit.

function setMainWindow () {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  }
  screenWidth = screen.getPrimaryDisplay().size.width;
  screenHeight = screen.getPrimaryDisplay().size.height;

  mainWindow.setContentSize(focusWidth, focusHeight);
  mainWindow.setPosition(screenWidth - focusWidth, (screenHeight - focusHeight)/2);
  
  //gameWindow.webContents.openDevTools();
  mainWindow.setAlwaysOnTop(true, "screen-saver");
  mainWindow.setVisibleOnAllWorkspaces(true);
  // mainWindow.hide();
  // createWindow2();
}

function setFocusWindow () {
  mainWindow.setContentSize(mainWidth, mainHeight);
  mainWindow.setPosition(350, 20);
  //gameWindow.webContents.openDevTools();
  mainWindow.setAlwaysOnTop(false, "screen-saver");
  mainWindow.setVisibleOnAllWorkspaces(true);
}

function showNotification(){
  notification = new Notification({
    title: 'Timer finished',
    body: 'Click to start the next timer',
    buttons: [],
    timeoutType: 'never',
    silent: false, // Activer le son de la notification
    sound: 'rain.mp3'
  })
  
  notification.show();
  notification.on('click', () => {
    mainWindow.webContents.send('run-next-timer')
  })
}

function closeWindow(){
  mainWindow.close();
}

function minimizeWindow(){
  mainWindow.minimize();
}

function maximizeWindow(){
  if (!mainWindow.isMaximized()) {
    mainWindow.maximize();
  }
  else{
    mainWindow.unmaximize();
  }
  
}


app.whenReady().then(() => {
  ipcMain.on('set-main-win', setMainWindow);
  ipcMain.on('set-focus-win', setFocusWindow);
  ipcMain.on('show-notif', showNotification);
  ipcMain.on('close-windows', closeWindow);
  ipcMain.on('maximize-windows', maximizeWindow);
  ipcMain.on('minimize-windows', minimizeWindow);

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


