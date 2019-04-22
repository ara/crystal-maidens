import { rarities, classes, itemSlots, itemImages, SLOT, RARITY } from '../../api/const';

const items = require('../../assets/items.json');
const sets = require('../../assets/sets.json');



function filterBySlot(slot) {
  const filteredItems = {};
  for( const key in baseItems ) {
    const item = baseItems[key];
    if( item.slot === slot ) filteredItems[key] = item;
  }
  return filteredItems;
}

const state = {
  baseItems: items,
};

const getters = {
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

};

const actions = {

};

export default {
  state,
  getters,
  mutations,
  actions,
}
