<template>
<div class="col-3 p0 float-left" @mouseenter="showCloseButton" @mouseleave="hideCloseButton">
  <div class="portlet flexible-height block">

    <div v-if="isMinion" class="flex-row text-shadow headline" @click="toggleDetails" style="cursor:pointer;margin: .2em 0 -.2em 0;">
      <button v-if="selectedHeroIDs.length>1" class="close" :id="'close'+hero.id" @click="deselectHero">×</button>

      <img v-if="getImage(hero.id)" :src="getImage(hero.id)" :alt="hero.name" class="hero-icon border-rarity" :class="'r'+hero.rarity">

      <div v-else style="padding-left:.5em;"></div>
      <span class="hero-name">{{ hero.name }}</span>
      <span class="hero-title" v-if="hero.title">{{ hero.title }}</span>

      <img v-if="hero.class!==0" :src="getImage(hero.sClass)" :alt="hero.sClass" class="class-icon">
      <span class="attr">{{ hero.sClass }}</span>

      <img v-if="hero.element!==0" :src="getImage(hero.sElement)" :alt="hero.sElement" class="class-icon">

      <span class="attr">{{ hero.sElement }}</span>
      <span class="lvl">(Level {{ heroLevel }})</span>
    </div>

    <div v-else class="w-100" :style="showDetails?'':'margin-bottom:-0.5em;'">
      <button v-if="selectedHeroIDs.length>1" class="close" :id="'close'+hero.id" @click="deselectHero">×</button>

      <div class="portlet-content">
        <div class="hero-icon">
          <img v-if="getImage(hero.id)" :src="getImage(hero.id)" :alt="hero.name" class="hero-icon border-rarity" :class="'r'+hero.rarity">
        </div>
        <div class="hero-name">
          <span class="subtitle bold">{{ hero.name }}</span>
          <span class="overline" v-if="hero.title">{{ hero.title }}</span>
        </div>
      </div>

      <div class="portlet-content mt0_25 pb0_5 seperator -b">
        <img v-if="hero.class!==0" :src="getImage(hero.sClass)" :alt="hero.sClass" class="class-icon">
        <!-- <span class="attr">{{ hero.sClass }}</span> -->
        <img v-if="hero.element!==0" :src="getImage(hero.sElement)" :alt="hero.sElement" class="class-icon">
        <!-- <span class="attr">{{ hero.sElement }}</span> -->
        <span class="hero-lvl overline">Level<span>{{ heroLevel }}</span></span>
      </div>
    </div>

    <transition name="slide-fade">
      <div v-show="showDetails" class="portlet-content">
        <ul class="cell-block">
          <li><span class="cell-cap">Health</span><span class="cell-data">{{ heroHealth }}</span></li>
          <li><span class="cell-cap">Damage</span><span class="cell-data">{{ heroDamage }}</span></li>
          <li><span class="cell-cap">Atk Spd</span><span class="cell-data">{{ heroAS }}</span></li>
          <li><span class="cell-cap">Atk /sec</span><span class="cell-data">{{ atkSec }}</span></li>
          <li><span class="cell-cap">Crit</span><span class="cell-data">{{ heroCrit }}</span></li>
          <li><span class="cell-cap">Dodge</span><span class="cell-data">{{ heroDodge }}</span></li>
          <li><span class="cell-cap">Defense</span><span class="cell-data">{{ heroDefense }}</span></li>
          <li v-if="!isMinion"><span class="cell-cap">CDR</span><span class="cell-data">{{ heroCDR }}</span></li>
        </ul>
        <ul class="cell-block">
          <li><span class="cell-cap">EHP</span><span class="cell-data">{{ heroEHP }}</span></li>
          <li><span class="cell-cap">DPS</span><span class="cell-data">{{ heroDPS }}</span></li>
          <li><span class="cell-cap">Range</span><span class="cell-data">{{ heroRange }}</span></li>
          <li><span class="cell-cap">Vision</span><span class="cell-data">{{ heroVision }}</span></li>
          <li><span class="cell-cap">Movement</span><span class="cell-data">{{ heroMoveSpeed }}</span></li>
          <li><span class="cell-cap">{{ isMinion ? 'Swing T.':'Swing Time' }}</span><span class="cell-data">{{ heroSwingTime }}</span></li>
          <li v-if="!isMinion"><span class="cell-cap">Respawn</span><span class="cell-data">{{ heroRespawn }}</span></li>
        </ul>
      </div>
    </transition>

    <hero-skill v-if="hero.skill && showDetails" :heroID="heroID" :level="heroLevel"></hero-skill>

  </div>
  <aside class="gear" v-if="!isMinion">
    <app-gear :maiden="hero"></app-gear>
  </aside>
</div>
</template>

<script>
import {
  mapState
} from 'vuex';
import {
  campBonuses,
  heroImages
} from '../api/const.js';
import Gear from './Gear';

export default {
  props: {
    heroID: {
      type: Number,
      required: true,
    },
    level: Number,
  },

  data() {
    return {
      showDetails: null,
      moveSpeeds: ['Immob.', 'Ultra F.', 'V.Fast', 'V.Fast', 'Fast', 'Med', 'Slow', 'V.Slow'],
    };
  },

  computed: {
    ...mapState({
      globalLevel: state => state.heroes.heroLevel,
      skillLevel: state => state.heroes.skillLevel,
      cdr: state => state.heroes.cdr,
      campLevel: state => state.heroes.campLevel,
      selectedHeroIDs: state => state.heroes.selectedHeroIDs,
    }),
    hero() {
      return this.$store.getters.heroes.find(h => h.id === this.heroID);
    },
    isMinion() {
      return this.heroID > 100;
    },
    heroLevel() {
      return this.isMinion ? this.level : this.globalLevel;
    },
    campBonus() {
      return campBonuses[this.campLevel];
    },
    heroHealth() {
      const m = this.hero;
      let val = m.hp.base + m.hp.inc * (this.heroLevel - 1) ** this.hero.hpCoef;
      val *= m.id === 4 ? 1.2 : 1.3; // Nuka only has 3 'hearts'
      return Math.trunc(val).toLocaleString();
    },
    heroDamage() {
      const m = this.hero;
      if (!m.attack) return '-';
      let val = m.attack.damage + m.attack.damageInc * (this.heroLevel - 1) ** m.dmgCoef;
      val *= this.campBonus;
      val *= m.id === 4 ? 1.2 : 1.3;
      return Math.round(val).toLocaleString();
    },
    heroAS() {
      let val = this.AS;
      return this.digit2(val);
    },
    heroCrit() {
      const m = this.hero;
      let val = m.crit
      return this.digit1(val) + '%';
    },
    heroDodge() {
      const m = this.hero;
      let val = m.dodge;
      return this.digit1(val) + '%';
    },
    heroDefense() {
      const m = this.hero;
      let val = this.isMinion ? 0 : m.id === 4 ? 2 : 3;
      return this.digit1(m.def + val).toLocaleString() + '%';
    },
    heroCDR() {
      // const m = this.hero;
      let val = this.isMinion ? 0 : this.cdr;
      return this.digit1(val) + '%';
    },
    AS() {
      return (this.isMinion ? 0 : this.$store.state.heroes.heroExtraAS) + this.hero.as;
    },
    heroDPS() {
      const m = this.hero;
      if (!m.attack) return '-';
      let val = m.attack.damage + m.attack.damageInc * (this.heroLevel - 1) ** m.dmgCoef;
      val *= this.campBonus;
      val *= m.id === 4 ? 1.2 : 1.3;
      /* vvv   attacks per second   vvv */
      val *= 1 / (Math.ceil(1000 / this.AS) / 10 + m.attack.castTime);
      return Math.round(val).toLocaleString();
    },
    atkSec() {
      const m = this.hero;
      if (!m.attack) return '-';
      return (1 / (Math.ceil(1000 / this.AS) / 10 + m.attack.castTime)).toFixed(3);
    },
    heroEHP() {
      const m = this.hero;
      let val = m.hp.base + m.hp.inc * (this.heroLevel - 1) ** this.hero.hpCoef;
      val *= Math.min(2, 1 + (m.defense || 300) / 10000);
      val *= 100 / (100 - Math.min(m.dodge, 80));
      val *= m.id === 4 ? 1.2 : 1.3; // Nuka only has 3 'hearts'
      return Math.round(val).toLocaleString();
    },
    heroRange() {
      return this.hero.attack ? this.hero.attack.range : 0;
    },
    heroVision() {
      return this.hero.vision || 0;
    },
    heroMoveSpeed() {
      return `${this.hero.moveSpeed || 0} (${this.moveSpeeds[this.hero.moveSpeed]})`;
    },
    heroRespawn() {
      return this.hero.respawnCD + 's';
    },
    heroSwingTime() {
      return this.hero.attack ? this.hero.attack.castTime + 's' : '-';
    },

  },

  methods: {
    toggleDetails() {
      if (this.isMinion) {
        this.showDetails = !this.showDetails;
      }
    },
    setColor(color) {
      if (this.selectedHeroIDs.length === 1) return;
      document.getElementById('close' + this.heroID).style.color = color;
    },
    getImage(key) {
      return heroImages.get(key);
    },
    digit1: val => Math.round(val * 10) / 10,
    digit2: val => Math.round(val * 100) / 100,
    showCloseButton(event) {
      this.setColor('#aaa');
    },
    hideCloseButton(event) {
      this.setColor('#eee');
    },
    deselectHero() {
      this.$store.commit('deselectMaidenID', this.hero.id);
    }
  },

  created() {
    this.showDetails = !this.isMinion || this.$store.state.heroes.showMinionDetails;
  },

  components: {
    'app-gear': Gear,
    HeroSkill: () =>
      import('./HeroSkill.vue'),
  },

}
</script>

<style lang="scss" scoped>
// ul {
//     display: inline-table;
//     margin: 0.15em 0.35em;
//     padding: 0;
// }
//
// li {
//     display: table-row;
//     margin-bottom: 0.4em;
// }
//
// .cell-cap {
//     text-align: end;
//     font-weight: 700;
//     font-size: 0.8em;
// }
//
// .cell-data {
//     font-size: 0.9em;
//     text-align: center;
//     min-width: 6.2em;
// }
//
// .wide {
//     width: 100%;
// }
// .center {
//     align-items: center;
// }
//
// .hero-pad {
//     padding: 0.3em 0 0.1em 0 !important; // my bad xD
// }
//
//
// .container3 {
//     display: flex;
//     position: relative;
//     margin: 0 0 0.35em;
//     background: #eee;
//     border-radius: 0.4em;
//     padding: 0 0.4em 0.4em;
//     color: #555;
//     border: 1px solid #aaa;
// }
//
// .flex-top {
//     align-items: flex-start;
// }
//
// .border-right {
//     border-right: 1px solid #bbb;
//     padding-right: 0.5em;
// }
//
// .no-pad {
//     padding: 0;
// }
// .text-shadow {
//     text-shadow: 0 0 1px #ddd;
// }
// .headline {
//     align-items: center;
//     justify-content: start;
// }
//
// .close {
//     cursor: pointer;
//     position: absolute;
//     border: none;
//     width: 25px;
//     height: 24px;
//     top: 0;
//     right: -.2em;
//     font-weight: 600;
//     font-size: 1.3em;
//     background: transparent;
//     margin: 0.3em 0.6em 0 0;
//     padding: 0;
//     color: #eee;
//     transition: all 0.4s ease;
//     &:hover {
//         transition: all 0.4s ease;
//         color: #555 !important;
//         box-shadow: 0 0 1px 1px #777;
//         background: #ccc;
//     }
// }
// .gear {
//     margin: 0.3em 0 0 0.3em;
//     z-index: 1;
// }
</style>
