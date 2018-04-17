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
      <md-button style="float:right;" class="md-primary" @click="showDialog = false">
        <md-icon>close</md-icon>
        <md-tooltip>Close Window</md-tooltip>
      </md-button>
      <md-button style="float:right;" class="md-primary" @click="moveImageView( image, 'next' )">
        <md-icon>arrow_forward</md-icon>
        <md-tooltip>Next Image</md-tooltip>
      </md-button>
      <md-button style="float:right;" class="md-primary" @click="moveImageView( image, 'prev' )">
        <md-icon>arrow_back</md-icon>
        <md-tooltip>Previous Image</md-tooltip>
      </md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { mapActions } from 'vuex';

import { EventBus } from '../store/EventBus';

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
      'ImageGallery/deleteImage'
    ]),
    async deleteImage(image) {
      await this.$store.dispatch('ImageGallery/deleteImage', image.id);
      this.showDialog = false;
      this.image = {};
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
