import Vue from 'vue';
import Vuex from 'vuex';
import heroes from './modules/heroes';
import maps from './modules/maps';
import items from './modules/items';

Vue.use(Vuex);

export default new Vuex.Store({

  modules: {
    heroes,
    maps,
    items,
  },

  state: {
    hoveredItem: {},
    itemTooltip: null,
    maidensGear: {},
  },

  mutations: {
    initMaidenGear (state, payload) {
      Vue.set( state.maidensGear, payload, { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null } );
    },
    /** id, slot, item */
    equipItem( state, payload ) {
      Vue.set( state.maidensGear[payload.id], payload.slot, payload.item );
    },

    setItemTooltipRef (state, payload) {
      state.itemTooltip = payload;
    },
    hoverItem (state, payload) {
      state.hoveredItem = payload;
    },

    loadStore(state) {
      if(localStorage.getItem('heroFilters')) {
        Object.assign( state.heroes.filters, JSON.parse(localStorage.getItem('heroFilters')) );
        this.replaceState( state )
      }
    },
    watchStore(state) {
      // Subscribe to store updates
      this.subscribe((mutation, state) => {
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
