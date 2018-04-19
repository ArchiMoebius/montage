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
  addGallery() {
    return false;
  }
};

const actions = {
  async addGallery(context, data) {
    let ret = false;
    const gallery = {
      thumbnail: path.join(__static, 'default_gallery_thumbnail.png'),
      title: data.title,
      isAnEvent: (data.startDate != null && data.endDate != null),
      dateStart: data.startDate || new Date(),
      dateEnd: data.endDate || new Date(),
      tags: data.tags.map(function(tag) { //eslint-disable-line
        return tag.replace(/\s\s+/g, '-').toLowerCase();
      })
    };

    try {
      ret = await dbhandle.gallery.add(gallery);
    } catch (e) {
      logger.error(e);
    }

    if (ret) {
      gallery.id = ret;
      context.commit('ADD_GALLERY', gallery);
    }
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
    let galleries;

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
  async addImage(context, data) {
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
      }
    }
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
