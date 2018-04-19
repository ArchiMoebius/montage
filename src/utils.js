const crypto = require('crypto');
const fs = require('fs');

const logger = require('electron-log');
const sharp = require('sharp');

function checksumFile(algorithm, path) { // https://stackoverflow.com/questions/18658612/obtaining-the-hash-of-a-file-using-the-stream-capabilities-of-crypto-module-ie#18658613
  return new Promise((resolve, reject) =>
    fs.createReadStream(path)
      .on('error', reject)
      .pipe(crypto.createHash(algorithm)
        .setEncoding('hex'))
      .once('finish', function () {//eslint-disable-line
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
      const thumbnailBlob = new Blob(
        [new Uint8Array(thumbnailData).buffer],
        {
          type: 'image/png'
        }
      );
      resolve(thumbnailBlob);
    } catch (e) {
      logger.error(e);
      reject(e);
    }
  });
}

export { checksumFile, getThumbnailBlob };//eslint-disable-line
