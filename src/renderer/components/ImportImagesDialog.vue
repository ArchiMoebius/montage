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
                <md-option value="2">Filesystem: Each sub-directory as new gallery</md-option>
              </md-select>
              <span class="md-error" v-if="!$v.form.imageSource.required">The Image Source is required</span>
            </md-field>
          </div>
          <div v-if="form.groupImagesByDatetime" style="width:100%;padding:20px;">
            <md-field>
             <label>Days</label>
             <md-input v-model="form.imageGroupingDays" type="number"></md-input>
           </md-field>
          </div>
          <div v-if="form.filterImages" style="width:90%;padding:20px;">
            <div class="md-layout-item md-size-40" style="float:left;">
              <md-field :class="getValidationClass('startDate')">
                <label for="startDate">Start Date</label>
                <md-datepicker v-model="form.startDate" :disabled="sending" name="startDate" />
                <span class="md-error" v-if="!$v.form.startDate.maxValue && $v.form.startDate.requiredIf">The start date must be less than the end date</span>
                <span class="md-error" v-if="!$v.form.startDate.requiredIf && !$v.form.startDate.maxValue">The start date must be defined if the end date is defined</span>
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
                <span class="md-error" v-if="!$v.form.endDate.minValue && $v.form.endDate.requiredIf">The end date must be greater than the start date</span>
                <span class="md-error" v-if="!$v.form.endDate.requiredIf && !$v.form.endDate.minValue">The end date must be defined if the start date is defined</span>
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
          <div class="md-layout-item md-size-40" style="float:left;">
            <input type="checkbox" v-model="form.filterImages" :disabled="sending || form.groupImagesByDatetime" name="filterImages" value="0">Filter Images by datetime</input>
            <md-tooltip>Remove images that do not fall within the selected date range</md-tooltip>
          </div>
          <div class="md-layout-item md-size-40" style="float:left;">
            <input type="checkbox" v-model="form.groupImagesByDatetime" :disabled="sending || form.filterImages" name="groupImagesByDatetime" value="0">Group Images by datetime</input>
            <md-tooltip>Group images that appear within the selected days of each other into their own gallery</md-tooltip>
          </div>
        </div>
      </md-card-content>
      <md-progress-bar md-mode="indeterminate" v-if="sending" />
    </md-card>
    <md-dialog-actions style="width:100%;display:block:margin:0px;padding:5px;">
      <md-button class="md-accent" @click="showDialog = false" style="float:left;">Close</md-button>
      <md-button class="md-primary" @click="validateForm" style="float:right;" :disabled="sending">Import</md-button>
    </md-dialog-actions>
  </form>
</md-dialog>
</template>

<script>
/*
 TODO:
  1. Update nav bar to include import images as an option
  2. Add checkbox and input fields for new gallery creation upon import (create new gallery?, if true then collect title and tags - create gallery, get id, pass to importfunc in main etc....)
*/
import { mapActions } from 'vuex';

import { validationMixin } from 'vuelidate';

import {
  requiredIf,
  minValue,
  maxValue,
  required
} from 'vuelidate/lib/validators';

import { EventBus } from '../store/EventBus';

const { ipcRenderer } = require('electron');//eslint-disable-line

export default {
  name: 'import-images-dialog',
  mixins: [validationMixin],
  created: function() { //eslint-disable-line
    EventBus.$on('import-images', this.importImages);
  },
  data: () => ({
    form: {
      imageSource: '0',
      startDate: null,
      startDateFilter: '0',
      endDate: null,
      endDateFilter: '0',
      importExif: true,
      filterImages: false,
      groupImagesByDatetime: false,
      imageGroupingDays: 3
    },
    sending: false,
    showDialog: false
  }),
  validations() { //eslint-disable-line
    return {
      form: {
        imageSource: {
          required
        },
        startDate: {
          maxValue: maxValue(this.form.endDate),
          requiredIf: requiredIf(this.form.endDate)
        },
        endDate: {
          minValue: minValue(this.form.startDate),
          requiredIf: requiredIf(this.form.startDate)
        }
      }
    };
  },
  methods: {
    ...mapActions([
      'ImageGallery/addGallery',
      'ImageGallery/updateGallery'
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
    saveForm() {
      this.sending = true;
      try {
        switch (this.form.imageSource) {
          case '0':
          case '1':
          case '2':
            ipcRenderer.send('import-images-dialog', this.form);
            break;
          default:
            break;
        }
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
