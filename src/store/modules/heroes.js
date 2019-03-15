import { elements, rarities, heroClasses as classes } from '../../api/const';
const heroes = require('../../assets/heroes.json');

for( const hero of heroes ) {
  hero.sElement = elements[hero.element] || '';
  hero.sRarity = rarities[hero.rarity] || '';
  hero.sClass = classes[hero.class] || '';
  if( hero.id >= 1 && hero.id <= 100 && hero.skill && hero.skill.effects ) { // maiden
    const baseTicks = Math.max(1, Math.floor(hero.skill.ticks))
    let effect = hero.skill.effects.find( (e) => e.type === 'DamageEffect' && e.target === 'enemy' );
    hero.skillDMG = (effect && effect.damage) || 0;
    hero.skillDMGInc = (effect && effect.damageInc) || 0;
    hero.skillDMGticks = Math.max( baseTicks, (effect && (effect.overtimeduration/effect.overtimeinterval)) || 1 );

    effect = hero.skill.effects.find( (e) => e.type === 'HealEffect' );
    hero.skillHEAL = (effect && effect.hp) || 0;
    hero.skillHEALInc = (effect && effect.hpInc) || 0;
    hero.skillHEALticks = Math.max( baseTicks, (effect && (effect.overtimeduration/effect.overtimeinterval)) || 1 );
  }
}

const heroCols = [
  { hidden:false, name:'name', caption:'Maiden' },
];
const cap = (str) => str.replace( /(\b[a-z](?!\s))/g, x => x.toUpperCase() );
heroCols.forEach( c => (c.caption = c.caption || cap(c.name)) );


const defaultState = {
  heroes,
  heroCols,
};

const getters = {
  maidens: (state) => {
    return state.heroes.filter( h =>
      h.id >= 1 &&
      h.id <= 100 &&
      h.skill
    );
  },

  filteredHeroCols: () => {
    return heroCols.filter( c => !c.hidden );
  },
}

export default {
  state: defaultState,
  getters,
}
