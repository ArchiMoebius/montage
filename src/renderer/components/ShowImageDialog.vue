<template>
  <md-dialog :md-active.sync="showDialog" style="width:90%;height:96vh;max-height:100% !important;background-color:#070b11 !important;color:#eee;">
    <md-card class="md-layout-item md-size-100" style="background-color: #070b11 !important;">
      <md-card-content style="background-color: #070b11 !important;max-height:100vh;max-width:100vw;overflow:hidden;padding:0px;">
        <img @click="moveImageView( image, 'next' )" :src="image.src" :alt="image.alt" style="max-width: 100%;width: auto;max-height: 85vh;height: auto;display: block;margin: 0px auto;">
      </md-card-content>
    </md-card>
    <md-dialog-actions style="float:left;display:block;">
      <md-button style="float:left;" class="md-accent" @click="deleteImage( image )">
        <md-icon>delete</md-icon>
        <md-tooltip>Delete Image</md-tooltip>
      </md-button>
      <md-button style="float:left;" class="md-primary" @click="showImageInFilesystem( image )">
        <md-icon>file_download</md-icon>
        <md-tooltip>View Image</md-tooltip>
      </md-button>
      <md-button style="float:right;" class="md-primary" @click="showDialog = false">
        <md-icon>close</md-icon>
        <md-tooltip>Close Window</md-tooltip>
      </md-button>
      <md-button style="float:right;" class="md-primary" @click="rotateImage( image, 90 )">
        <md-icon>rotate_right</md-icon>
        <md-tooltip>Rotate image to the right 90°</md-tooltip>
      </md-button>
      <md-button style="float:right;" class="md-primary" @click="rotateImage( image, 180 )">
        <md-icon>transform</md-icon>
        <md-tooltip>Rotate image 180°</md-tooltip>
      </md-button>
      <md-button style="float:right;" class="md-primary" @click="rotateImage( image, -90 )">
        <md-icon>rotate_left</md-icon>
        <md-tooltip>Rotate image to the left 90°</md-tooltip>
      </md-button>
      <md-button style="float:right;" class="md-primary md-raised" @click="moveImageView( image, 'next' )">
        <md-icon>arrow_forward</md-icon>
        <md-tooltip>Next Image</md-tooltip>
      </md-button>
      <md-button style="float:right;" class="md-primary md-raised" @click="moveImageView( image, 'prev' )">
        <md-icon>arrow_back</md-icon>
        <md-tooltip>Previous Image</md-tooltip>
      </md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { mapActions } from 'vuex';

import { EventBus } from '../store/EventBus';
import { getThumbnailBlob } from '../../utils';

const { remote,shell } = require('electron');//eslint-disable-line

const logger = require('electron-log');
const sharp = require('sharp');
const fs = require('fs');

sharp.cache(false);

export default {
  name: 'show-image-dialog',
  created: function() { //eslint-disable-line
    EventBus.$on('show-image', this.viewImage);
  },
  data: () => ({
    image: {},
    showDialog: false
  }),
  methods: {
    ...mapActions([
      'ImageGallery/deleteImage',
      'ImageGallery/updateImage'
    ]),
    showImageInFilesystem(image) {
      const shown = shell.showItemInFolder(image.src);

      if (!shown) {
        logger.error('Unable to show item in folder');
        new Notification('Unable to find image...');//eslint-disable-line
      }
    },
    async rotateImage(image, angle) {
      image.src = image.src.split('?')[0];//eslint-disable-line
      const me = this;

      try {
        await sharp(image.src, { useExifOrientation: false })
          .rotate(angle)
          .toFile(`${image.src}.tmp`);
        fs.renameSync(`${image.src}.tmp`, image.src);
        const thumbnailBlob = await getThumbnailBlob(image.src);
        const datetime = new Date();
        image.src = `${image.src}?${datetime.getTime()}`;

        const reader = new FileReader();
        reader.onloadend = async function() {//eslint-disable-line
          image.thumbnail = reader.result;
          await me.$store.dispatch('ImageGallery/updateImage', image.id, { thumbnail: image.thumbnail }); // TODO: fix this.
        };
        reader.readAsDataURL(thumbnailBlob);
      } catch (e) {
        logger.error(e);
      }
    },
    async deleteImage(image) {
      const deleteImage = remote.dialog.showMessageBox(
        remote.getCurrentWindow(),
        {
          title: 'Remove Image?',
          type: 'question',
          message: 'Are you sure you want to remove this image from the gallery?',
          buttons: [
            'No',
            'Yes'
          ]
        }
      );

      if (deleteImage) {
        await this.$store.dispatch('ImageGallery/deleteImage', image.id);
        this.showDialog = false;
        this.image = {};
      }
    },
    viewImage(image) {
      this.image = image;
      this.showDialog = true;
    },
    moveImageView(image, direction) {
      EventBus.$emit(`load-${direction}-image`, image.index);
    }
  },
  beforeDestroy() {
    EventBus.$off('show-image', this.viewImage);
  }
};
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic');

  body {
    font-family: 'Roboto', sans-serif;
  }
</style>
