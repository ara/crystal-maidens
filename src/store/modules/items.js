import { rarities, classes, itemSlots, itemImages, SLOT, RARITY } from '../../api/const';

const items = require('../../assets/items.json');
const sets = require('../../assets/sets.json');



const state = {
  baseItems: items,
};

const getters = {
  items: (state) => state.baseItems
  // split a base item into its different rarities
    .map( item => item.stats
      .map( (stats, rarityIndex) => [rarityIndex, stats] )
      .filter( rarityStats => rarityStats[1] )
      // ok now we have [rarity, stats] for existing rarities
      .map( ([rarity, stats]) => (Object.assign( stats, {
        id: item.id,
        key: item.id + 'r' + item.rarity,
        name: item.name,
        imageUrl: itemImages.get(item.id),
        set: rarity === RARITY.SET_ITEM
          ? sets.find( s => s.items.includes(item.id) )
          : null,
        class: item.class,
        maiden: item.maiden,
        sClass: classes[item.class],
        slot: item.slot,
        sSlot: itemSlots[item.slot],
        maxLevel: item.maxLevel,
        dropRate: item.dropRate,
        eventDropRate: item.eventDropRate,
        rarity,
        sRarity: rarities[rarity]
      })))
    ).flat(),
  headItems (_, getters) {
    return getters.items.filter( i => i.slot === SLOT.HEAD );
  },
  chestItems (_, getters) {
    return getters.items.filter( i => i.slot === SLOT.CHEST );
  },
  mainHandItems (_, getters) {
    return getters.items.filter( i => i.slot === SLOT.WEAPON );
  },
  offHandItems (_, getters) {
    return getters.items.filter( i => i.slot === SLOT.OFFHAND );
  },
  feetItems (_, getters) {
    return getters.items.filter( i => i.slot === SLOT.BOOTS );
  },
  neckItems (_, getters) {
    return getters.items.filter( i => i.slot === SLOT.NECKLACE );
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
