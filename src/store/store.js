import Vue from 'vue';
import Vuex from 'vuex';

import { cap, maps, campaigns, vip, sortMapsFunc as sortFunc, filterMapsFunc } from '../maps';

console.log('----------INIT---------')
console.log('campaigns: '+campaigns.length);
for( const m of maps ) {
  if( m.id < 2000 ) {
    m.name = `C${m.campaignID % 1000} ${m.campaignID>1000?'H':'E'} ${m.missionIndex.toString().padStart(2)}`;
  } else {
    m.name = `${m.campaignID}-${m.missionIndex.toString().padStart(2)}`;
  }
}
//const maps = makeMapsByCID()

const fix = n => v => v.toFixed(n);

Vue.use(Vuex);

const mapCols = [
  { col: 'name', name: 'Map \t ' },
  // { col: 'mapType', name: 'Type' }, // 1: boss; 0: artifact
  { col: 'energy', align: 'right' },
  { col: 'fodder', align: 'right', func:fix(2) },
  { col: 'coinsPerEnergy', name: 'Coins/E', align: 'right', func:fix(0) },
  { col: 'maidenXPPerEnergy', name: 'M.XP/E', align: 'right', func:fix(0) },
  { col: 'fodderCoins', name:'Fod/Coins', align: 'right', func:fix(0) },
  { col: 'crystal', align: 'center' },
];
// mapCols.forEach( c => (c.name = c.name ? c.name : cap(c.col)) );
mapCols.forEach( c => (c.name = c.name ? c.name : cap(c.col)) );


export const store = new Vuex.Store({
  state: {
    sortedCol1: 'fodder',
    sortedCol2: 'name',
    sortedCol1Asc: false,
    sortedCol2Asc: false,
    maps,
    mapCols,
    vip,
    filters: [],
    filterCrystal: '',
    filterBossesOnly: false,
    filterCampaign: -1,
    campaigns: campaigns.sort( sortFunc('groupID', true, 'id', true) ),
    currPage: 1,
    filteredMapsCount: 0,
    maxEntries: 20,
  },
  watch: {
    // currPage (val, oldVal) {
    // },
  },
  getters: {
    lastPage (state, getters) {
      return Math.ceil( state.filteredMapsCount / state.maxEntries );
    },
    campaigns (state) {
      return state.campaigns;
    },
    maps (state) {
      let ret = state.maps;
      if( state.filterBossesOnly ) {
        ret = ret.filter( filterMapsFunc('mapType', '=', 1) );
      }
      if( state.filterCrystal ) {
        ret = ret.filter( filterMapsFunc( 'crystal', '=', state.filterCrystal ) );
      }
      if( state.filterCampaign ) {
        //ret = ret.filter( filterMapsFunc( 'campaignID', '=', state.filterCampaign ) );
        if( state.filterCampaign == -1 ) {
          ret = ret.filter( c =>
            (c.campaignID >= 1 && c.campaignID <= 3 && c.missionIndex < 61) ||
        } else {
          ret = ret.filter( c => c.campaignID == state.filterCampaign );
        }
      }
      state.filteredMapsCount = ret.length;
      state.lastPage = Math.ceil( state.filteredMapsCount / state.maxEntries );
      return ret.sort(
        sortFunc( state.sortedCol1, state.sortedCol1Asc, state.sortedCol2, state.sortedCol2Asc ) );
    },
    filteredCols (state) {
      return state.mapCols.filter( c => !c.hidden );
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
    updateFilterCampaign (state, val) {
      state.filterCampaign = val;
    },
    updateFilterCrystal (state, val) {
      state.filterCrystal = val;
    },
    updateFilterBossesOnly (state, val) {
      state.filterBossesOnly = val;
    },
    sortMaps (state) {
      state.maps = state.maps.sort(
        sortFunc( state.sortedCol1, state.sortedCol1Asc, state.sortedCol2, state.sortedCol2Asc )
      );
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
