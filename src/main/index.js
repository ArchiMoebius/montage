import { app, ipcMain, dialog, BrowserWindow } from 'electron';// eslint-disable-line

import { checksumFile } from '../utils';

const logger = require('electron-log');

let mainWindow;

const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
  logger.info('application started');

  mainWindow = new BrowserWindow({
    fullscreen: true
  });

  mainWindow.webContents.openDevTools();
  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
    logger.info('application closed correctly');
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

async function processDialog(paths, event, opts) {
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
  // TODO: use opts
  const checksums = {};
  const filesToProcess = [];
  const filePromises = await files.map(async (filepath) => {
    const checksum = await checksumFile('md5', filepath);

    if (!checksums[checksum]) {
      checksums[checksum] = true;
      filesToProcess.push({ checksum, filepath });
    }
  });
  await Promise.all(filePromises);
  const fileCount = filesToProcess.length;
  filesToProcess.forEach((fileItem) => {
    event.sender.send(
      'images-added',
      {
        filepath: fileItem.filepath,
        checksum: fileItem.checksum,
        fileCount,
        opts
      }
    );
  });
}

ipcMain.on('open-file-dialog', (event, opts) => {
  dialog.showOpenDialog({
    filters: [
      {
        name: 'Images', extensions: ['jpg', 'png', 'jpeg']
      }
    ],
    properties: ['openFile', 'multiSelections']
  }, (files) => {
    if (files && files.length > 0) {
      processDialog(files, event, opts);
    }
  });
});

ipcMain.on('open-folder-dialog', (event, opts) => {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, (files) => {
    if (files && files.length > 0) {
      processDialog(files, event, opts);
    }
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
