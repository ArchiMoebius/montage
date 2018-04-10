const state = {
  main: 0,
};

const mutations = {
  DECREMENT_MAIN_COUNTER(state) {
    state.main -= 1;
  },
  INCREMENT_MAIN_COUNTER(state) {
    state.main += 1;
  },
};

const getters = {
  getCount(state) {
    return state.main;
  },
};

const setters = {
  getCount(state) {
    return state.main;
  },
};

const actions = {
  someAsyncTask({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER');
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
  setters,
};
