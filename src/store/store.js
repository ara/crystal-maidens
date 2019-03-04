import Vue from 'vue';
import Vuex from 'vuex';
import mMaps from './modules/maps';
import { vip } from '../maps';


Vue.use(Vuex);


export const store = new Vuex.Store({
  modules: {
    mMaps,
  },
  state: {
    vip,
    filters: [],
    maxEntries: 20,
  },
  getters: {
    lastPage (state, getters) {
      return Math.ceil( state.filteredMapsCount / state.maxEntries );
    },
  },
  mutations: {
    updateMaxEntries (state, val) {
      state.maxEntries = val;
    },
    updateCurrPage (state, val) {
      state.currPage = Math.min(
        Math.max( val, 1 ),
        this.getters.lastPage );
    },
    columnClicked (state, args) {
      const [col, event] = args;
      if( event.ctrlKey && col !== state.sortedCol1 ) {
        state.sortedCol2 = col;
        state.sortedCol2Asc = col === state.sortedCol2
          ? !state.sortedCol2Asc
          : false;
      } else if( col === state.sortedCol1 ) {
        state.sortedCol1Asc = !state.sortedCol1Asc;
      } else if( col === state.sortedCol2 ) {
        [state.sortedCol1, state.sortedCol2] = [state.sortedCol2, state.sortedCol1];
        [state.sortedCol1Asc, state.sortedCol2Asc] = [state.sortedCol2Asc, state.sortedCol1Asc];
      } else {
        [state.sortedCol1, state.sortedCol2] = [col, state.sortedCol1];
        [state.sortedCol1Asc, state.sortedCol2Asc] = [false, state.sortedCol1Asc];
      }
    },
  },
  actions: {
    // setFilter: ({ commit, state }, newValue) => {
    //   commit('SET_FILTER', newValue)
    //   console.log('action setFilter:', newValue);
    // },
  },
});
