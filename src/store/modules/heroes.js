//const imgClasses = require('../../assets/classes/');

import { elements, rarities, classes, campBonuses } from '../../api/const';

const heroes = require('../../assets/heroes.json');

const cap = (str) => str.replace( /(\b[a-z](?!\s))/g, x => x.toUpperCase() );

const AS = (m) => {
  return state.heroExtraAS + m.as;
}

const skillArgs = (m) => ([
  (state.skillLevel || 29) - 1,
  m.skill.castTime + Math.ceil( (100-state.cdr) * m.skill.CD / 10 ) / 10,
]);

const heroHealth = (m) => {
  let val = m.hp.base + m.hp.inc * (state.heroLevel-1) ** m.hpCoef;
  val *= m.id === 4 ? 1.2 : 1.3; // Nuka only has 3 'hearts'
  return val;
};

const heroDamage = (m) => {
  let val = m.attack.damage + m.attack.damageInc * (state.heroLevel-1) ** m.dmgCoef;
  val *= campBonuses[state.campLevel] * m.attack.hits;
  val *= m.id === 4 ? 1.2 : 1.3;
  return val;
};

const txDamage = (m,v) => {
  if( m.attack.hits === 1 ) {
    return Math.round(v).toLocaleString();
  }
  return `[${m.attack.hits}x] ${Math.round(v/m.attack.hits).toLocaleString()}`;
}

const heroDPS = (m) => {
  let val = m.attack.damage + m.attack.damageInc * (state.heroLevel-1) ** m.dmgCoef;
  val *= campBonuses[state.campLevel] * m.attack.hits;
  val *= m.id === 4 ? 1.2 : 1.3;
  /* vvv   attacks per second   vvv */
  val *= 1/(Math.ceil(1000/AS(m))/10 + m.attack.castTime);
  return val;
};

const atkSec = (m) => {
  let val = 1/(Math.ceil(1000/AS(m))/10 + m.attack.castTime);
  return val.toFixed(3);
}

const heroEHP = (m) => {
  let val = m.hp.base + m.hp.inc * (state.heroLevel-1) ** m.hpCoef;
  val *= Math.min(2, 1+(m.defense || 300)/10000);
  val *= 100/(100-Math.min(m.dodge,80));
  val *= m.id === 4 ? 1.2 : 1.3; // Nuka only has 3 'hearts'
  return val;
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
  return m.healTicks * (m.skillHEAL + m.skillHEALInc * skillLevel ** m.skillCoef);
};

const txSkillHEAL = (m,v) => {
  let val = Math.round( v / m.healTicks ).toLocaleString();
  if( val !== '0' && m.healTicks > 1 ) val = `[${m.healTicks}x] ` + val;
  return val === '0' ? '' : val;
}

const skillDPS = (m) => {
  const [skillLevel, cd] = skillArgs(m);
  return (m.skillDMG + m.skillDMGInc * skillLevel ** m.skillCoef) * m.dmgTicks / cd;
};

const skillHPS = (m) => {
  const [skillLevel, cd] = skillArgs(m);
  return (m.skillHEAL + m.skillHEALInc * skillLevel ** m.skillCoef) * m.healTicks / cd;
};
const _num = (m,v) => v === 0 ? '' : Math.round( v ).toLocaleString();
const _txt = (m,v) => v === '0' ? '' : v;

const skillTicks = (m,v) => {
  const val = `${m.dmgTicks} / ${m.healTicks}`;
  return val === '1 / 1' ? '' : val;
}

const heroCols = [
  { val:'id', caption:'ID', sortOrderAsc:true, visible:true },
  { val:'name', caption:'Maiden', align:'left', sortOrderAsc:true, visible:true },
  { val:heroHealth, fmt:_num, caption:'Health', visible:false },
  { val:heroDamage, fmt:txDamage, caption:'Damage', visible:false },
  { val:heroEHP, fmt:_num, caption:'EHP', visible:true },
  { val:heroDPS, fmt:_num, caption:'DPS', visible:true },
  { val:atkSec, caption:'atk/s', visible:true },
  { val:skillDamage, fmt:txSkillDMG, caption:'Skill Damage' },
  { val:skillHeal, fmt:txSkillHEAL, caption:'Skill Heal' },
  { val:'skillRadius', fmt:_num, caption:'Radius' },
  { val:skillDPS, fmt:_num, caption:'Skill DPS' },
  { val:skillHPS, fmt:_num, caption:'Skill HPS' },
  { val:'skillCastTime', fmt:(m,v) => v.toFixed(1), caption:'Cast' },
  { val:'skillCD', caption:'CD' },
  { val:skillTicks, caption:'#Ticks', align:'center' },
];

heroCols.forEach( (c,i) => {
  const isField = typeof c.val === 'string';
  c.caption = c.caption || (isField ? cap(c.val) : 'Col#'+i);
  c.visible = c.visible || false;
  c.index = i;
  c.dataField = isField ? c.val : 'col'+i;
  c.displayField = c.fmt ? 'colfmt'+i : c.dataField;
});


const setSkillDMGandHEAL = (hero) => {
  hero.skillDMG = hero.skillDMGInc = 0;
  hero.skillHEAL = hero.skillHEALInc = 0;
  for( const ef of hero.skill.effects ) {
    switch( ef.type ) {
      case 'DamageEffect':
        if( ef.target === 'enemies' ) {
          hero.skillDMG = ef.damage;
          hero.skillDMGInc = ef.damageInc;
        }
        break;
      case 'HealEffect':
        hero.skillHEAL = ef.hp;
        hero.skillHEALInc = ef.hpInc;
        break;
    }
  }
}

for( let hero of heroes ) {
  hero.sElement = elements[hero.element] || '';
  hero.sRarity = rarities[hero.rarity] || '';
  hero.sClass = classes[hero.class] || '';

  if( hero.skill ) {
    hero.dmgTicks = Math.max( hero.skill.ticks, hero.skill.dmgTicks || 0 );
    hero.healTicks = Math.max( hero.skill.ticks, hero.skill.healTicks || 0 );
    hero.skillRadius = hero.skill.radius;
    hero.skillCastTime = hero.skill.castTime;
    hero.skillCD = hero.skill.CD;
    setSkillDMGandHEAL(hero);
  }
  }

  if( hero.id >= 1 && hero.id <= 100 && hero.skill && hero.skill.effects ) { // maiden
    //
  }
}

const state = {
  sorting: {
    col1: 'id',
    col2: null,
    col1Asc: true,
    col2Asc: null,
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
  campLevel: 15,
  /** for testing while items are being added */
  heroExtraAS: 0,
  selectedHeroes: [],
  openSkillDetails: true,
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

  //cCD: m.skill.castTime + Math.ceil( (100-state.cdr) * m.skill.CD / 10 ) / 10,

}


const mutations = {
  selectMaiden(state, payload) {
    state.selectedHeroes.push(payload);
    const el = document.getElementById('m'+payload.id);
    if( el ) {
      el.classList.add('selected');
    }
    payload.selected = true;
  },
  deselectMaiden(state, payload) {
    const maidenIndex = state.selectedHeroes.indexOf(payload);
    if( maidenIndex >= 0 ) {
      const el = document.getElementById('m'+payload.id);
      if( el ) {
        el.classList.remove('selected');
      }
      state.selectedHeroes.splice(maidenIndex, 1);
      payload.selected = false;
    }
  },
  deselectAllMaidens(state, payload) {
    state.selectedHeroes.forEach( m => {
      m.selected = false;
      const el = document.getElementById('m'+m.id);
      if( el ) {
        el.classList.remove('selected');
      }
    });
    state.selectedHeroes.splice(0, state.selectedHeroes.length);
  },
  updateHeroExtraAS (state, payload) {
    state.heroExtraAS = payload;
  },
  updateOpenSkillDetails (state, payload) {
    state.openSkillDetails = payload;
  },
  updateHeroLevel (state, payload) {
    state.heroLevel = payload;
  },
  updateSkillLevel (state, payload) {
    state.skillLevel = payload;
  },
  updateCDR (state, payload) {
    state.cdr = payload;
  },
  updateCampLevel (state, payload) {
    state.campLevel = payload;
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
  updateHeroesSort (state, payload) {
    const s = state.sorting;
    const col = payload.dataField;
    const order = payload.sortOrderAsc;
    if( col === s.col1 ) {
      s.col1Asc = !s.col1Asc;
    } else if( col === s.col2 ) {
      [s.col1, s.col2] = [s.col2, s.col1];
      [s.col1Asc, s.col2Asc] = [s.col2Asc, s.col1Asc];
    } else {
      [s.col1, s.col2] = [col, s.col1];
      [s.col1Asc, s.col2Asc] = [order, s.col1Asc];
    }
  },
  // sortHeroes (state) {
  //   state.heroes = state.heroes.sort(
  //     sortHeroesFunc( state.sortedCol1, state.sortedCol1Asc, state.sortedCol2, state.sortedCol2Asc )
  //   );
  // },
}

const actions = {
  setHeroExtraAS ({ commit }, payload) {
    commit('updateHeroExtraAS', payload);
  },
  setHeroLevel ({ commit }, payload) {
    commit('updateHeroLevel', payload);
  },
  setSkillLevel ({ commit }, payload) {
    commit('updateSkillLevel', payload);
  },
  setCDR ({ commit }, payload) {
    commit('updateCDR', payload);
  },
  setCampLevel ({ commit }, payload) {
    commit('updateCampLevel', payload);
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
