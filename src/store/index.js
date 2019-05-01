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
      // let t = Date.now();
      let savedState = localStorage.getItem('state');

      if( savedState ) {
        savedState = JSON.parse( savedState );
        const mergedState = Object.assign( {}, state, savedState );
        // console.log(`load + parse + global merge: ${Date.now()-t} ms`); t = Date.now();

        /* crazy CPU load! */
        // Object.assign( state.items.gearItems, savedState.items.gearItems );

        /* add newly generated items */
        for( const gearItemID in state.items.gearItems ) {
          if( savedState.items.gearItems[gearItemID] ) continue;
          savedState.items.gearItems[gearItemID] = state.items.gearItems[gearItemID];
        }

        // console.log(`gearItems merge: ${Date.now()-t} ms`); t = Date.now();
        Object.assign( state.items.maidensGear, savedState.items.maidensGear );
        // console.log(`maidensGear merge: ${Date.now()-t} ms`); t = Date.now();

        // console.log(`fine grained merge: ${Date.now()-t} ms`); t = Date.now();
        this.replaceState(mergedState);
        // console.log(`replace state: ${Date.now()-t} ms`);
      }
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
