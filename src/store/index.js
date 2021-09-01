import { createStore } from 'vuex';

// Create a new store instance.
const store = createStore({
  state() {
    return {
      // user: null,
      user: JSON.parse(sessionStorage.getItem('user'))
    };
  },
  mutations: {
    UPDATE_USER(state, user) {
      console.log('====update user',user);
      state.user = user;
      sessionStorage.setItem('user', JSON.stringify(user));
    },
  },
  actions: {
    updateUser({ commit }, user) {
      commit('UPDATE_USER', user);
    },
  },
});

export default store;
