<template>
  <md-app md-waterfall md-mode="fixed">
    <md-app-toolbar class="md-primary">
      <router-link to="/galleries">
        <md-button class="md-fab md-primary md-icon-button" md-menu-trigger :disabled="galleriesPageActive">
          <md-icon>home</md-icon>
          <md-tooltip md-direction="bottom">Back to galleries</md-tooltip>
        </md-button>
      </router-link>
<!-- Import Images Menu Start -->
      <md-menu md-size="big" md-direction="bottom-end">
        <md-button class="md-icon-button" md-menu-trigger :disabled="galleriesPageActive">
          <md-icon>add_a_photo</md-icon>
          <md-tooltip md-direction="bottom">Import Images</md-tooltip>
        </md-button>
        <md-menu-content>
          <span style="margin-left:10px;" class="md-title">Import Images From</span>
          <md-menu-item @click="importImages()">
            <md-icon>collections</md-icon>
            <span>File</span>
            <md-tooltip md-direction="right">Import specific image files</md-tooltip>
          </md-menu-item>
          <md-menu-item @click="importImagesFolder()">
            <md-icon>folder</md-icon>
            <span>Folder</span>
            <md-tooltip md-direction="right">Import all images under a folder</md-tooltip>
          </md-menu-item>
        </md-menu-content>
      </md-menu>
<!-- Import Images Menu End -->
<!-- Gallery Menu Start -->
      <md-menu md-size="big" md-direction="bottom-end">
        <md-button class="md-icon-button" md-menu-trigger>
          <md-icon>gradient</md-icon>
          <md-tooltip md-direction="bottom">Manage Gallery</md-tooltip>
        </md-button>
        <md-menu-content>
          <span style="margin-left:10px;" class="md-title">Gallery Actions</span>
          <md-menu-item @click="createGallery()">
            <md-icon>note_add</md-icon>
            <span>New</span>
            <md-tooltip md-direction="right">Create new gallery</md-tooltip>
          </md-menu-item>
          <md-menu-item @click="notImplementedYet()" :disabled="galleriesPageActive">
            <md-icon>mode_edit</md-icon>
            <span>Rename</span>
            <md-tooltip v-bind:class="{ disabled: galleriesPageActive }" md-direction="right">Edit Gallery</md-tooltip>
          </md-menu-item>
          <md-menu-item @click="notImplementedYet()" :disabled="galleriesPageActive">
            <md-icon>delete</md-icon>
            <span>Delete</span>
            <md-tooltip v-bind:class="{ disabled: galleriesPageActive }" md-direction="right">Delete Gallery</md-tooltip>
          </md-menu-item>
        </md-menu-content>
      </md-menu>
<!-- Gallery Menu End -->
<!-- Export Menu Start -->
      <md-menu
        md-size="big"
        md-direction="bottom-end"
      >
        <md-button class="md-icon-button" md-menu-trigger :disabled="galleriesPageActive">
          <md-icon>file_download</md-icon>
          <md-tooltip md-direction="bottom">Export Gallery</md-tooltip>
        </md-button>
        <md-menu-content>
          <span style="margin-left:10px;" class="md-title">Export To</span>
          <md-menu-item @click="notImplementedYet()">
            <md-icon>computer</md-icon>
            <span>Save to disk</span>
            <md-tooltip md-direction="right">Save gallery to your harddrive</md-tooltip>
          </md-menu-item>
          <md-menu-item @click="notImplementedYet()">
            <md-icon>storage</md-icon>
            <span>S3</span>
            <md-tooltip md-direction="right">Publish gallery to Amazon S3 storage</md-tooltip>
          </md-menu-item>
          <md-menu-item @click="notImplementedYet()">
            <md-icon>cloud</md-icon>
            <span>IPFS</span>
            <md-tooltip  md-direction="right">Publish gallery to IPFS</md-tooltip>
          </md-menu-item>
        </md-menu-content>
      </md-menu>
<!-- Export Menu Start -->
      <span class="md-title" v-bind:class="{ disabled: galleriesPageActive }">{{ gallery.title }}</span>
    </md-app-toolbar>
    <md-app-content>
      <router-view></router-view>
      <create-gallery-dialog></create-gallery-dialog>
      <show-image-dialog></show-image-dialog>
    </md-app-content>
  </md-app>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { EventBus } from '../store/EventBus';
  import CreateGalleryDialog from './CreateGalleryDialog.vue';
  import ShowImageDialog from './ShowImageDialog.vue';

  const { ipcRenderer } = require('electron');//eslint-disable-line

  /*
  ipcRenderer.on('images-added', async (evt, data) => {//eslint-disable-line
    // console.log('assdfasdf images added and done', this, evt, data);// eslint-disable-line
  });
  */

  export default {
    name: 'navigation-bar',
    components: {
      CreateGalleryDialog,
      ShowImageDialog
    },
    data: () => ({
      gallery: {}
    }),
    computed: {
      ...mapGetters([
        'ImageMetadata/getCount'
      ]),
      galleriesPageActive: function () {//eslint-disable-line
        return (this.$route.name === 'galleries') ? 'disabled' : false;
      }
    },
    methods: {
      importImages: function() {//eslint-disable-line
        ipcRenderer.send('open-file-dialog');
      },
      createGallery: function () {// eslint-disable-line
        EventBus.$emit('create-gallery');
      },
      importImagesFolder: () => {
        ipcRenderer.send('open-folder-dialog');
      },
      notImplementedYet: () => {
        alert('this feature is not yet implemented...');//eslint-disable-line
      },
      updateGallery(gallery) {
        this.gallery = gallery;
      }
    },
    mounted: function() {//eslint-disable-line
      EventBus.$on('view-gallery', this.updateGallery);
    },
    beforeDestroy() {
      EventBus.$off('view-gallery', this.viewImage);
    }
  };
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic');

  body { font-family: 'Roboto', sans-serif; }

  .md-app {
    max-height: 100vh;
    overflow-x: hidden;
  }

  .md-button[disabled] {
    display:none;
  }

  .disabled {
    display:none;
  }

  div.md-app-scroller {
    background-color: #070b11 !important;
    padding: 0px !important;
    margin: 0px !important;
  }

  div.md-app-content {
    background-color: #070b11 !important;
    overflow-x: hidden;
    padding: 0px !important;
    margin: 0px !important;
  }

  img.thumbnail {
    padding: 1px;
    border: 1px solid #101a29;
    cursor: pointer;
  }

  img.thumbnail:hover {
    border: 1px solid #4775bb;
  }
</style>
