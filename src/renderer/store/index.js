import Vue from 'vue';
import Vuex from 'vuex';

import modules from './modules';

const Dexie = require('dexie');
const db = new Dexie('MyDatabase');//eslint-disable-line

db.version(1).stores({
  friends: '++id, name, age',
});

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production',
});
