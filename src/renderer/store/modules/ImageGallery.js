const db = require('../db').default.getInstance();
const path = require('path');

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
    const dbhandle = await db.open();
    let ret = false;
    const gallery = {
      thumbnail: path.join(__static, 'default_gallery_thumbnail.png'),
      title: data.title,
      hasBeenDeleted: 0,
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
      console.log(e);//eslint-disable-line
    }

    if (ret) {
      gallery.id = ret;
      context.commit('ADD_GALLERY', gallery);
    }
  },
  async deleteGallery(context, galleryId) {
    const dbhandle = await db.open();

    try {
      await dbhandle.gallery.delete(galleryId);
      context.commit(
        'REMOVE_GALLERY',
        {
          id: galleryId
        }
      );
    } catch (e) {
      console.log(e);//eslint-disable-line
    }
  },
  async trashGallery(context, galleryId) {
    const dbhandle = await db.open();

    try {
      await dbhandle.gallery.update(
        galleryId,
        {
          deleted: true
        }
      );
      context.commit(
        'REMOVE_GALLERY',
        {
          id: galleryId
        }
      );
    } catch (e) {
      console.log(e);//eslint-disable-line
    }
  },
  async loadGallery(context, galleryId) {
    const dbhandle = await db.open();
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
      console.log(e); //eslint-disable-line
    }
    console.log('galleryImages', galleryImages);//eslint-disable-line
    gallery = gallery.pop();
    gallery.images = galleryImages;
    /*
      .map((image) => {
      image.thumbnail = URL.createObjectURL(image.thumbnail);
      return image;
    });
    */
    console.log('gallery', gallery);//eslint-disable-line
    context.commit(
      'CURRENT_GALLERY',
      {
        gallery
      }
    );
  },
  async loadGalleries(context) {
    const dbhandle = await db.open();
    let galleries;

    try {
      galleries = await dbhandle.gallery.where({hasBeenDeleted: 0}).toArray();//eslint-disable-line
    } catch (e) {
      console.log(e); //eslint-disable-line
    }
    context.commit(
      'GALLERIES',
      {
        galleries
      }
    );
  },
  async addImage(context, data) {
    const dbhandle = await db.open();
    let ret = false;
    data.image.galleryId = data.galleryId;

    try {
      ret = await dbhandle.image.add(data.image);
    } catch (e) {
      console.log(e);//eslint-disable-line
    }

    if (ret) {
      data.image.id = ret;
      context.commit('ADD_IMAGE_TO_GALLERY', data);
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
