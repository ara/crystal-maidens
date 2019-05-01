import Vue from 'vue';
import { rarities, classes, itemSlots, itemImages, SLOT, RARITY } from '../../api/const';

const baseItems = require('../../assets/items.json');
const sets = require('../../assets/sets.json');

const defaultGearItems = {};

Object.keys(baseItems).map( key => {
  const item = baseItems[key];
  item.imageUrl = itemImages.get(item.tex || item.id) || itemImages.get(0);
  if( item.stats[RARITY.SET_ITEM] ) {
    item.set = sets.find( s => s.items.includes(item.id) );
  }
  item.stats.forEach( (val, rarityIndex) => {
    if( !val ) return;
    const uid = item.id + rarityIndex * 10000;
    defaultGearItems[uid] = {
      id: uid,
      itemID: item.id,
      rarity: rarityIndex,
      level: 5,
      tiers: [10,10,10],
    };
  } );
});

function filterBySlot(slot) {
  const filteredItems = {};
  for( const key in defaultGearItems ) {
    const gearItem = defaultGearItems[key];
    const baseItem = baseItems[gearItem.itemID];
    if( baseItem.slot === slot ) filteredItems[key] = gearItem;
  }
  return filteredItems;
}

const state = {
  maidensGear: {},
  gearItems: defaultGearItems,
};

const getters = {
  baseItems: () => baseItems,

  headItems (state, getters) {
    return filterBySlot( SLOT.HEAD );
  },
  chestItems (_, getters) {
    return filterBySlot( SLOT.CHEST );
  },
  mainHandItems (_, getters) {
    return filterBySlot( SLOT.WEAPON );
  },
  offHandItems (_, getters) {
    return filterBySlot( SLOT.OFFHAND );
  },
  feetItems (_, getters) {
    return filterBySlot( SLOT.BOOTS );
  },
  neckItems (_, getters) {
    return filterBySlot( SLOT.NECKLACE );
  },
};

const mutations = {
  /** @param {Number} payload maiden's ID */
  initMaidenGear (state, payload) {
    Vue.set( state.maidensGear, payload, new Array(6) );
  },
  /** @param {Number} payload maidenID, slot, itemID */
  equipItem( state, payload ) {
    const gear = [...state.maidensGear[payload.maidenID]];
    gear[payload.slot] = payload.itemID;
    Vue.set( state.maidensGear, payload.maidenID, gear );
  },
};

const actions = {

};

export default {
  state,
  getters,
  mutations,
  actions,
}
