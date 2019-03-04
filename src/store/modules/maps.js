import { cap, maps, campaigns, sortMapsFunc as sortFunc, filterMapsFunc } from '../../maps';

console.log('campaigns: '+campaigns.length);
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

const mapCols = [
  { col: 'name', name: 'Map \t ' },
  // { col: 'mapType', name: 'Type' }, // 1: boss; 0: artifact
  { col: 'energy', align: 'right' },
  { col: 'fodder', align: 'right', func:fix2 },
  { col: 'coinsPerEnergy', name: 'Coins/E', align: 'right', func:fix0 },
  { col: 'maidenXPPerEnergy', name: 'M.XP/E', align: 'right', func:fix0 },
  { col: 'fodderCoins', name:'Fod/Coins', align: 'right', func:fix0 },
  { col: 'crystal', align: 'center' },
];
mapCols.forEach( c => (c.name = c.name ? c.name : cap(c.col)) );


const state = {
  sortedCol1: 'fodder',
  sortedCol2: 'name',
  sortedCol1Asc: false,
  sortedCol2Asc: false,
  maps,
  mapCols,
  filterCrystal: '',
  filterBossesOnly: false,
  filterCampaign: -1,
  campaigns: campaigns.sort( sortFunc('groupID', true, 'id', true) ),
  currPage: 1,
  filteredMapsCount: 0,
};

const getters = {
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
      // eslint-disable-next-line eqeqeq
      if( state.filterCampaign == -1 ) {
        ret = ret.filter( c =>
          (c.campaignID >= 1 && c.campaignID <= 3 && c.missionIndex < 61) ||
          (c.campaignID >= 1001 && c.campaignID <= 1003 && c.missionIndex < 61) );
      } else {
        // eslint-disable-next-line eqeqeq
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
};

const mutations = {
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
};

export default {
  state,
  getters,
  mutations,
}
