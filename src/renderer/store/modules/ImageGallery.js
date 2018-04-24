const dbhandle = require('../db').default.getInstance();
const path = require('path');
const logger = require('electron-log');

const state = {
  image: {},
  gallery: {
    images: []
  },
  galleries: [],
  galleryPage: 0,
  galleryPageItems: 10
};

const mutations = {
  ADD_IMAGE_TO_GALLERY(state, data) {
    // data.image.thumbnail = URL.createObjectURL(data.image.thumbnail);
    state.gallery.images.push(data.image);
  },
  UPDATE_IMAGE_THUMBNAIL(state, data) {
    state.image.thumbnail = data.thumbnail;
    state.gallery.images = state.gallery.images.map((image) => {
      if (image.id === data.id) {
        image.thumbnail = data.thumbnail;
      }
      return image;
    });
  },
  UPDATE_IMAGE_SRC(state, data) {
    state.image.src = data.src;
    state.gallery.images = state.gallery.images.map((image) => {
      if (image.id === data.id) {
        image.src = data.src;
      }
      return image;
    });
    state.image.src = data.src;
  },
  CURRENT_GALLERY(state, data) {
    state.gallery = data.gallery;
  },
  GALLERIES(state, data) {
    state.galleries = data.galleries;
  },
  ADD_GALLERY(state, data) {
    state.galleries.push(data);
  },
  UPDATE_GALLERY(state, data) { // TODO: better way todo this?
    state.gallery.title = data.title;
    state.gallery.tags = data.tags;
    state.galleries = state.galleries.map((gallery) => {
      if (gallery.id === data.id) {
        gallery.title = data.title;
        gallery.tags = data.tags;
      }
      return gallery;
    });
  },
  REMOVE_GALLERY(state, data) {
    state.galleries = state.galleries.filter(gallery => gallery.id !== data.id);
    state.gallery.images = [];
  },
  REMOVE_IMAGE(state, data) {
    state.gallery.images = state.gallery.images.filter(image => image.id !== data.id);
  }
};

const getters = {
  galleries(state) {
    return state.galleries;
  },
  gallery(state) {
    return state.gallery;
  },
  image(state) {
    return state.image;
  }
};

const setters = {
  gallery() {
    return false;
  }
};

const actions = {
  async updateGallery(context, data) {
    try {
      const galleryId = data.id;
      delete data.id;
      await dbhandle.gallery.update(galleryId, data);
      data.id = galleryId;
      context.commit(
        'UPDATE_GALLERY',
        data
      );
    } catch (e) {
      logger.error(e);
    }
  },
  addGallery(context, data) {
    return new Promise(async (resolve, reject) => {
      let ret = false;
      const gallery = {
        thumbnail: path.join(__static, 'default_gallery_thumbnail.png'),
        title: data.title,
        tags: data.tags.map(function(tag) { //eslint-disable-line
          return tag.replace(/\s\s+/g, '-').toLowerCase();
        })
      };

      try {
        ret = await dbhandle.gallery.add(gallery);
      } catch (e) {
        logger.error(e);
        reject(e);
      }

      if (ret) {
        gallery.id = ret;
        context.commit('ADD_GALLERY', gallery);
      }
      resolve(ret);
    });
  },
  async deleteGallery(context, galleryId) {
    try {
      await dbhandle.image.where({ galleryId }).delete();
      await dbhandle.gallery.delete(galleryId);
      context.commit(
        'REMOVE_GALLERY',
        {
          id: galleryId
        }
      );
    } catch (e) {
      logger.error(e);
    }
  },
  async loadGallery(context, galleryId) {
    let gallery;
    let galleryImages = [];

    try {
      gallery = await dbhandle.gallery.where({
        id: galleryId
      }).toArray();

      galleryImages = await dbhandle.image.where({
        galleryId
      }).toArray();
    } catch (e) {
      logger.error(e);
    }
    gallery = gallery.pop();
    gallery.images = galleryImages;
    context.commit(
      'CURRENT_GALLERY',
      {
        gallery
      }
    );
  },
  async loadGalleries(context) {
    let galleries = [];

    try {
      galleries = await dbhandle.gallery.toArray();//eslint-disable-line
    } catch (e) {
      logger.error(e);
    }
    context.commit(
      'GALLERIES',
      {
        galleries
      }
    );
  },
  async addOrUpdateImageMetadata(context, data) {
    return new Promise(async (resolve, reject) => {
      let ret;

      try {
        ret = await dbhandle.ImageMetadata.where({ hash: data.hash }).toArray();
      } catch (e) {
        logger.error(e);
      }

      try {
        if (ret.length > 0 && ret[0].id) {
          ret = await dbhandle.ImageMetadata.update(ret[0].id, data);
        } else {
          ret = await dbhandle.ImageMetadata.add(data);
        }
      } catch (e) {
        logger.error(e);
      }

      if (ret) {
        resolve(ret);
      } else {
        reject(Error('Unable to add image'));
      }
    });
  },
  async addImage(context, data) {
    return new Promise(async (resolve, reject) => {
      let ret = false;

      try {
        ret = await dbhandle.image.where('[hash+id]').equals([data.image.hash, data.galleryId]).count();
      } catch (e) {
        logger.error(e);
      }

      if (ret <= 0) {
        data.image.galleryId = data.galleryId;

        try {
          ret = await dbhandle.image.add(data.image);
        } catch (e) {
          logger.error(e);
        }

        if (ret) {
          data.image.id = ret;
          context.commit('ADD_IMAGE_TO_GALLERY', data);
          resolve(ret);
        } else {
          reject(Error('Unable to add image'));
        }
      } else {
        reject(Error('Image already added'));
      }
    });
  },
  async updateImageThumbnail(context, imageChanges) {
    try {
      const imageId = imageChanges.id;
      delete imageChanges.id;
      await dbhandle.image.update(imageId, { thumbnail: imageChanges.thumbnail });
      context.commit(
        'UPDATE_IMAGE_THUMBNAIL',
        {
          thumbnail: imageChanges.thumbnail,
          id: imageId
        }
      );
    } catch (e) {
      logger.error(e);
    }
  },
  async updateImageSrc(context, imageChanges) {
    try {
      context.commit(
        'UPDATE_IMAGE_SRC',
        imageChanges
      );
    } catch (e) {
      logger.error(e);
    }
  },
  async deleteImage(context, imageId) {
    try {
      await dbhandle.image.delete(imageId);
      context.commit(
        'REMOVE_IMAGE',
        {
          id: imageId
        }
      );
    } catch (e) {
      logger.error(e);
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
  setters
};
