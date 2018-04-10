<template>
  <div id="wrapper">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
        <md-button class="md-icon-button" @click="importImages()">
          <md-icon>add_a_photo</md-icon>
          <md-tooltip md-direction="bottom">Import Images</md-tooltip>
        </md-button>
        <md-button class="md-icon-button" @click="importImagesFolder()">
          <md-icon>add_to_photos</md-icon>
          <md-tooltip md-direction="bottom">Import All Images Under Folder</md-tooltip>
        </md-button>
        <span class="md-title">My Title</span>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible" md-elevation="0">
        <md-list>
          <md-list-item>
            <md-button>
              <md-icon>move_to_inbox</md-icon>
              <span class="md-list-item-text">Inbox</span>
            </md-button>
          </md-list-item>

          <md-list-item>
            <md-icon>send</md-icon>
            <span class="md-list-item-text">Sent Mail</span>
          </md-list-item>

          <md-list-item>
            <md-icon>delete</md-icon>
            <span class="md-list-item-text">Trash</span>
          </md-list-item>

          <md-list-item>
            <md-icon>error</md-icon>
            <span class="md-list-item-text">Spam</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content class="md-layout md-gutter md-alignment-center">
        <md-card md-with-hover class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <md-card-media-actions>
            <md-card-media md-ratio="1:1">
              <img src="~@/assets/logo.png" alt="Skyscraper">
            </md-card-media>
            <md-card-actions>
              <md-button class="md-icon-button">
                <md-icon>favorite</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>bookmark</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>share</md-icon>
              </md-button>
            </md-card-actions>
          </md-card-media-actions>
        </md-card>
        <md-card md-with-hover class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <md-card-media-actions>
            <md-card-media md-ratio="1:1">
              <img src="~@/assets/logo.png" alt="Skyscraper">
            </md-card-media>
            <md-card-actions>
              <md-button class="md-icon-button">
                <md-icon>favorite</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>bookmark</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>share</md-icon>
              </md-button>
            </md-card-actions>
          </md-card-media-actions>
        </md-card>
        <md-card md-with-hover class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <md-card-media-actions>
            <md-card-media md-ratio="1:1">
              <img src="~@/assets/logo.png" alt="Skyscraper">
            </md-card-media>
            <md-card-actions>
              <md-button class="md-icon-button">
                <md-icon>favorite</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>bookmark</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>share</md-icon>
              </md-button>
            </md-card-actions>
          </md-card-media-actions>
        </md-card>
        <md-card md-with-hover class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <md-card-media-actions>
            <md-card-media md-ratio="1:1">
              <img src="~@/assets/logo.png" alt="Skyscraper">
            </md-card-media>
            <md-card-actions>
              <md-button class="md-icon-button">
                <md-icon>favorite</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>bookmark</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>share</md-icon>
              </md-button>
            </md-card-actions>
          </md-card-media-actions>
        </md-card>
        <md-card md-with-hover class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <md-card-media-actions>
            <md-card-media md-ratio="1:1">
              <img src="~@/assets/logo.png" alt="Skyscraper">
            </md-card-media>
            <md-card-actions>
              <md-button class="md-icon-button">
                <md-icon>favorite</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>bookmark</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>share</md-icon>
              </md-button>
            </md-card-actions>
          </md-card-media-actions>
        </md-card>
        <md-card md-with-hover class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <md-card-media-actions>
            <md-card-media md-ratio="1:1">
              <img src="~@/assets/logo.png" alt="Skyscraper">
            </md-card-media>
            <md-card-actions>
              <md-button class="md-icon-button">
                <md-icon>favorite</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>bookmark</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>share</md-icon>
              </md-button>
            </md-card-actions>
          </md-card-media-actions>
        </md-card>
        <md-card md-with-hover class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <md-card-media-actions>
            <md-card-media md-ratio="1:1">
              <img src="~@/assets/logo.png" alt="Skyscraper">
            </md-card-media>
            <md-card-actions>
              <md-button class="md-icon-button">
                <md-icon>favorite</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>bookmark</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>share</md-icon>
              </md-button>
            </md-card-actions>
          </md-card-media-actions>
        </md-card>
        <md-card md-with-hover class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <md-card-media-actions>
            <md-card-media md-ratio="1:1">
              <img src="~@/assets/logo.png" alt="Skyscraper">
            </md-card-media>
            <md-card-actions>
              <md-button class="md-icon-button">
                <md-icon>favorite</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>bookmark</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>share</md-icon>
              </md-button>
            </md-card-actions>
          </md-card-media-actions>
        </md-card>
        <md-card md-with-hover class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <md-card-media-actions>
            <md-card-media md-ratio="1:1">
              <img src="~@/assets/logo.png" alt="Skyscraper">
            </md-card-media>
            <md-card-actions>
              <md-button class="md-icon-button">
                <md-icon>favorite</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>bookmark</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>share</md-icon>
              </md-button>
            </md-card-actions>
          </md-card-media-actions>
        </md-card>
        <md-card md-with-hover class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <md-card-media-actions>
            <md-card-media md-ratio="1:1">
              <img src="~@/assets/logo.png" alt="Skyscraper">
            </md-card-media>
            <md-card-actions>
              <md-button class="md-icon-button">
                <md-icon>favorite</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>bookmark</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>share</md-icon>
              </md-button>
            </md-card-actions>
          </md-card-media-actions>
        </md-card>
        <md-card md-with-hover class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <md-card-media-actions>
            <md-card-media md-ratio="1:1">
              <img src="~@/assets/logo.png" alt="Skyscraper">
            </md-card-media>
            <md-card-actions>
              <md-button class="md-icon-button">
                <md-icon>favorite</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>bookmark</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>share</md-icon>
              </md-button>
            </md-card-actions>
          </md-card-media-actions>
        </md-card>
        <md-card md-with-hover class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <md-card-media-actions>
            <md-card-media md-ratio="1:1">
              <img src="~@/assets/logo.png" alt="Skyscraper">
            </md-card-media>
            <md-card-actions>
              <md-button class="md-icon-button">
                <md-icon>favorite</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>bookmark</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>share</md-icon>
              </md-button>
            </md-card-actions>
          </md-card-media-actions>
        </md-card>
        <md-card md-with-hover class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <md-card-media-actions>
            <md-card-media md-ratio="1:1">
              <img src="~@/assets/logo.png" alt="Skyscraper">
            </md-card-media>
            <md-card-actions>
              <md-button class="md-icon-button">
                <md-icon>favorite</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>bookmark</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>share</md-icon>
              </md-button>
            </md-card-actions>
          </md-card-media-actions>
        </md-card>
        <md-card md-with-hover class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <md-card-media-actions>
            <md-card-media md-ratio="1:1">
              <img src="~@/assets/logo.png" alt="Skyscraper">
            </md-card-media>
            <md-card-actions>
              <md-button class="md-icon-button">
                <md-icon>favorite</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>bookmark</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>share</md-icon>
              </md-button>
            </md-card-actions>
          </md-card-media-actions>
        </md-card>
        <md-card md-with-hover class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <md-card-media-actions>
            <md-card-media md-ratio="1:1">
              <img src="~@/assets/logo.png" alt="Skyscraper">
            </md-card-media>
            <md-card-actions>
              <md-button class="md-icon-button">
                <md-icon>favorite</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>bookmark</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>share</md-icon>
              </md-button>
            </md-card-actions>
          </md-card-media-actions>
        </md-card>
        <md-card md-with-hover class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <md-card-media-actions>
            <md-card-media md-ratio="1:1">
              <img src="~@/assets/logo.png" alt="Skyscraper">
            </md-card-media>
            <md-card-actions>
              <md-button class="md-icon-button">
                <md-icon>favorite</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>bookmark</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>share</md-icon>
              </md-button>
            </md-card-actions>
          </md-card-media-actions>
        </md-card>
        <md-card md-with-hover class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <md-card-media-actions>
            <md-card-media md-ratio="1:1">
              <img src="~@/assets/logo.png" alt="Skyscraper">
            </md-card-media>
            <md-card-actions>
              <md-button class="md-icon-button">
                <md-icon>favorite</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>bookmark</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>share</md-icon>
              </md-button>
            </md-card-actions>
          </md-card-media-actions>
        </md-card>
        <md-card md-with-hover class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <md-card-media-actions>
            <md-card-media md-ratio="1:1">
              <img src="~@/assets/logo.png" alt="Skyscraper">
            </md-card-media>
            <md-card-actions>
              <md-button class="md-icon-button">
                <md-icon>favorite</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>bookmark</md-icon>
              </md-button>

              <md-button class="md-icon-button">
                <md-icon>share</md-icon>
              </md-button>
            </md-card-actions>
          </md-card-media-actions>
        </md-card>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  const { ipcRenderer } = require('electron');//eslint-disable-line

  ipcRenderer.on('images-added', async (evt, data) => {//eslint-disable-line
    console.log('assdfasdf images added and done', this, evt, data);// eslint-disable-line
  });

  export default {
    name: 'landing-page',
    data: () => ({
      menuVisible: false,
    }),
    computed: mapGetters([
      'ImageMetadata/getCount',
    ]),
    methods: {
      imageAdded: () => {
        console.log(this.a.$store);// eslint-disable-line
      },
      importImages: function() {//eslint-disable-line
        console.log(this.$store.getters['ImageMetadata/getCount']);// eslint-disable-line
        ipcRenderer.send('open-file-dialog');
      },
      importImagesFolder: () => {
        ipcRenderer.send('open-folder-dialog');
      },
    },
  };
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic');

  body { font-family: 'Roboto', sans-serif; }

  .md-app {
    max-height: 100vh;
    overflow-x: hidden;
  }

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
</style>
