const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const logger = require('electron-log');
const sharp = require('sharp');

function checksumFile(algorithm, path) { // https://stackoverflow.com/questions/18658612/obtaining-the-hash-of-a-file-using-the-stream-capabilities-of-crypto-module-ie#18658613
  return new Promise((resolve, reject) =>
    fs.createReadStream(path)
      .on('error', reject)
      .pipe(crypto.createHash(algorithm)
        .setEncoding('hex'))
      .once('finish', function() { //eslint-disable-line
        resolve(this.read());
      }));
}

async function getThumbnailBlob(filepath) {
  return new Promise(async (resolve, reject) => {
    try {
      const thumbnailData = await sharp(filepath)
        .resize(180)
        .toFormat('png')
        .toBuffer();
      const thumbnailBlob = new Blob([new Uint8Array(thumbnailData).buffer], { type: 'image/png' });
      resolve(thumbnailBlob);
    } catch (e) {
      logger.error(`failed to get thumbnail for image: ${filepath}`);
      reject(e);
    }
  });
}

const getImagesFromDirectory = (directory) => {
  let fileArray = [];
  const files = fs.readdirSync(directory);
  const supportedFileTypes = /(\.jpg|\.jpeg|\.png)$/i;

  files.forEach((file) => {
    const filepath = path.join(directory, file);
    const pathStat = fs.statSync(filepath);

    if (pathStat.isDirectory()) {
      fileArray = fileArray.concat(getImagesFromDirectory(filepath));
    } else if (supportedFileTypes.test(filepath)) {
      fileArray.push(filepath);
    }
  });
  return fileArray;
};

async function pathToGalleries(src) {
  const galleries = [];
  const files = fs.readdirSync(src);

  const filePromises = await files.map(async (file) => {
    const filepath = path.join(src, file);
    const pathStat = fs.statSync(filepath);

    if (pathStat.isDirectory()) {
      const files = await getImagesFromDirectory(filepath);
      galleries.push({ title: file, files });
    }
  });
  await Promise.all(filePromises);

  return galleries;
}

async function processFiles(paths) {
  let files = [];

  if (paths.length === 1) { // a single image or a directory to iterate over
    const pathStat = fs.statSync(paths[0]);

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
  return filesToProcess;
}

export {
  checksumFile,
  getThumbnailBlob,
  getImagesFromDirectory,
  pathToGalleries,
  processFiles
}; //eslint-disable-line
