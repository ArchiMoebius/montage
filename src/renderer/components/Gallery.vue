<template>
  <div class="md-layout md-alignment-top-center" id="gallery">
    <div
      v-if="gallery.images.length > 0"
      class="md-layout-item md-size-10"
      v-for="image, imageIndex in gallery.images"
      :key="image.id"
    >
      <img class="thumbnail" :src="image.thumbnail" :alt="image.alt" @click="viewImage( image, imageIndex )">
    </div>
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
  import { basename } from 'path';

  import { EventBus } from '../store/EventBus';

  const sharp = require('sharp');

  const { ipcRenderer } = require('electron');//eslint-disable-line

  async function addImageFromFilepath(filepath) {//eslint-disable-line
    const reader = new FileReader();
    reader.onloadend = function() {//eslint-disable-line
      let image = {//eslint-disable-line
        src: filepath,
        type: 0,
        alt: basename(filepath),
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
  }

  ipcRenderer.on('images-added', async function(evt, filepath) {//eslint-disable-line
    addImageFromFilepath(filepath);
  });

  function addImageFromDragDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    for (const f of e.dataTransfer.files) {//eslint-disable-line
      const supportedFileTypes = /(\.jpg|\.jpeg|\.png)$/i;

      if (supportedFileTypes.test(f.path)) {
        addImageFromFilepath(f.path);
      }
    }
  }

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
        'ImageGallery/addImage',
        'ImageGallery/deleteImage'
      ]),
      async deleteImage(image) {
        await this.$store.dispatch('ImageGallery/deleteImage', image.id);
      },
      viewImage: (image, index) => {
        image.index = index;
        EventBus.$emit('show-image', image);
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
      showPrevImage(currentImageIndex) {
        if (currentImageIndex > 0) {
          const image = this.gallery.images[currentImageIndex - 1];
          image.index = currentImageIndex - 1;
          EventBus.$emit('show-image', image);
        } else {
          const image = this.gallery.images[this.gallery.images.length - 1];
          image.index = this.gallery.images.length - 1;
          EventBus.$emit('show-image', image);
        }
      },
      showNextImage(currentImageIndex) {
        if (currentImageIndex < this.gallery.images.length - 1) {
          const image = this.gallery.images[currentImageIndex + 1];
          image.index = currentImageIndex + 1;
          EventBus.$emit('show-image', image);
        } else {
          const image = this.gallery.images[0];
          image.index = 0;
          EventBus.$emit('show-image', image);
        }
      },
      async loadGallery() {
        await this.$store.dispatch('ImageGallery/loadGallery', parseInt(this.$route.params.id, 10));
        EventBus.$emit('view-gallery', this.gallery);
      }
    },
    mounted() {//eslint-disable-line
      this.loadGallery();
      EventBus.$on('image-added', this.imageAdded);
      EventBus.$on('load-next-image', this.showNextImage);
      EventBus.$on('load-prev-image', this.showPrevImage);
      const gallery = document.getElementById('gallery');

      gallery.addEventListener('drop', addImageFromDragDrop);
      gallery.addEventListener('dragover', function (e) {//eslint-disable-line
        e.preventDefault();
        e.stopPropagation();
      });
    },
    beforeDestroy() {
      EventBus.$off('image-added', this.imageAdded);
      EventBus.$off('load-next-image', this.showNextImage);
      EventBus.$off('load-prev-image', this.showPrevImage);
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
