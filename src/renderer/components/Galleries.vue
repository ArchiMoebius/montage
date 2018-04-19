<template>
  <div style="margin:10px;" v-if="loaded">
    <md-card
      v-if="galleries && galleries.length > 0"
      md-with-hover
      class="md-layout-item md-medium-size-30 md-small-size-48 md-xsmall-size-100"
      v-for="gallery in galleries"
      :key="gallery.id"
    >
      <md-card-media-actions>
        <md-card-media md-ratio="1:1">
          <img :src="gallery.thumbnail" :alt="gallery.title" @click="viewGallery( gallery )">
        </md-card-media>
        <md-card-actions>
          <md-button class="md-icon-button" @click="deleteGallery( gallery )">
            <md-icon>delete</md-icon>
            <md-tooltip>Delete Gallery</md-tooltip>
          </md-button>
        </md-card-actions>
      </md-card-media-actions>
    </md-card>
    <div style="width:100vw;height:90vh;" class="md-layout md-gutter md-alignment-center">
      <md-empty-state
        v-if="!galleries || galleries.length <= 0"
        md-rounded
        md-icon="gradient"
        md-label="No galleries found"
        md-description="Create a gallery and add some photo's to get started!">
      </md-empty-state>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  import { EventBus } from '../store/EventBus';

  const { remote } = require('electron');//eslint-disable-line

  export default {
    name: 'galleries',
    data: () => ({
      loaded: false
    }),
    computed: {
      ...mapGetters({
        galleries: 'ImageGallery/galleries'
      })
    },
    methods: {
      ...mapActions([
        'ImageGallery/loadGalleries',
        'ImageGallery/deleteGallery'
      ]),
      async deleteGallery(gallery) {
        const deleteGallery = remote.dialog.showMessageBox(
          remote.getCurrentWindow(),
          {
            title: 'Delete Gallery?',
            type: 'question',
            message: `Are you sure you want to delete ${gallery.title}?`,
            buttons: [
              'No',
              'Yes'
            ]
          }
        );

        if (deleteGallery) {
          await this.$store.dispatch('ImageGallery/deleteGallery', gallery.id);
          this.$router.push({ path: '/galleries' });
        }
      },
      viewGallery(gallery) {
        this.$router.push({ path: `/gallery/${gallery.id}` });
      },
      editGallery: (image) => {
        console.log(image);//eslint-disable-line
      },
      async loadGalleries() {//eslint-disable-line
        await this.$store.dispatch('ImageGallery/loadGalleries');
        this.loaded = true;
      }
    },
    mounted() {
      EventBus.$on('delete-gallery', this.deleteGallery);
    },
    beforeDestroy() {
      this.loaded = false;
    },
    beforeMount() {//eslint-disable-line
      this.loadGalleries();
    }
  };
</script>

<style>
  .md-card {
    height: auto;
    width: 180px;
    min-width: 120px;
    max-width: 240px;
    min-height: 120px;
    margin: 0px 5px 5px 0px !important;
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
