import { elements, rarities, classes } from '../../api/const';
const heroes = require('../../assets/heroes.json');


const skillArgs = (m) => ([
  (state.skillLevel || 29) - 1,
  m.skill.castTime + Math.ceil( (100-state.cdr) * m.skill.CD / 10 ) / 10,
]);

const heroHealth = (m) => {
  return m.hp.base + m.hp.inc * (state.heroLevel-1) ** m.hpCoef;
};

const skillDamage = (m) => {
  const skillLevel = (state.skillLevel || 29) - 1;
  return m.dmgTicks * (m.skill.skillDMG + m.skill.skillDMGInc * skillLevel ** m.skillCoef);
};

const txSkillDMG = (m,v) => {
  let val = Math.round( v / m.dmgTicks ).toLocaleString();
  if( val !== '0' && m.dmgTicks > 1 ) val = `[${m.dmgTicks}x] ` + val;
  return val === '0' ? '' : val;
}

const skillHeal = (m) => {
  const skillLevel = (state.skillLevel || 29) - 1;
  return m.healTicks * (m.skill.skillHEAL + m.skill.skillHEALInc * skillLevel ** m.skillCoef);
};

const txSkillHEAL = (m,v) => {
  let val = Math.round( v / m.healTicks ).toLocaleString();
  if( val !== '0' && m.healTicks > 1 ) val = `[${m.healTicks}x] ` + val;
  return val === '0' ? '' : val;
}

const skillDPS = (m) => {
  const [skillLevel, cd] = skillArgs(m);
  return (m.skill.skillDMG + m.skill.skillDMGInc * skillLevel ** m.skillCoef) * m.dmgTicks / cd;
};

const skillHPS = (m) => {
  const [skillLevel, cd] = skillArgs(m);
  return (m.skill.skillHEAL + m.skill.skillHEALInc * skillLevel ** m.skillCoef) * m.healTicks / cd;
};
const _num = (m,v) => v === 0 ? '' : Math.round( v ).toLocaleString();
const _txt = (m,v) => v === '0' ? '' : v;

const skillTicks = (m,v) => {
  const val = `${m.dmgTicks} / ${m.healTicks}`;
  return val === '1 / 1' ? '' : val;
}

const heroCols = [
  { val:'id', caption:'ID', sortOrderAsc: true },
  { val:'name', caption:'Maiden', align:'left', sortOrderAsc: true },
  { val:heroHealth, fmt:_num, caption:'Health' },
  { val:skillDamage, fmt:txSkillDMG, caption:'Skill Damage' },
  { val:skillHeal, fmt:txSkillHEAL, caption:'Skill Heal' },
  { val:'skillRadius', fmt:_num, caption:'Radius' },
  { val:skillDPS, fmt:_num, caption:'Skill DPS' },
  { val:skillHPS, fmt:_num, caption:'Skill HPS' },
  { val:'skillCastTime', fmt:(m,v) => v.toFixed(1), caption:'Cast' },
  { val:'skillCD', caption:'CD' },
  { val:skillTicks, caption:'#Ticks', align:'center' },
];
const cap = (str) => str.replace( /(\b[a-z](?!\s))/g, x => x.toUpperCase() );
heroCols.forEach( (c,i) => {
  const isField = typeof c.val === 'string';
  c.caption = c.caption || (isField ? cap(c.val) : 'Col#'+i);
  c.visible = c.visible === undefined;
  c.index = i;
  c.dataField = isField ? c.val : 'col'+i;
  c.displayField = c.fmt ? 'colfmt'+i : c.dataField;
});


for( const hero of heroes ) {
  hero.sElement = elements[hero.element] || '';
  hero.sRarity = rarities[hero.rarity] || '';
  hero.sClass = classes[hero.class] || '';

  if( hero.skill ) {
    hero.dmgTicks = Math.max( hero.skill.ticks, hero.skill.dmgTicks || 0 );
    hero.healTicks = Math.max( hero.skill.ticks, hero.skill.healTicks || 0 );
    hero.skillRadius = hero.skill.radius;
    hero.skillCastTime = hero.skill.castTime;
    hero.skillCD = hero.skill.CD;
  }

  if( hero.id >= 1 && hero.id <= 100 && hero.skill && hero.skill.effects ) { // maiden
    //
  }
}




const compute = (maiden, col) => {
  let val;
  switch( typeof col.val ) {
    case 'function':
      val = col.val(maiden); break;
    case 'string':
      val = maiden[col.val]; break;
    default:
      throw new Error(`Unknown 'val' attribute: [type="${typeof col.val}"] "${col.val.toString()}"`);
  }
  if( col.func ) {
    val = col.func( val, maiden );
  }
  let display = val;
  //if( col.fmt ) {
  //  display = col.fmt( val, maiden );
  //}
  //return [display, val];
  return val;
}

const sortHeroesFunc = (field, asc, field2, asc2) => (a,b) => {
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


const state = {
  sorting: {
    col1: 'id',
    col2: 'name',
    col1Asc: true,
    col2Asc: false,
  },
  filters: {
    class: 'All',
    element: 'All',
  },
  heroes,
  heroCols,
  skillLevel: 29,
  cdr: 40,
  heroLevel: 85,
};

const validElement = (hero) => state.filters.element === 'All' || hero.sElement === state.filters.element;
const validClass = (hero) => state.filters.class === 'All' || hero.sClass === state.filters.class;

const getters = {
  maidens: (state) => {
    return state.heroes.filter( h =>
      h.id >= 1 &&
      h.id <= 100 &&
      h.skill &&
      validElement(h) &&
      validClass(h)
    );
  },

  // sortedMaidens: (state, getters) => {
  //   return getters.maidens.sort(
  //     sortHeroesFunc(state.sorting.col1, state.sorting.col1Asc, state.sorting.col2, state.sorting.col2Asc)
  //   )
  // },

  filteredHeroCols: () => {
    return heroCols.filter( c => c.visible );
  },

  cSkillLevel: (state) => (state.skillLevel || 29) - 1,
  //cCD: m.skill.castTime + Math.ceil( (100-state.cdr) * m.skill.CD / 10 ) / 10,

}


const mutations = {
  updateSkillLevel (state, payload) {
    state.skillLevel = payload;
  },
  updateCDR (state, payload) {
    state.cdr = payload;
  },
  updateFilterHeroClass (state, payload) {
    state.filters.class = payload;
  },
  updateFilterHeroElement (state, payload) {
    state.filters.element = payload;
  },
  updateHeroColVisibility (state, payload) {
    payload.col.visible = payload.visible;
  },
  updateSort (state, col) {
    const s = state.sorting;
    if( col === s.col1 ) {
      s.col1Asc = !s.col1Asc;
    } else if( col === s.col2 ) {
      [s.col1, s.col2] = [s.col2, s.col1];
      [s.col1Asc, s.col2Asc] = [s.col2Asc, s.col1Asc];
    } else {
      [s.col1, s.col2] = [col, s.col1];
      [s.col1Asc, s.col2Asc] = [false, s.col1Asc];
    }
  },
  // sortHeroes (state) {
  //   state.heroes = state.heroes.sort(
  //     sortHeroesFunc( state.sortedCol1, state.sortedCol1Asc, state.sortedCol2, state.sortedCol2Asc )
  //   );
  // },
}

const actions = {
  setSkillLevel ({ commit }, payload) {
    commit('updateSkillLevel', payload);
  },
  setCDR ({ commit }, payload) {
    commit('updateCDR', payload);
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
