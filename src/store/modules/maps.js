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
  { visible:true, val: 'name', name: 'Map\t   ', align:'center' },
  // { visible:true, val: 'mapType', name: 'Type' }, // 1: boss; 0: artifact
  { visible:true, val: 'energy' },
  { visible:true, val: 'fodder', func:fix2 },
  { visible:true, val: 'coinsPerEnergy', name: 'Coins/E', func:fix0 },
  { visible:true, val: 'maidenXPPerEnergy', name: 'M.XP/E', func:fix0 },
  { visible:true, val: 'fodderCoins', name:'Fod/Coins', func:fix0 },
  { visible:true, val: 'crystal', align: 'center' },
  { val: 'dustDamage', func:fix2noz, name: 'DMG dust' },
  { val: 'dustHealth', func:fix2noz, name: 'HP dust' },
  { val: 'dustCrit', func:fix2noz, name: 'Crit dust' },
  { val: 'dustAS', func:fix2noz, name: 'AS dust' },
  { val: 'dustDodge', func:fix2noz, name: 'Dodge dust' },
  { val: 'dustDEF', func:fix2noz, name: 'DEF dust' },
  { val: 'dustCDR', func:fix2noz, name: 'CDR dust' },
  { val: 'Fire', func:noz, name: 'Fire' },
  { val: 'Nature', func:noz, name: 'Nature' },
  { val: 'Water', func:noz, name: 'Water' },
  { val: 'Light', func:noz, name: 'Light' },
  { val: 'Dark', func:noz, name: 'Dark' },
  { val: 'Warrior', func:noz, name: 'Warrior' },
  { val: 'Mage', func:noz, name: 'Mage' },
  { val: 'Marksman', func:noz, name: 'Marksman' },
  { val: 'Engineer', func:noz, name: 'Engineer' },
  { val: 'Support', func:noz, name: 'Support' },
  { val: 'total', func:noz },
];
mapCols.forEach( c => {
  c.name = c.name || cap(c.val);
  /** add visible state for reactive Vue changes */
  c.visible = c.visible || false;
});

const colProfiles = [
  { name: 'General', cols: ['name', 'energy', 'fodder', 'coinsPerEnergy', 'maidenXPPerEnergy', 'fodderCoins', 'crystal'] },
  { name: 'Dusts', cols: ['name', 'dustDamage', 'dustHealth', 'dustCrit', 'dustAS', 'dustDodge', 'dustCDR', 'dustDEF'] },
  { name: 'Elements', cols: ['name', 'Fire', 'Nature', 'Water', 'Light', 'Dark', 'total'] },
  { name: 'Classes', cols: ['name', 'Warrior', 'Mage', 'Marksman', 'Engineer', 'Support', 'total'] },
];

const defaultState = {
  sorting: {
    col1: 'fodder',
    col2: 'name',
    col1Asc: false,
    col2Asc: false,
  },
  maps,
  mapCols,
  filterCrystal: '',
  filterBossesOnly: false,
  filterCampaign: -1,
  campaigns: campaigns.sort( sortFunc('groupID', true, 'id', true) ), //
  currPage: 1,
  filteredMapsCount: 0,
  maxEntries: 20,
  colProfiles,
  selectedProfileName: 'General',
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
    const s = state.sorting;
    return ret.sort(
      sortFunc( s.col1, s.col1Asc, s.col2, s.col2Asc ) );
  },

  filteredCols (state) {
    return state.mapCols.filter( c => c.visible );
  },

}; // getters


const mutations = {
  sortMaps (state) {
    const s = state.sorting;
    state.maps = state.maps.sort(
      sortFunc( s.col1, s.col1Asc, s.col2, s.col2Asc )
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
    const s = state.sorting;
    if( event.ctrlKey && col !== s.col1 ) {
      s.col2 = col;
      s.col2Asc = col === s.col2
        ? !s.col2Asc
        : false;
    } else if( col === s.col1 ) {
      s.col1Asc = !s.col1Asc;
    } else if( col === s.col2 ) {
      [s.col1, s.col2] = [s.col2, s.col1];
      [s.col1Asc, s.col2Asc] = [s.col2Asc, s.col1Asc];
    } else {
      [s.col1, s.col2] = [col, s.col1];
      [s.col1Asc, s.col2Asc] = [false, s.col1Asc];
    }
  },
  updateColVisibility (state, payload) {
    payload.col.visible = payload.visible;
  },
  SET_COL_PROFILE (state, profile) {
    state.selectedProfileName = profile.name;
    // change all columns at once
    // by working on a mirrored array
    let mirrorMapCols = state.mapCols.map( c => ({ ...c }) );
    for( const col of mirrorMapCols ) {
      if( profile.cols.includes(col.val) ) {
        col.visible = true;
      } else {
        col.visible = false;
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
