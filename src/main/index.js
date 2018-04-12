import { app, ipcMain, dialog, BrowserWindow } from 'electron' // eslint-disable-line

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

const { statSync, readdirSync } = require('fs');
const { join } = require('path');
const getImagesFromDirectory = (directory) => {
  let fileArray = [];
  const files = readdirSync(directory);
  const supportedFileTypes = /(\.jpg|\.jpeg|\.png)$/i;

  files.forEach((file) => {
    const filepath = join(directory, file);
    const pathStat = statSync(filepath);

    if (pathStat.isDirectory()) {
      fileArray = fileArray.concat(getImagesFromDirectory(filepath));
    } else if (supportedFileTypes.test(filepath)) {
      fileArray.push(filepath);
    }
  });
  return fileArray;
};

const processDialog = (paths, event) => {
  let files = [];

  if (paths.length === 1) { // a single image or a directory to iterate over
    const pathStat = statSync(paths[0]);

    if (pathStat.isDirectory()) {
      files = getImagesFromDirectory(paths[0]);
    } else {
      files = paths;
    }
  } else { // array of images to import
    files = paths;
  }

  files.forEach((filepath) => {
    event.sender.send('images-added', filepath);
  });
};


ipcMain.on('open-file-dialog', (event) => {
  dialog.showOpenDialog({
    filters: [
      {
        name: 'Images', extensions: ['jpg', 'png', 'jpeg']
      }
    ],
    properties: ['openFile', 'multiSelections']
  }, (files) => {
    if (files) {
      processDialog(files, event);
    }
  });
});


ipcMain.on('open-folder-dialog', (event) => {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, (files) => {
    processDialog(files, event);
  });
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
