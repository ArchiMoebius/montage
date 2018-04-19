const Dexie = require('dexie');

export default (function() { //eslint-disable-line
  let instance;

  function createInstance() { //eslint-disable-line
    const db = new Dexie('Montage'); //eslint-disable-line

    db.version(1).stores({
      gallery: '++id, title, *tags',
      image: '++id, galleryId, hasBeenExported, type, hash, [hash+id]',
      ImageMetadata: '++id, &galleryId, &imageId, width, height, isGrey, *prominentColors, *objects, dateTaken, *exifTags, hasLocation, camera, *faces, hasFaces, *postProcessedBy'
    });

    return db;
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
    clean: () => {
      // https://gist.github.com/skratchdot/c6788727ab7005066de9
      Dexie.getDatabaseNames(function(names, cb) { //eslint-disable-line
        console.log('database names: ', names); //eslint-disable-line
        names.forEach(function(name) { //eslint-disable-line
          const db = new Dexie(name);
          db.delete().then(function() { //eslint-disable-line
            console.log('Database successfully deleted: ', name);//eslint-disable-line
          }).catch(function(err) { //eslint-disable-line
            console.error('Could not delete database: ', name, err);//eslint-disable-line
          }).finally(function() { //eslint-disable-line
            console.log('Done. Now executing callback if passed.');//eslint-disable-line
            if (typeof cb === 'function') {
              cb();
            }
          });
        });
      });
    }
  };
})();
