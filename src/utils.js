const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const archiver = require('archiver');
const logger = require('electron-log');
const sharp = require('sharp');
const geo = require('mt-geo');
const { ExifImage } = require('exif');

function checksumFile(algorithm, path) { // https://stackoverflow.com/questions/18658612/obtaining-the-hash-of-a-file-using-the-stream-capabilities-of-crypto-module-ie#18658613
  return new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .on('error', reject)
      .pipe(crypto.createHash(algorithm)
        .setEncoding('hex'))
        .once('finish', function() { //eslint-disable-line
        resolve(this.read());
      });
  });
}

async function exportAsArchive(paths, outputFilepath) {
  return new Promise((resolve, reject) => {
    if (outputFilepath.indexOf('.') === -1) {
      outputFilepath = `${outputFilepath}.zip`;
    }
    const output = fs.createWriteStream(outputFilepath);
    const archive = archiver('zip', {
      zlib: {
        level: 9
      }
    });

    output.on('end', () => {
      resolve(outputFilepath);
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        logger.error(err);
      } else {
        reject(err);
      }
    });

    // good practice to catch this error explicitly
    archive.on('error', reject);

    archive.pipe(output);

    paths.forEach((filepath) => {
      archive.file(filepath, { name: path.basename(filepath) });
    });

    archive.finalize();
  });
}

async function getImageMetadata(filepath) {
  const ret = {};
  return new Promise(async (resolve, reject) => {
    let metadata;
    try {
      metadata = await sharp(filepath).metadata();
      ret.width = metadata.width;
      ret.height = metadata.height;
      ret.density = metadata.density;
      ret.space = metadata.space;
      ret.channels = metadata.channels;
    } catch (e) {
      reject(e);
      logger.error(e);
    }

    if (
      metadata &&
      metadata.exif
    ) {
      try {
        new ExifImage({image: filepath}, (error, exifData) => { //eslint-disable-line
          if (error) {
            resolve(ret);
            logger.error(error.message);
          } else {
            ret.flash = exifData.exif.Flash;
            ret.datetime = exifData.exif.CreateDate;
            ret.make = exifData.image.Make;
            ret.model = exifData.image.Model;
            ret.software = exifData.image.Software;

            if (exifData.gps && exifData.gps.GPSLongitude) {
              ret.hasLocation = true;
              ret.longitude = geo.parseDMS(exifData.gps.GPSLongitude.join(' '));
              ret.latitude = geo.parseDMS(exifData.gps.GPSLatitude.join(' '));
            } else {
              ret.hasLocation = false;
            }

            ret.isGrey = false; // TODO: implement this later
            ret.faces = [];
            ret.postProcessedBy = [];
            ret.prominentColors = [];
            ret.objects = [];
            resolve(ret);
          }
        });
      } catch (error) {
        resolve(ret);
        logger.error(error);
      }
    } else {
      resolve(ret);
    }
  });
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
      const gallery = { title: file, files: [] };
      const checksums = {};
      const fileCheckSums = await files.map(async (filepath) => {
        const checksum = await checksumFile('md5', filepath);

        if (!checksums[checksum]) {
          checksums[checksum] = true;
          gallery.files.push({ filepath, checksum });
        }
      });
      await Promise.all(fileCheckSums);
      galleries.push(gallery);
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
      const fileStat = fs.statSync(filepath);
      filesToProcess.push({
        checksum,
        filepath,
        mtime: fileStat.mtime,
        atime: fileStat.atime,
        ctime: fileStat.ctime
      });
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
  processFiles,
  getImageMetadata,
  exportAsArchive
}; //eslint-disable-line
