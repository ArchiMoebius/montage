<template>
  <div class="md-layout md-alignment-top-center" id="gallery">
    <div
      v-if="loaded && gallery.images.length > 0"
      class="md-layout-item md-size-10"
      v-for="image, imageIndex in gallery.images"
      :key="image.id"
    >
      <img class="thumbnail" :src="image.thumbnail" :alt="image.alt" @click="viewImage( image, imageIndex )">
    </div>
    <div style="width:100vw;height:90vh;" class="md-layout md-gutter md-alignment-center">
      <md-empty-state
        v-if="loaded && gallery.images.length <= 0"
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
  import { checksumFile, getThumbnailBlob } from '../../utils';

  const { ipcRenderer } = require('electron');//eslint-disable-line

  async function addImageFromFilepath(data) {//eslint-disable-line
    const reader = new FileReader();
    reader.onloadend = function() {//eslint-disable-line
      let image = {//eslint-disable-line
        src: data.filepath,
        type: 0,
        alt: basename(data.filepath),
        thumbnail: reader.result,
        hasBeenExported: 0,
        hash: data.checksum
      };
      console.log(
        'emitting on eventbus',
        {
          image,
          fileCount: data.fileCount,
          galleryId: data.opts.galleryId
        }
      );
      EventBus.$emit(
        'image-added',
        {
          image,
          fileCount: data.fileCount,
          galleryId: data.opts.galleryId
        }
      );
    };
    const thumbnailBlob = await getThumbnailBlob(data.filepath);
    reader.readAsDataURL(thumbnailBlob);
  }

  ipcRenderer.on('images-added', async function(evt, data) {//eslint-disable-line
    addImageFromFilepath(data);
  });

  ipcRenderer.on('add-gallery', async function(evt, data) {//eslint-disable-line
    console.log(data);
    // addImageFromFilepath(data);
  });

  async function addImageFromDragDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const filesToAdd = [];
    const checksums = {};

    for (const f of e.dataTransfer.files) {//eslint-disable-line
      const supportedFileTypes = /(\.jpg|\.jpeg|\.png)$/i;

      if (supportedFileTypes.test(f.path)) {
        const checksum = await checksumFile('md5', f.path);//eslint-disable-line

        if (!checksums[checksum]) {
          checksums[checksum] = true;
          filesToAdd.push({ filepath: f.path, checksum });
        }
      }
    }
    const fileCount = filesToAdd.length;
    filesToAdd.forEach((item) => {
      item.fileCount = fileCount;
      addImageFromFilepath(item);
    });
  }

  export default {
    name: 'gallery',
    data: () => ({
      loaded: false,
      progressImportingImages: 0,
      imagesImported: 0
    }),
    computed: {
      ...mapGetters({
        gallery: 'ImageGallery/gallery'
      })
    },
    methods: {
      ...mapActions([
        'ImageGallery/loadGallery'
      ]),
      viewImage: (image, index) => {
        image.index = index;
        EventBus.$emit('show-image', image);
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
        this.loaded = true;
      }
    },
    mounted() {//eslint-disable-line
      this.loadGallery();
      const gallery = document.getElementById('gallery');

      gallery.addEventListener('drop', addImageFromDragDrop);
      gallery.addEventListener('dragover', function (e) {//eslint-disable-line
        e.preventDefault();
        e.stopPropagation();
      });
    },
    created() {
      EventBus.$off('load-next-image', this.showNextImage);
      EventBus.$off('load-prev-image', this.showPrevImage);
      this.loaded = false;
    },
    beforeDestroy() {
      EventBus.$off('load-next-image', this.showNextImage);
      EventBus.$off('load-prev-image', this.showPrevImage);
      this.loaded = false;
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
