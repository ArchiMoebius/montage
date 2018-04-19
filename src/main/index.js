import { app, ipcMain, dialog, BrowserWindow } from 'electron';// eslint-disable-line

import { processFiles, pathToGalleries } from '../utils';

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

ipcMain.on('import-images-dialog', (event, opts) => {
  let filterExtensions = ['jpg', 'png', 'jpeg'];
  let filterName = 'Images';
  let filterProps = ['openFile', 'multiSelections'];

  if (opts.imageSource === '0') {
    filterExtensions = false;
    filterName = 'Import all images into this gallery';
    filterProps = ['openDirectory'];
  }

  if (opts.imageSource === '2') {
    filterExtensions = false;
    filterName = 'Import each directory as a gallery';
    filterProps = ['openDirectory'];
  }

  dialog.showOpenDialog({
    filters: [
      {
        name: filterName, extensions: filterExtensions
      }
    ],
    properties: filterProps
  }, async (paths) => {
    if (paths && paths.length > 0) {
      if (
        opts.imageSource === '0' ||
        opts.imageSource === '1'
      ) {
        const filesToProcess = await processFiles(paths);

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

      if (opts.imageSource === '2') {
        const galleries = await pathToGalleries(paths[0]);
        galleries.forEach((gallery) => {
          event.sender.send(
            'add-gallery',
            {
              gallery,
              opts
            }
          );
        });
      }
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
