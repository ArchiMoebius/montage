<template>
  <div style="margin:10px;">
    <md-card
      v-if="gallery.images.length > 0"
      md-with-hover
      class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100"
      v-for="image in gallery.images"
      :key="image.id"
    >
      <md-card-media-actions>
        <md-card-media md-ratio="1:1">
          <img :src="image.thumbnail" :alt="image.alt" @click="viewImage( image )">
        </md-card-media>
        <md-card-actions>
          <md-button class="md-icon-button" @click="deleteImage( image )">
            <md-icon>delete</md-icon>
            <md-tooltip>Delete Image</md-tooltip>
          </md-button>
        </md-card-actions>
      </md-card-media-actions>
    </md-card>
    <div style="width:100vw;height:90vh;" class="md-layout md-gutter md-alignment-center">
      <md-empty-state
        v-if="gallery.images.length <= 0"
        md-rounded
        md-icon="add_a_photo"
        md-label="Gallery is empty..."
        md-description="Add some photo's to get started!">
      </md-empty-state>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { EventBus } from '../store/EventBus';
  const sharp = require('sharp');

  const { ipcRenderer } = require('electron');//eslint-disable-line

  ipcRenderer.on('images-added', async function(evt, filepath) {//eslint-disable-line
    const reader = new FileReader();
    reader.onloadend = function() {//eslint-disable-line
      let image = {//eslint-disable-line
        src: filepath,
        thumbnail: reader.result,
        hasBeenDeleted: 0,
        hasBeenExported: 0
      };
      EventBus.$emit('image-added', image);
    };

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
    reader.readAsDataURL(thumbnailBlob);
  });

  export default {
    name: 'gallery',
    data: () => ({
    }),
    computed: {
      ...mapGetters({
        gallery: 'ImageGallery/gallery'
      })
    },
    methods: {
      ...mapActions([
        'ImageGallery/loadGallery',
        'ImageGallery/addImage'
      ]),
      deleteImage: (image) => {
        console.log(image);//eslint-disable-line
      },
      viewImage: (image) => {
        console.log(image);//eslint-disable-line
      },
      async imageAdded(image) {
        await this.$store.dispatch(
          'ImageGallery/addImage',
          {
            galleryId: parseInt(this.$route.params.id, 10),
            image
          }
        );
      },
      importImages() {
        ipcRenderer.send('open-file-dialog');
      },
      importImagesFolder: () => {
        ipcRenderer.send('open-folder-dialog');
      },
      async loadGallery() {
        await this.$store.dispatch('ImageGallery/loadGallery', parseInt(this.$route.params.id, 10));
        EventBus.$emit('view-gallery', this.gallery);
      }
    },
    mounted: function() {//eslint-disable-line
      this.loadGallery();
      EventBus.$on('image-added', this.imageAdded);
    }
  };
</script>

<style>
  .md-card {
    min-width: 180px;
    width: 180px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }

  .md-card-area {
    max-height: 100px;
  }

  .md-card-actions {
    padding: 5px 5px 5px 0px;
    margin:0px;
    height: 100%;
  }

  .md-card-media-actions {
    padding: 0px !important;
  }

  .md-card-media {
    margin: 5px 0px 5px 5px;
  }

  .md-content {
    width: 100%;
    height: 93vh;
  }
</style>
