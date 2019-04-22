import { rarities, classes, itemSlots, itemImages, SLOT, RARITY } from '../../api/const';

const baseItems = require('../../assets/items.json');
const sets = require('../../assets/sets.json');

const defaultGearItems = {};

Object.keys(baseItems).map( key => {
  const item = baseItems[key];
  item.imageUrl = itemImages.get(item.tex || item.id);
  if( item.stats[RARITY.SET_ITEM] ) {
    item.set = sets.find( s => s.items.includes(item.id) );
  }
  item.stats.forEach( (val, rarityIndex) => {
    if( !val ) return;
    const uid = item.id + rarityIndex * 10000;
    // defaultGearItems.push({
    defaultGearItems[uid] = {
      id: uid,
      itemID: item.id,
      rarity: rarityIndex,
      level: 5,
      tiers: [10,10,10],
    };
    // });
  } );
});

function filterBySlot(slot) {
  const filteredItems = {};
  for( const key in baseItems ) {
    const item = baseItems[key];
    if( item.slot === slot ) filteredItems[key] = item;
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

};

const actions = {

};

export default {
  state,
  getters,
  mutations,
  actions,
}
