import Vue from 'vue';
import Vuex from 'vuex';
import heroes from './modules/heroes';
import maps from './modules/maps';


Vue.use(Vuex);

export default new Vuex.Store({

  modules: {
    heroes,
    maps,
  },

  strict: process.env.NODE_ENV !== 'production',

})
