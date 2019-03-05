/* eslint-disable eqeqeq */
'use strict';

const lang = require('../assets/lang.json');
const data = require('../assets/data.json');
const shared = require('../const');

const fs = require('fs');
export const cap = (str) => str.replace( /(\b[a-z](?!\s))/g, x => x.toUpperCase() );

const baseFodderValue = {
  Unidentified: 0,
  Common: 1,
  Rare: 8,
  Epic: 100,
  Legendary: 250,
  'Set Item': 250,
};

const baseDustValue = {
  Unidentifier: 0,
  Common: 60,
  Rare: 390,
  Epic: 0, // 990
  Legendary: 0, // 1650
  'Set Item': 0, // 825 ?
}

const rarityIndex = {
  Unidentifier: 0,
  Common: 1,
  Rare: 2,
  Epic: 3,
  Legendary: 4,
  'Set Item': 5,
}


const buildVIP = (data) =>
  data.dbvip.map( vip => JSON.parse( vip.data ) );

const fodderValue = (rewards, energy) => rewards.reduce( (acc, r) =>
  acc + baseFodderValue[r.rarity] * r.quantity * r.droprate / 100 / energy, 0 );

const hasCrit = (itemID, rarity) => {
  const item = data.dbitem.find( i => i.id == itemID );
  if( !item ) {
    //console.log( 'item not found, ID', itemID );
    return false;
  }
  return (item['statsrarity'+rarityIndex[rarity]] || '')
    .indexOf( 'critChance' ) >= 0;
}

const dustCrit = (rewards, energy) => {
  return rewards.reduce( (acc, r) => acc + (
    hasCrit(r.itemID, r.rarity)
      ? baseDustValue[r.rarity] * r.quantity * r.droprate / 100 / energy
      : 0
  ), 0 );
}

const buildCampaigns = (data) => {
  return data.dbcampaign
    .map( c => {
      const id = parseInt(c.id);
      const gid = parseInt(c.campaignGroupID);
      const oc = {
        id,
        groupID: gid,
        lastMapID: parseInt(c.lastMapID),
        name: lang['campaign_id_' + id] ||
          lang['campaign_id_' + gid] || '',
        title: lang['campaign_title_' + id] || lang['campaign_title_' + gid] || '',
      };
      if( id >= 6000 && id < 7000 ) {
        oc.name += ' - Hard Mode';
      }
      return oc;
    } );
};

export const mapsByCID = (data, campaignIDs) => {
  let lowestIDs = [];
  return data.dbmap.filter( (m) => {
    m.cid = m.cid || parseInt(m.campaignid);
    if( campaignIDs && !campaignIDs.includes(m.cid) ) return false;
    m.missionID = parseInt(m.id);
    lowestIDs[m.cid] = Math.min(lowestIDs[m.cid] || 999999, m.missionID);
    return true;
  }).map( (m) => {
    const missionIndex = m.missionID - lowestIDs[m.cid] + 1;
    //const name = `Map ${missionIndex}`;
    const obj = {
      id: m.missionID,
      //name,
      campaignID: m.cid,
      missionIndex,
      mapType:    parseInt(m.leveltype), // 1: boss; 0: artifact
      energy:     parseInt(m.energycost),
      userXP:     parseInt(m.rewarduserexp) || 0,
      maidenXP:   parseInt(m.rewardheroexp) || 0,
      crystal:    shared.elements[parseInt(m.crystaltype)] || '',
      coins:      parseInt(m.rewardsoftcurrency) || 0,
      cd:         parseInt(m.delaybetweentwoplays),
      challenge:  m.challengerequirements || '', //TODO: format
      pvp:        m.gamemode == 1, // gamemode is usually a string
    };

    const rewards = m.rewards.split('-').map( (sub) => {
      const [id, droprate, quantity, rarity] = sub.split(';');
      const [q1, q2] = quantity.split(',').map( q => parseInt(q) );
      return {
        name:     lang['item_name_'+id],
        itemID:   parseInt(id),
        droprate: parseInt(droprate)/100,
        q1,
        q2,
        quantity: (q1+q2)/2,
        rarity:   cap(rarity),
      };
    });

    obj.rewards = rewards;
    obj.fodder = obj.energy > 0 ? fodderValue(rewards, obj.energy) : 0;
    if( isNaN( obj.fodder ) ) {
      console.log( 'c:',obj.cid,'index:', obj.missionIndex,'ID:', obj.id,'fod:', fodderValue(rewards, obj.energy) );
    }

    obj.coinsPerEnergy = obj.energy>0 ? obj.coins / obj.energy : 0;
    obj.maidenXPPerEnergy = obj.energy>0 ? obj.maidenXP / obj.energy : 0;
    obj.fodderCoins = obj.coinsPerEnergy * obj.fodder;

    obj.dustCrit = obj.energy > 0 ? dustCrit(rewards, obj.energy) : 0;

    return obj;
  });
};


/* ----------------------- GENERIC ---------------------- */

export const sortMapsFunc = (field, asc, field2, asc2) => (a,b) => {
  if( a[field] !== b[field] ) {
    if( asc ) { [a, b] = [b, a]; }
    return typeof a[field] === 'string'
      ? a[field].localeCompare( b[field] )
      : b[field] - a[field];
  } else {
    if( asc2 ) { [a, b] = [b, a]; }
    return typeof a[field2] === 'string'
      ? a[field2].localeCompare( b[field2] )
      : b[field2] - a[field2];
  }
};

export const filterMapsFunc = (field, compType, value) => (m) => {
  switch( compType ) {
    case '=':
      return m[field] == value;
    case '!=':
    case '<>':
      return m[field] != value;
    case '>':
      return m[field] > value;
    case '<':
      return m[field] > value;
    case '>=':
      return m[field] >= value;
    case '<=':
      return m[field] <= value;
    default:
      throw new Error(`Unknown comparison "${compType}".`);
  }
};

// #region
/**
 * @param {object} args
 * @param {array} args.maps
 * @param {string} args.field
 * @param {bool} [args.asc]
 * @param {function} [args.save]
 */
// #endregion
const saveSortedMaps = (args) => {
  const mapsPath = `./generated/${args.field}Maps.json`;
  let sortedMaps = args.maps.sort( sortMapsFunc(args.field, args.asc) );
  sortedMaps = sortedMaps.map(
    args.save || ((m) => `${m.name} => ${m[args.field]}`)
  );
  fs.createWriteStream( mapsPath )
    .write( sortedMaps.join('\n')
      // args.maps.sort( sortMapsFunc(arg.sortField, arg.asc) )
      //  .map( args.mapTo );
    );
  console.log( `Generated JSON "${mapsPath}"` );
};


// TEST GENERIC


// saveSortedMaps( {
//   maps,
//   field: 'fodder',
//   save:  m => `${m.name} => `
//   `${(Math.round(m.fodder*1000)/1000+1e-4).toString().slice(0,5)} `
//   `(${m.crystal})`,
// } );

// saveSortedMaps( {
//   maps:  maps.map( m => ({ name: m.name, maidenXPPerEnergy: m.maidenXP / m.energy }) ),
//   field: 'maidenXPPerEnergy',
//   save:  m => `${m.name} => ${Math.round(m.maidenXPPerEnergy)}`
// } );

const fmt = (n, size, digits) => {
  const dot = digits > 0 ? 1 : 0;
  const ip = Math.trunc(n);
  let fp = Math.round((n - ip) * 10 ** digits) / 10 ** digits;
  const int = ('            '+ip.toLocaleString()).slice(dot+digits-size);
  if( n === ip || fp === 0 ) return (int + '       ').slice(0, size);
  const float = fp.toString().slice(1, 2 + digits);
  return int + `${float}       `.slice(0, 1 + digits);
};

// console.log( fmt( 123456, 7, 0 ) );
// console.log( fmt(  12345, 7, 0 ) );
// console.log( fmt(     12.335, 7, 2 ) );

function powerLevel (maps, vip, args) {
  const vipLevel = args.vip || 0;
  let maidenXPTable = data.gameconfig.find(d => d.key === 'heroesExperiences').val.trim();
  maidenXPTable = maidenXPTable.split(',').map( val => parseInt(val) );

  const baseEnergyRegenPerHour =
    3600 / data.gameconfig.find(d => d.key === 'energyRegenerationDelay').val;
  const energyRegenMul = 100/(100-vip[vipLevel-1].EnergyDelayRegenReduction);
  const energyRegenPerHour = baseEnergyRegenPerHour * energyRegenMul;

  const bossCDMul = 1 / (vip[vipLevel-1].ReduceBossWaitTime / 100);

  let sumEnergyPerHour = 0;
  let sumXPPerHour = 0;
  // const farmedMaps = [];
  const report = [
    '  Map    Energy Req.  Energy Left  Total XP/hour',
    '------------------------------------------------',
  ];

  for(const map of maps.sort((a,b) => b.maidenXP/b.energy - a.maidenXP/a.energy )) {
    if( map.cd === 0 ) {
      console.log(`skipped map "${map.name}" (CD of 0)`);
      continue;
    }
    let mapXPPerHour = map.maidenXP / map.cd * 3600 * bossCDMul;
    let mapEnergyPerHour = map.energy / map.cd * 3600 * bossCDMul;
    sumEnergyPerHour += mapEnergyPerHour;
    sumXPPerHour += mapXPPerHour;
    // farmedMaps.push( { map, mapXPPerHour, mapEnergyPerHour } );
    const ratio = energyRegenPerHour - sumEnergyPerHour >= 0 ? 1
      : 1-(sumEnergyPerHour-energyRegenPerHour)/mapEnergyPerHour;
    mapXPPerHour *= ratio;
    mapEnergyPerHour *= ratio;

    const strEnergyLeft = fmt( Math.max(0,energyRegenPerHour-sumEnergyPerHour), 12, 3);
    report.push(
      `${map.name} ${fmt(mapEnergyPerHour,10,4)} ` +
      `${strEnergyLeft} ${fmt(sumXPPerHour,12,0)}`
    );
    if( ratio < 1 ) break;
  }
  const maidenLevel = args.maidenLevel || 1;
  const xpNeeded = maidenXPTable.slice(-1) - maidenXPTable[maidenLevel-1];
  const time2Level = xpNeeded / sumXPPerHour;
  const days2Level = Math.trunc(time2Level / 24);
  const hours = fmt( time2Level - days2Level * 24, 5, 2 ).trim();
  report.push(report[1]);
  report.push(
    `Level ${maidenLevel} maiden capped in ${days2Level} days ` +
    `${hours} hours\nXP needed: ${xpNeeded.toLocaleString()}`
  );
  return report.join('\n');
}

//console.log( powerLevel( maps, vip, { vip: 11, maidenLevel: 81 } ) );


// fs.createWriteStream('./generated/VIP_11_Level_70.txt')
//   .write( powerLevel( maps, vip, { vip: 11, maidenLevel: 70 } ) );

// ReduceBossWaitTime (10 = -10%);
// [Common/Rare/Epic/Legendary]DropBonus (10 = +10% multiplier)
// SkillPointsRegenReduction
// EnergyDelayRegenReduction
export const vip = buildVIP(data);
export const maps = mapsByCID(data);
export const campaigns = buildCampaigns(data);

// module.export = { maps, vip };
// export default { maps: maps, vip: vip };
