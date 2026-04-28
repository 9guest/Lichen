// Modules to control application life and create native browser window
import { app, BrowserWindow, dialog, shell, ipcMain, screen, Menu } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { registerIpcHandlers } from './src/modules/app-ipc-handler.js';
import log from './src/modules/app-color-log.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const indexDir = path.join(__dirname, 'src', 'views', 'html', 'index.html');
const preloadDir = path.join(__dirname, 'src', 'preload', 'preload.js');

let mainWindow = null;

// Register the protocol handler
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('ycslichen', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('ycslichen')
}

async function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 720,
    minWidth: 1024,
    minHeight: 720,
    webPreferences: {
      preload: preloadDir,
      contextIsolation: true,
      nodeIntegration: false,
    }
  })

  // and load the index.html of the app.
  await mainWindow.loadFile(indexDir)
  return mainWindow

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// Ensure single instance application with protocol handling
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }

    // the commandLine is array of strings in which last element is deep link url
    dialog.showErrorBox('Welcome Back', `You arrived from : ${commandLine.pop()}`)
    log.app('Second instance launched with URL:', commandLine.pop());
  })

  app.whenReady().then(async () => {
    
    // Register IPC Handlers first, before creating the window
    registerIpcHandlers(ipcMain, { getMainWindow: () => mainWindow, dialog, shell, app });
    log.ipc('IPC handlers registered.');

    // Create Windows
    await createWindow()

    app.on('activate', function () {
      // On macOS, it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
}

app.on('open-url', function (event, url) {
  dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
})

// Quit when all windows are closed, except on macOS. There, common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
