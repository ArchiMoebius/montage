<template>
  <md-dialog :md-active.sync="showDialog" style="width:40%;">
    <form novalidate class="md-layout">
      <md-dialog-title>Create New Gallery</md-dialog-title>
      <md-card class="md-layout-item md-size-100">
        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-90">
              <md-field :class="getValidationClass('title')">
                <label for="title">Title</label>
                <md-input name="title" id="title" autocomplete="title" v-model="form.title" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.title.required">The title is required</span>
                <span class="md-error" v-else-if="!$v.form.title.minLength">Invalid title, more than 8 characters required</span>
                <span class="md-error" v-else-if="!$v.form.title.maxLength">Invalid title, less than 64 characters required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-40">
              <md-field :class="getValidationClass('startDate')">
                <label for="title">Start Date</label>
                <md-datepicker v-model="form.startDate" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.startDate.maxValue && $v.form.startDate.requiredIf">The start date must be less than the end date</span>
                <span class="md-error" v-if="!$v.form.startDate.requiredIf && !$v.form.startDate.maxValue">The start date must be defined if the end date is defined</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-40">
              <md-field :class="getValidationClass('endDate')">
                <label for="title">End Date</label>
                <md-datepicker v-model="form.endDate" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.endDate.minValue && $v.form.endDate.requiredIf">The end date must be greater than the start date</span>
                <span class="md-error" v-if="!$v.form.endDate.requiredIf && !$v.form.endDate.minValue">The end date must be defined if the start date is defined</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-90">
              <md-field :class="getValidationClass('tags')">
                <md-chips v-model="form.tags" md-placeholder="Type and press enter to add a tag!"></md-chips>
                <span class="md-error" v-if="!$v.form.tags.required">Atleast one tag is required</span>
              </md-field>
            </div>
          </div>
        </md-card-content>
        <md-progress-bar md-mode="indeterminate" v-if="sending" />
      </md-card>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
        <md-button class="md-primary" @click="validateUser" :disabled="sending">Save</md-button>
      </md-dialog-actions>
    </form>
  </md-dialog>
</template>

<script>
import { mapActions } from 'vuex';

import { validationMixin } from 'vuelidate';

import {
  requiredIf,
  minValue,
  maxValue,
  required,
  minLength,
  maxLength
} from 'vuelidate/lib/validators';

import { EventBus } from '../store/EventBus';

export default {
  name: 'create-gallery-dialog',
  mixins: [validationMixin],
  created: function() { //eslint-disable-line
    EventBus.$on('create-gallery', this.createGallery);
  },
  data: () => ({
    form: {
      id: null,
      title: null,
      startDate: null,
      endDate: null,
      isEvent: false,
      tags: []
    },
    sending: false,
    showDialog: false
  }),
  validations () {//eslint-disable-line
    return {
      form: {
        title: {
          required,
          minLength: minLength(8),
          maxLength: maxLength(64)
        },
        startDate: {
          maxValue: maxValue(this.form.endDate),
          requiredIf: requiredIf(this.form.endDate)
        },
        endDate: {
          minValue: minValue(this.form.startDate),
          requiredIf: requiredIf(this.form.startDate)
        },
        tags: {
          required
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
    async saveForm() {
      this.sending = true;
      try {
        if (this.$data.form.id === null) {
          await this.$store.dispatch('ImageGallery/addGallery', this.form);
        } else {
          await this.$store.dispatch('ImageGallery/updateGallery', this.form);
        }
        this.form = {
          id: null,
          title: null,
          startDate: null,
          endDate: null,
          isEvent: false,
          tags: []
        };
        this.showDialog = false;
        this.$v.$reset();
      } catch (e) {
        alert("Unable to save gallery");//eslint-disable-line
      }
      this.sending = false;
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveForm();
      }
    },
    createGallery: function() { //eslint-disable-line
      this.$data.showDialog = true;
    }
  },
  beforeDestroy() {
    EventBus.$off('create-gallery', this.createGallery);
  }
};
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic');

  body {
    font-family: 'Roboto', sans-serif;
  }
</style>
