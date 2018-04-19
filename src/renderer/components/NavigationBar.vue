<template>
  <md-app md-waterfall md-mode="fixed" :md-scrollbar="showScrollbar">
    <md-app-toolbar class="md-primary">
      <router-link to="/galleries">
        <md-button class="md-fab md-primary md-icon-button" md-menu-trigger :disabled="galleriesPageActive">
          <md-icon>home</md-icon>
          <md-tooltip md-direction="bottom">Back to galleries</md-tooltip>
        </md-button>
      </router-link>
<!-- Import Images Menu Start -->
      <md-button class="md-icon-button" md-menu-trigger :disabled="galleriesPageActive" @click="importImages()">
        <md-icon>add_a_photo</md-icon>
        <md-tooltip md-direction="bottom">Import Images</md-tooltip>
      </md-button>
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
          <md-menu-item @click="deleteGallery()" :disabled="galleriesPageActive">
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
      <import-images-dialog></import-images-dialog>
    </md-app-content>
  </md-app>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { EventBus } from '../store/EventBus';
  import CreateGalleryDialog from './CreateGalleryDialog.vue';
  import ShowImageDialog from './ShowImageDialog.vue';
  import ImportImagesDialog from './ImportImagesDialog.vue';

  export default {
    name: 'navigation-bar',
    components: {
      CreateGalleryDialog,
      ShowImageDialog,
      ImportImagesDialog
    },
    data: () => ({
      gallery: {},
      showScrollbar: false
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
      importImages() {
        EventBus.$emit('import-images');
      },
      createGallery() {
        EventBus.$emit('create-gallery');
      },
      deleteGallery() {
        EventBus.$emit('delete-gallery', this.gallery);
      },
      notImplementedYet: () => {
        alert('this feature is not yet implemented...');//eslint-disable-line
      },
      updateGallery(gallery) {
        this.gallery = gallery;
      }
    },
    mounted() {
      EventBus.$on('view-gallery', this.updateGallery);
    },
    beforeDestroy() {
      EventBus.$off('view-gallery', this.updateGallery);
    }
  };
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic');

  body { font-family: 'Roboto', sans-serif; background-color: #070e1a;}

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
    background-color: #070e1a !important;
    padding: 0px !important;
    margin: 0px !important;
  }

  div.md-app-content {
    background-color: #070e1a !important;
    overflow-x: hidden;
    padding: 0px !important;
    margin: 0px !important;
  }

  img.thumbnail {
    padding: 1px;
    border: 1px solid #0a1425;
    cursor: pointer;
  }

  img.thumbnail:hover {
    border: 1px solid #356dc9;
  }

  .md-empty-state {
    background-color: #356dc9 !important;
  }
</style>
