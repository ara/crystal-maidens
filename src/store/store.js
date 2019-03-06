import Vue from 'vue';
import Vuex from 'vuex';
import mMaps from './modules/maps';
// import { vip } from '../api/maps';
// import { cap, sortMapsFunc as sortFunc, filterMapsFunc } from '../api/maps';
import { cap, campaigns, maps, sortMapsFunc as sortFunc } from '../api/maps';


for( const m of maps ) {
  if( m.id < 2000 ) {
    m.name = `C${m.campaignID % 1000} ${m.campaignID>1000?'H':'E'} ${m.missionIndex.toString().padStart(2)}`;
  } else {
    m.name = `${m.campaignID}-${m.missionIndex.toString().padStart(2)}`;
  }
}

const fix = n => v => v.toFixed(n);
const fix0 = fix(0);
const fix2 = fix(2);
const fix2noz = v => v === 0 ? '' : v.toFixed(2);

const mapCols = [
  { col: 'name', name: 'Map\t   ' },
  // { col: 'mapType', name: 'Type' }, // 1: boss; 0: artifact
  { col: 'energy', align: 'right' },
  { col: 'fodder', align: 'right', func:fix2 },
  { col: 'coinsPerEnergy', name: 'Coins/E', align: 'right', func:fix0 },
  { col: 'maidenXPPerEnergy', name: 'M.XP/E', align: 'right', func:fix0 },
  { col: 'fodderCoins', name:'Fod/Coins', align: 'right', func:fix0, hidden:true },
  { col: 'crystal', align: 'center' },
  { col: 'dustDamage', align: 'right', func:fix2noz, name: 'DMG dust' },
  { col: 'dustHealth', align: 'right', func:fix2noz, name: 'HP dust' },
  { col: 'dustCrit', align: 'right', func:fix2noz, name: 'Crit dust' },
  { col: 'dustAS', align: 'right', func:fix2noz, name: 'AS dust' },
  { col: 'dustDodge', align: 'right', func:fix2noz, name: 'Dodge dust' },
  { col: 'dustDEF', align: 'right', func:fix2noz, name: 'DEF dust' },
  { col: 'dustCDR', align: 'right', func:fix2noz, name: 'CDR dust' },
];
mapCols.forEach( c => (c.name = c.name ? c.name : cap(c.col)) );


Vue.use(Vuex);

const store = new Vuex.Store({

  state: {
    ...mMaps.state,
    maps,
    mapCols,
    campaigns: campaigns.sort( sortFunc('groupID', true, 'id', true) ),
  },

  // getters: {
  //   ...mMaps.getters,
  // },

  // mutations: {
  //   ...mMaps.mutations,
  // },

  // actions: {
  //   ...mMaps.actions,
  // },

  // modules: {
  //   mMaps
  // },

  strict: process.env.NODE_ENV !== 'production',

})
store.hotUpdate( mMaps );

export default store;

