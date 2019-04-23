import Vue from 'vue';
import Vuex from 'vuex';
import heroes from './modules/heroes';
import maps from './modules/maps';
import items from './modules/items';
import { throws } from 'assert';

Vue.use(Vuex);

export default new Vuex.Store({

  modules: {
    heroes,
    maps,
    items,
  },

  state: {
    hoveredItemID: 0,
    itemTooltip: null,
  },

  mutations: {
    setItemTooltipRef (state, payload) {
      state.itemTooltip = payload;
    },
    hoverItem (state, payload) {
      state.hoveredItemID = payload;
    },

    loadStore(state) {
      const savedState = localStorage.getItem('state');
      if( savedState ) {
        Object.assign( state, JSON.parse( savedState ) );
        this.replaceState(state);
      }
      // if(localStorage.getItem('heroFilters')) {
      //   Object.assign( state.heroes.filters, JSON.parse(localStorage.getItem('heroFilters')) );
      //   this.replaceState( state )
      //   Object.assign( state, JSON.parse(localStorage.getItem('state')) );
      //   this.replaceState(state);
      // }
    },
    watchStore(state) {
      // Subscribe to store updates
      this.subscribe((mutation, state) => {
        localStorage.setItem('state', JSON.stringify(state));
        // switch( mutation.type ) {
        //   case 'updateFilterHeroClass':
        //   case 'updateFilterHeroElement':
        //     localStorage.setItem('heroFilters', JSON.stringify(state.heroes.filters));
        //     break;
      });
    },

  },

  strict: process.env.NODE_ENV !== 'production',

})
