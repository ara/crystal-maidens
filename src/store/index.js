import Vue from 'vue';
import Vuex from 'vuex';
import maps from './modules/maps';


Vue.use(Vuex);

export default new Vuex.Store({

  modules: {
    maps,
  },

  strict: process.env.NODE_ENV !== 'production',

})
