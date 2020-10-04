import { mapState, mapGetters } from 'vuex';
import { campBonuses } from '../api/const';

const DEFENSE_CAP = 50; // percent
const DODGE_CAP = 80; // percent


export default {

  props: {
    heroID: {
      type: Number,
      required: true,
    },
  },

  data: () => () => ({
    maidenGear: null,
  }),

  computed: {
    ...mapState({
      gearItems: state => state.items.gearItems,
      skillLevel: state => state.heroes.skillLevel,
      cdr: state => state.heroes.cdr,
      heroLevel: state => state.heroes.heroLevel,
      campLevel: state => state.heroes.campLevel,
      extraAS: state => state.heroes.heroExtraAS,
    }),
    ...mapGetters(['baseItems']),

    hp() {
      let val = this.hero.hp.base + this.hero.hp.inc * (this.heroLevel-1) ** this.hero.hpCoef;
      val *= this.statFromGear('hp');
      val *= this.heroID === 4 ? 1.2 : 1.3; // Nuka only has 3 'hearts'
      return val;
    },
    aaDmg() {
      let val = this.hero.attack.damage + this.hero.attack.damageInc* (this.heroLevel-1) ** this.hero.dmgCoef;
      val *= campBonuses[this.campLevel];
      val *= this.statFromGear('dmg');
      val *= this.hero.attack.hits;
      val *= this.heroID === 4 ? 1.2 : 1.3; // Nuka only has 3 'hearts'
      return val;
    },
    as() { return this.hero.as + this.statFromGear('as') + this.extraAS; },
    crit() { return this.hero.crit + this.statFromGear('crit'); },
    def() { return this.hero.def + this.statFromGear('def') + (this.heroID === 4 ? 2 : 3); },
    dodge() { return this.hero.dodge + this.statFromGear('dodge'); },
    cdr() { return this.hero.cdr + this.statFromGear('cdr'); },

    dps() {
      /*          dmg    *   attacks per second                              */
      return this.aaDmg * (1 / (Math.ceil(1000 / this.as) / 10 + this.aaDelay));
    },
    ehp() {
      let val = this.hp;
      val *= 1 + Math.min(DEFENSE_CAP, this.def) / 100;
      val *= 100 / (100 - Math.min(DODGE_CAP, this.dodge));
      return val;
    },

    skillDamage() {
      return this.hero.dmgTicks * (
        this.hero.skillDMG + this.hero.skillDMGInc *
        (this.skillLevel-1) ** this.hero.skillCoef
      );
    },
    skillHeal() {
      return this.hero.healTicks * (
        this.hero.skillHEAL + this.hero.skillHEALInc *
        (this.skillLevel-1) ** this.hero.skillCoef
      );
    },

    skillDPS() { return this.skillDamage * this.dmgTicks / this.cd; },
    skillHPS() { return this.skillHeal * this.healTicks / this.cd; },

    aaRange() { return this.hero.range; },
    aaRadius() { return this.hero.attack.aoe; },
    aaDelay() { return this.hero.attack.castTime; },

    skillCastTime() { return this.hero.skill.castTime; },
    skillWalkDelay() { return this.hero.skill.walkDelay; },
    skillActDelay() { return this.hero.skill.actDelay; },
    skillRange() { return this.hero.skill.range; },
    skillRadius() { return this.hero.skill.radius; },

    baseCD() { return this.hero.skill.CD; },
    cd() { return this.baseCD * (1 - Math.min(50, this.cdr / 100)); },

    dmgTicks() { return this.hero.skill.dmgTicks; },
    healTicks() { return this.hero.skill.healTicks; },
  },


  methods: {
    fieldFromGearItem (gearItem, field) {
      const baseItem = this.baseItems[gearItem.itemID];
      return baseItem ? baseItem[field] : '';
    },
    statFromGear (field) {
      if( !this.gear ) return 0;
      let sum = 0;
      for( let i=0; i<6; i++ ) {
        if( !this.gear[i] ) continue;
        const gearItem = this.gearItems[this.gear[i]];
        if( !gearItem ) continue;
        const baseItem = this.baseItems[this.gearItem.itemID];
        if( !baseItem ) continue;
        const stats = baseItem.stats[gearItem.rarity];
        sum += stats[field] + stats[field+'Inc'] * (gearItem.level-1);
      }
      return sum * 1.45;
    },

    beforeCreate () {
      this.maidenGear = this.$store.state.items.maidensGear[this.heroID];
      this.hero = this.$store.getters.heroes
        .find( hero => hero.id === this.heroID );
      if( !this.hero ) throw new Error(`Hero from ${this.heroID} not found!`);
    },

    render (h) {
      return this.$scopedSlots.default({
        id: this.heroID,
        hp: this.hp,
        dmg: this.aaDmg,
        crit: this.crit,
        as: this.as,
        def: this.def,
        dodge: this.dodge,
        cdr: this.cdr,

        dps: this.dps,
        ehp: this.ehp,

        skillDamage: this.skillDamage,
        skillHeal: this.skillHeal,
        skillDPS: this.skillDPS,
        skillHPS: this.skillHPS,

        aaRange: this.aaRange,
        aaRadius: this.aaRadius,
        aaDelay: this.aaDelay,

        skillCastTime: this.skillCastTime,
        skillRange: this.skillRange,
        skillRadius: this.skillRadius,
        skillWalkDelay: this.skillWalkDelay,

        baseCD: this.baseCD,
        cd: this.cd,

        dmgTicks: this.dmgTicks,
        healTicks: this.healTicks,
      });
    },

  }
}
