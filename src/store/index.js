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

  mutations: {
    loadStore(state) {
      if(localStorage.getItem('heroFilters')) {
        Object.assign( state.heroes.filters, JSON.parse(localStorage.getItem('heroFilters')) );
        this.replaceState( state )
      }
    },
    watchStore(state) {
      // Subscribe to store updates
      this.subscribe((mutation, state) => {
        console.log(mutation, state);
        switch( mutation.type ) {
          case 'updateFilterHeroClass':
          case 'updateFilterHeroElement':
            localStorage.setItem('heroFilters', JSON.stringify(state.heroes.filters));
            break;
        }
      });
    }
  },

  strict: process.env.NODE_ENV !== 'production',

})
