<template>
<md-dialog :md-active.sync="showDialog" style="width:40%;">
  <form novalidate>
    <md-dialog-title>Gallery: Import Images</md-dialog-title>
    <md-card class="md-layout-item md-size-100">
      <md-card-content>
        <div class="md-layout md-gutter" style="height:100%;width:98%;min-height:200px;">
          <div class="md-layout-item md-size-85">
            <md-field :class="getValidationClass('imageSource')">
              <label for="imageSource">Image Source</label>
              <md-select v-model="form.imageSource" name="imageSource" id="imageSource" :disabled="sending">
                <md-option value="0">Filesystem: Folder</md-option>
                <md-option value="1">Filesystem: File</md-option>
                <md-option v-if="!form.groupImagesByDatetime" value="2">Filesystem: Each sub-directory as new gallery</md-option>
              </md-select>
              <span class="md-error" v-if="!$v.form.imageSource.required">The Image Source is required</span>
            </md-field>
          </div>
          <div class="md-layout-item md-size-90" v-if="!withinGallery && form.imageSource !== '2' && !form.groupImagesByDatetime">
            <div>
              <md-field :class="getValidationClass('title')">
                <label for="title">Title</label>
                <md-input name="title" id="title" autocomplete="title" v-model="form.title" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.title.isNotAMassImportAndNotInGallery">The title is required</span>
                <span class="md-error" v-else-if="!$v.form.title.minLength">Invalid title, more than 8 characters required</span>
                <span class="md-error" v-else-if="!$v.form.title.maxLength">Invalid title, less than 64 characters required</span>
              </md-field>
            </div>
            <div>
              <md-field :class="getValidationClass('tags')">
                <md-chips v-model="form.tags" md-placeholder="Type and press enter to add a tag!"></md-chips>
                <span class="md-error" v-if="!$v.form.tags.isNotAMassImportAndNotInGallery">Atleast one tag is required</span>
              </md-field>
            </div>
          </div>
          <div v-if="form.groupImagesByDatetime" style="width:100%;padding:20px;">
            <md-field :class="getValidationClass('imageGroupingDays')">
             <label>Days</label>
             <md-input v-model="form.imageGroupingDays" type="number"></md-input>
             <span class="md-error" v-if="$v.form.imageGroupingDays.isRequired && !$v.form.imageGroupingDays.noLessThanOne">More than zero days is required</span>
             <span class="md-error" v-if="!$v.form.imageGroupingDays.isRequired">Atleast one day must be defined</span>
           </md-field>
           <md-field>
             <label for="imageGroupingDate">Image Grouping Date</label>
             <md-select v-model="form.imageGroupingDate" name="imageGroupingDate" id="imageGroupingDate" :disabled="sending">
               <md-option value="0">Filesystem: Modified datetime</md-option>
               <md-option value="1">Filesystem: Accessed datetime</md-option>
               <md-option value="2">Filesystem: Created datetime</md-option>
               <md-option value="3">EXIF: Created datetime</md-option>
             </md-select>
           </md-field>
          </div>
          <div v-if="form.filterImages" style="width:90%;padding:20px;">
            <div class="md-layout-item md-size-40" style="float:left;">
              <md-field :class="getValidationClass('startDate')">
                <label for="startDate">Start Date</label>
                <md-datepicker v-model="form.startDate" :disabled="sending" name="startDate" />
                <span class="md-error" v-if="$v.form.startDate.isRequired && !$v.form.startDate.maxValue">Must be less than end date</span>
                <span class="md-error" v-if="!$v.form.startDate.isRequired">Start date must be defined</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-50" style="float:left;margin-left: 20px;">
              <md-field :class="getValidationClass('startDateFilter')">
                <label for="startDateFilter">Start Date Filter</label>
                <md-select v-model="form.startDateFilter" name="startDateFilter" id="startDateFilter" :disabled="sending">
                  <md-option value="0">Filesystem: Modified datetime</md-option>
                  <md-option value="1">Filesystem: Accessed datetime</md-option>
                  <md-option value="2">Filesystem: Created datetime</md-option>
                  <md-option value="3">EXIF: Created datetime</md-option>
                </md-select>
              </md-field>
            </div>
            <div class="md-layout-item md-size-40" style="float:left;clear:left;">
              <md-field :class="getValidationClass('endDate')">
                <label for="endDate">End Date</label>
                <md-datepicker v-model="form.endDate" :disabled="sending" name="endDate" id="endDate"/>
                <span class="md-error" v-if="$v.form.endDate.isRequired && !$v.form.endDate.minValue">Must be greater than start date</span>
                <span class="md-error" v-if="!$v.form.endDate.isRequired">End date must be defined</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-50" style="float:left;margin-left: 20px;">
              <md-field :class="getValidationClass('endDateFilter')">
                <label for="endDateFilter">Start Date Filter</label>
                <md-select v-model="form.endDateFilter" name="endDateFilter" id="endDateFilter" :disabled="sending">
                  <md-option value="0">Filesystem: Modified datetime</md-option>
                  <md-option value="1">Filesystem: Accessed datetime</md-option>
                  <md-option value="2">Filesystem: Created datetime</md-option>
                  <md-option value="3">EXIF: Created datetime</md-option>
                </md-select>
              </md-field>
            </div>
          </div>
          <div class="md-layout-item md-size-40" style="float:left;">
            <input type="checkbox" v-model="form.importExif" :disabled="sending" name="importExif" value="1">Import Metadata (EXIF)</input>
            <md-tooltip>Import JPEG/JPG EXIF metadata into the database for analysis</md-tooltip>
          </div>
          <div class="md-layout-item md-size-40" style="float:left;" v-if="!form.groupImagesByDatetime">
            <input type="checkbox" v-model="form.filterImages" :disabled="sending" name="filterImages" value="0">Filter Images by datetime</input>
            <md-tooltip>Remove images that do not fall within the selected date range</md-tooltip>
          </div>
          <div class="md-layout-item md-size-40" style="float:left;" v-if="!form.filterImages">
            <input type="checkbox" v-model="form.groupImagesByDatetime" :disabled="sending" name="groupImagesByDatetime" value="0">Group Images by datetime</input>
            <md-tooltip>Group images that appear within the selected days of each other into their own gallery</md-tooltip>
          </div>
        </div>
      </md-card-content>
      <md-progress-bar md-mode="indeterminate" v-if="sending" />
    </md-card>
    <md-dialog-actions style="width:100%;display:block:margin:0px;padding:5px;">
      <md-button class="md-accent" @click="showDialog = false" style="float:left;">Close</md-button>
      <md-button class="md-primary" @click="validateForm()" style="float:right;" :disabled="sending">Import</md-button>
    </md-dialog-actions>
  </form>
</md-dialog>
</template>

<script>
/*
 TODO:
  1. Update nav bar to include import images as an option
  2. Add checkbox and input fields for new gallery creation
     upon import (create new gallery?, if true then collect title and tags
     create gallery, get id, pass to importfunc in main etc....)
*/
import { mapActions } from 'vuex';

import { validationMixin } from 'vuelidate';

import {
  minLength,
  maxLength,
  minValue,
  maxValue,
  required
} from 'vuelidate/lib/validators';

import { EventBus } from '../store/EventBus';

const { ipcRenderer } = require('electron');//eslint-disable-line
const logger = require('electron-log');

export default {
  name: 'import-images-dialog',
  mixins: [validationMixin],
  created: function() { //eslint-disable-line
    EventBus.$on('import-images', this.importImages);
  },
  data: () => ({
    form: {
      galleryId: false,
      imageSource: '0',
      startDate: null,
      startDateFilter: '0',
      title: '',
      tags: [],
      endDate: null,
      endDateFilter: '0',
      importExif: true,
      filterImages: false,
      groupImagesByDatetime: false,
      imageGroupingDate: '0',
      imageGroupingDays: 3
    },
    sending: false,
    withinGallery: false,
    showDialog: false
  }),
  validations() { //eslint-disable-line
    return {
      form: {
        imageSource: {
          required
        },
        title: {
          minLength: minLength(8),
          maxLength: maxLength(64),
          isNotAMassImportAndNotInGallery() {
            let state = true;

            if (
              !this.$data.withinGallery &&
              this.form.imageSource !== '2' &&
              !this.form.groupImagesByDatetime
            ) {
              if (this.form.title.length <= 0) {
                state = false;
              }
            }

            return state;
          }
        },
        tags: {
          isNotAMassImportAndNotInGallery() {
            let state = true;

            if (
              !this.$data.withinGallery &&
              this.form.imageSource !== '2' &&
              !this.form.groupImagesByDatetime
            ) {
              if (this.form.tags.length <= 0) {
                state = false;
              }
            }

            return state;
          }
        },
        startDate: {
          maxValue: maxValue(this.form.endDate),
          isRequired() {
            let state = true;

            if (this.form.filterImages) {
              if (!this.form.endDate) {
                state = false;
              }
            }
            return state;
          }
        },
        endDate: {
          minValue: minValue(this.form.startDate),
          isRequired() {
            let state = true;

            if (this.form.filterImages) {
              if (!this.form.startDate) {
                state = false;
              }
            }
            return state;
          }
        },
        imageGroupingDays: {
          noLessThanOne() {
            let state = true;

            if (this.form.groupImagesByDatetime) {
              if (this.form.imageGroupingDays < 1) {
                state = false;
              }
            }
            return state;
          },
          isRequired() {
            let state = true;

            if (this.form.groupImagesByDatetime) {
              if (!this.form.imageGroupingDays) {
                state = false;
              }
            }

            if (
              this.form.imageSource === '2' &&
              this.form.groupImagesByDatetime
            ) {
              this.form.imageSource = '0';
            }
            return state;
          }
        }
      }
    };
  },
  methods: {
    ...mapActions([
      'ImageGallery/addGallery'
    ]),
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        };
      }
      return '';
    },
    async saveForm() {
      this.sending = true;
      if (
        !this.$data.withinGallery &&
        this.form.imageSource !== '2' &&
        !this.form.groupImagesByDatetime
      ) {
        try {
          const ret = await this.$store.dispatch(
            'ImageGallery/addGallery',
            {
              title: this.form.title,
              tags: this.form.tags
            }
          );
          this.form.galleryId = ret;
        } catch (e) {
          logger.error(e);
        }
      } else {
        this.form.galleryId = this.$route.params.id;
      }

      try {
        ipcRenderer.send('import-images-dialog', this.form);
        this.showDialog = false;
        this.$v.$reset();
      } catch (e) {
        new Notification({//eslint-disable-line
          title: 'error',
          body: 'Unable to import images into gallery'
        });
      }
      this.sending = false;
    },
    validateForm() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveForm();
      }
    },
    importImages: function() { //eslint-disable-line
      this.$data.showDialog = true;
      this.$data.withinGallery = !isNaN(parseInt(this.$route.params.id, 10));//eslint-disable-line
    }
  },
  beforeDestroy() {
    EventBus.$off('import-images', this.importImages);
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic');

body {
  font-family: 'Roboto', sans-serif;
}

.md-menu-content {
  z-index: 9999 !important;
}

.md-field label {
  top: 0px !important;
  font-size: 12px !important;
}

.md-field {
  padding-top: 8px !important;
}

.md-field>.md-icon {
  position: absolute !important;
  top: 0px;
}

.md-field.md-clearable .md-input {
  padding-left: 12px;
}

.md-select {
  padding-top: 0px;
}

.md-select > input {
  margin-top: 20px !important;
}
</style>
