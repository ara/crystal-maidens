/* eslint-disable eqeqeq */

// import { campaigns, maps, sortMapsFunc as sortFunc, filterMapsFunc }
import { sortMapsFunc as sortFunc, filterMapsFunc }
  from '../../api/loadMaps';

const maps = require('../../assets/maps.json');
const campaigns = require('../../assets/campaigns.json');

const cap = (str) => str.replace( /(\b[a-z](?!\s))/g, x => x.toUpperCase() );


for( const m of maps ) {
  if( m.id < 2000 ) {
    m.name = `C${m.campaignID % 1000} ${m.campaignID>1000?'H':'E'} ${m.missionIndex.toString().padStart(2)}`;
  } else {
    m.name = `${m.campaignID}-${m.missionIndex.toString().padStart(2)}`;
  }
  m.Fire = m.Fire || 0;
  m.Nature = m.Nature || 0;
  m.Water = m.Water || 0;
  m.Light = m.Light || 0;
  m.Dark = m.Dark || 0;

  m.Warrior = m.Warrior || 0;
  m.Mage = m.Mage || 0;
  m.Marksman = m.Marksman || 0;
  m.Engineer = m.Engineer || 0;
  m.Support = m.Support || 0;

  m.total = m.total || 0;
}

const fix = n => v => v.toFixed(n);
const fix0 = fix(0);
const fix2 = fix(2);
const fix2noz = v => !v ? '' : v.toFixed(2);
const noz = v => v || '';

/**
 * @namespace
 * @property {string} [defaults.align] - defaults to 'right'
 * @property {string} [defaults.name] - defaults to capitalized 'col' field
 */
const mapCols = [
  { hidden:false, col: 'name', name: 'Map\t   ', align:'center' },
  // { hidden:false, col: 'mapType', name: 'Type' }, // 1: boss; 0: artifact
  { hidden:false, col: 'energy' },
  { hidden:false, col: 'fodder', func:fix2 },
  { hidden:false, col: 'coinsPerEnergy', name: 'Coins/E', func:fix0 },
  { hidden:false, col: 'maidenXPPerEnergy', name: 'M.XP/E', func:fix0 },
  { hidden:false, col: 'fodderCoins', name:'Fod/Coins', func:fix0 },
  { hidden:false, col: 'crystal', align: 'center' },
  { hidden:true, col: 'dustDamage', func:fix2noz, name: 'DMG dust' },
  { hidden:true, col: 'dustHealth', func:fix2noz, name: 'HP dust' },
  { hidden:true, col: 'dustCrit', func:fix2noz, name: 'Crit dust' },
  { hidden:true, col: 'dustAS', func:fix2noz, name: 'AS dust' },
  { hidden:true, col: 'dustDodge', func:fix2noz, name: 'Dodge dust' },
  { hidden:true, col: 'dustDEF', func:fix2noz, name: 'DEF dust' },
  { hidden:true, col: 'dustCDR', func:fix2noz, name: 'CDR dust' },
  { hidden:true, col: 'Fire', func:noz, name: 'Fire' },
  { hidden:true, col: 'Nature', func:noz, name: 'Nature' },
  { hidden:true, col: 'Water', func:noz, name: 'Water' },
  { hidden:true, col: 'Light', func:noz, name: 'Light' },
  { hidden:true, col: 'Dark', func:noz, name: 'Dark' },
  { hidden:false, col: 'Warrior', func:noz, name: 'Warrior' },
  { hidden:false, col: 'Mage', func:noz, name: 'Mage' },
  { hidden:false, col: 'Marksman', func:noz, name: 'Marksman' },
  { hidden:false, col: 'Engineer', func:noz, name: 'Engineer' },
  { hidden:false, col: 'Support', func:noz, name: 'Support' },
  { hidden:false, col: 'total', func:noz },
];
mapCols.forEach( c => (c.name = c.name ? c.name : cap(c.col)) );

const colProfiles = [
  { name: 'General', cols: ['name', 'energy', 'fodder', 'coinsPerEnergy', 'maidenXPPerEnergy', 'fodderCoins', 'crystal'] },
  { name: 'Dusts', cols: ['name', 'dustDamage', 'dustHealth', 'dustCrit', 'dustAS', 'dustDodge', 'dustCDR', 'dustDEF'] },
  { name: 'Elements', cols: ['name', 'Fire', 'Nature', 'Water', 'Light', 'Dark', 'total'] },
  { name: 'Classes', cols: ['name', 'Warrior', 'Mage', 'Marksman', 'Engineer', 'Support', 'total'] },
];

const defaultState = {
  sortedCol1: 'fodder',
  sortedCol2: 'name',
  sortedCol1Asc: false,
  sortedCol2Asc: false,
  maps, //
  mapCols, //
  filterCrystal: '',
  filterBossesOnly: false,
  filterCampaign: -1,
  campaigns: campaigns.sort( sortFunc('groupID', true, 'id', true) ), //
  currPage: 1,
  filteredMapsCount: 0,
  maxEntries: 20,
  colProfiles,
};


const getters = {

  lastPage (state, getters) {
    return Math.ceil( getters.maps.length / state.maxEntries );
  },

  maps (state) {
    let ret = state.maps;
    if( state.filterBossesOnly ) {
      ret = ret.filter( filterMapsFunc('mapType', '=', 1) );
    }
    if( state.filterCrystal ) {
      ret = ret.filter( filterMapsFunc( 'crystal', '=', state.filterCrystal ) );
    }
    if( state.filterCampaign != -2 ) {
      if( state.filterCampaign == -1 ) {
        ret = ret.filter( c =>
          (c.campaignID >= 1 && c.campaignID <= 3 && c.missionIndex < 61) ||
          (c.campaignID >= 1001 && c.campaignID <= 1003 && c.missionIndex < 61) );
      } else {
        ret = ret.filter( c => c.campaignID == state.filterCampaign );
      }
    }
    return ret.sort(
      sortFunc( state.sortedCol1, state.sortedCol1Asc, state.sortedCol2, state.sortedCol2Asc ) );
  },

  filteredCols (state) {
    return state.mapCols.filter( c => !c.hidden );
  },

}; // getters


const mutations = {
  sortMaps (state) {
    state.maps = state.maps.sort(
      sortFunc( state.sortedCol1, state.sortedCol1Asc, state.sortedCol2, state.sortedCol2Asc )
    );
  },
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
  updateColVisibility (state, payload) {
    payload.col.hidden = !payload.visible;
  },
  SET_COL_PROFILE (state, profile) {
    // change all columns at once
    // by working on a mirrored array
    let mirrorMapCols = state.mapCols.map( c => ({ ...c }) );
    for( const col of mirrorMapCols ) {
      if( profile.cols.includes(col.col) ) {
        col.hidden = false;
      } else {
        col.hidden = true;
      }
    }
    state.mapCols = mirrorMapCols;
  }
}; // mutations


const actions = {
  setColProfile ({ commit }, payload) {
    commit('SET_COL_PROFILE', payload);
  },
}


export default {
  state: defaultState,
  getters,
  mutations,
  actions
}
