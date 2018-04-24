import { app, ipcMain, dialog, BrowserWindow } from 'electron';// eslint-disable-line

import { processFiles, pathToGalleries } from '../utils';

const logger = require('electron-log');
const moment = require('moment');

let mainWindow;

const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
  logger.info('application started');

  mainWindow = new BrowserWindow({
    fullscreen: true,
    backgroundColor: '#070e1a',
    titleBarStyle: 'hidden',
    fullscreenWindowTitle: false,
    frame: false,
    acceptFirstMouse: true
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
  let filterName = 'Import selected images into this gallery';
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
        name: filterName,
        extensions: filterExtensions
      }
    ],
    properties: filterProps
  }, async (paths) => {
    if (paths && paths.length > 0) {
      if (
        opts.imageSource === '0' ||
        opts.imageSource === '1'
      ) {
        let filesToProcess = await processFiles(paths);

        const filterIndexs = {
          '0': 'mtime',//eslint-disable-line
          '1': 'atime',//eslint-disable-line
          '2': 'ctime',//eslint-disable-line
          '3': 'datetime'//eslint-disable-line
        };

        if (opts.filterImages) {
          const startDate = moment(opts.startDate);
          const endDate = moment(opts.endDate);
          filesToProcess = filesToProcess.filter((item) => {//eslint-disable-line
            return (
              moment(item[filterIndexs[opts.startDateFilter]]).isBetween(startDate, endDate) &&
              moment(item[filterIndexs[opts.endDateFilter]]).isBetween(startDate, endDate)
            );
          });
        }

        if (opts.groupImagesByDatetime) {
          const galleries = [{
            startDate: moment(filesToProcess[0][filterIndexs[opts.imageGroupingDate]]),
            endDate: moment(filesToProcess[0][filterIndexs[opts.imageGroupingDate]]).add(opts.imageGroupingDays, 'days'),
            title: 'Gallery 1',
            files: [
              filesToProcess[0]
            ]
          }];
          filesToProcess.shift();
          filesToProcess.forEach((item) => {//eslint-disable-line
            const galleryFound = galleries.find((gallery) => {
              const itemDate = moment(item[filterIndexs[opts.imageGroupingDate]]);
              const foundHome = itemDate.isBetween(gallery.startDate, gallery.endDate);

              if (foundHome) {
                gallery.endDate = itemDate.add(opts.imageGroupingDays, 'days');
                gallery.files.push(item);
              }

              return foundHome;
            });

            if (typeof (galleryFound) === 'undefined') {
              galleries.push({
                startDate: moment(item[filterIndexs[opts.imageGroupingDate]]),
                endDate: moment(item[filterIndexs[opts.imageGroupingDate]]).add(opts.imageGroupingDays, 'days'),
                title: `Gallery ${galleries.length + 1}`,
                files: [
                  item
                ]
              });
            }
          });
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

        if (
          filesToProcess.length > 0 &&
          !opts.groupImagesByDatetime
        ) {
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
