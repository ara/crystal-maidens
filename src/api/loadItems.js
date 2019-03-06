/* eslint-disable eqeqeq */
const lang = require('../assets/lang.json');
const data = require('../assets/data.json');
const shared = require('../const');


const buildItems = (data) => {
  const itemList = new Map();
  const items = data.dbitem.filter( (i) =>
    i.statsrarity1 ||
    i.statsrarity2 ||
    i.statsrarity3 ||
    i.statsrarity4 ||
    i.statsraritysetitem );

  for( const item of items ) {
    if( lang['item_name_'+item.id] ) {
      itemList.set( parseInt(item.id), parseDBItem(item) );
    }
  }
  return itemList;
};


const parseDBItem = ( item ) => {
  let fields = [];
  if( item.statsraritysetitem ) {
    fields.push( {
      base: item.statsraritysetitem,
      inc: item.statsperlevelraritysetitem,
      rarity: 5 }
    );
  } else {
    for( const i of [1,2,3,4] ) {
      fields.push( {
        base: item['statsrarity'+i],
        inc: item['statsperlevelrarity'+i],
        rarity: i }
      );
    }
  }
  for( const i of fields ) {
    let sbase = i.base.split(/,|;/);
    let base = [];
    for( let index = 0; index < sbase.length-1; index += 2 ) {
      base[sbase[index]] = parseInt(sbase[index+1]);
    }
    let sinc = i.inc.split(/,|;/);
    let inc = [];
    for( let index = 0; index < sinc.length-1; index += 2 ) {
      inc[sinc[index]] = parseInt(sinc[index+1]);
    }

    let itemR = getItemRarity( item, i.rarity, base, inc );
    itemR.droprate = item.packdroprate;
    itemR.eventdroprate = item.eventpackdroprate;
    itemList.push(itemR);
  }
};


const getItemRarity = ( item, rarity, base, inc, includeImage ) => {
  let i = {
    // begin: deleted for CSV:
    baseID: item.id,
    spriteID: (item.sprite || item.id) / 1,
    // end
    id: item.id * 10 + rarity,
    class: shared.heroClasses[item.heroclass] || 'Any',
    maiden: item.heroid != 0 ? lang['hero_name_'+item.heroid] : 'Any',
    slot: shared.itemSlots[item.itemslot],
    name: lang['item_name_'+item.id],
    rarity: shared.rarities[rarity-1],
  };
  i.image = includeImage
    ? `=IMAGE("https://ara.netlify.com/assets/texture2d/item_${i.spriteID}.png")`
    : '';
  addStat( i, base, inc, 'hppercent', 10000 );
  addStat( i, base, inc, 'dmgpercent', 10000 );
  addStat( i, base, inc, 'attackSpd', 100 );
  addStat( i, base, inc, 'critChance', 10000 );
  addStat( i, base, inc, 'dodge', 10000 );
  addStat( i, base, inc, 'def' );
  addStat( i, base, inc, 'cooldownReduc', 10000 );
  return i;
};


const addStat = ( statList, base, inc, name, div=1 ) => {
  statList[name] = base[name] ? base[name]/div : '';
  statList[name+'inc'] = inc[name] ? inc[name]/div : '';
};

export default {
  items: buildItems(data),
}
