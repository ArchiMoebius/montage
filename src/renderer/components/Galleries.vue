<template>
  <div style="margin:10px;">
    <md-card
      v-if="galleries.length > 0"
      md-with-hover
      class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100"
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
        v-if="galleries.length <= 0"
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

  export default {
    name: 'galleries',
    data: () => ({
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
      async deleteGallery(gallery) {//eslint-disable-line
        await this.$store.dispatch('ImageGallery/deleteGallery', gallery.id);
      },
      viewGallery(gallery) {
        this.$router.push({ path: `/gallery/${gallery.id}` });
      },
      editGallery: (image) => {
        console.log(image);//eslint-disable-line
      },
      loadGalleries() {//eslint-disable-line
        this.$store.dispatch('ImageGallery/loadGalleries');
      }
    },
    beforeMount: function() {//eslint-disable-line
      this.loadGalleries();
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
