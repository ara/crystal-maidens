<template>
  <div class="container" @mouseenter="showCloseButton" @mouseleave="hideCloseButton">
    <!-- <div class="flex-row"> -->
      <div class="flex-col wide">
        <div v-if="isMinion" class="flex-row text-shadow headline"
          @click="toggleDetails"
          style="cursor:pointer;margin: .2em 0 -.2em 0;"
        >
          <button v-if="selectedHeroes.length>1" class="close" :id="'close'+hero.id" @click="deselectHero">×</button>
          <img v-if="getImage(hero.id)"
            :src="getImage(hero.id)" :alt="hero.name"
            class="hero-icon border-rarity" :class="'r'+hero.rarity">
          <div v-else style="padding-left:.5em;"></div>
          <span class="hero-name">{{ hero.name }}</span>
          <span class="hero-title" v-if="hero.title">{{ hero.title }}</span>
          <img v-if="hero.class!==0" :src="getImage(hero.sClass)" :alt="hero.sClass" class="class-icon">
          <span class="attr">{{ hero.sClass }}</span>
          <img v-if="hero.element!==0" :src="getImage(hero.sElement)" :alt="hero.sElement" class="class-icon">
          <span class="attr">{{ hero.sElement }}</span>
          <span class="lvl">(Level {{ heroLevel }})</span>
        </div>
        <div v-else class="flex-row text-shadow no-pad headline hero-pad"
          :style="showDetails?'':'margin-bottom:-0.5em;'"
        >
        <button v-if="selectedHeroes.length>1" class="close" :id="'close'+hero.id" @click="deselectHero">×</button>
          <img v-if="getImage(hero.id)"
            :src="getImage(hero.id)" :alt="hero.name"
            class="hero-icon border-rarity" :class="'r'+hero.rarity">
          <div class="flex-col">
            <div class="flex-row center">
              <span class="hero-name">{{ hero.name }}</span>
              <span class="hero-title" v-if="hero.title">{{ hero.title }}</span>
            </div>
            <div class="flex-row center">
              <img v-if="hero.class!==0" :src="getImage(hero.sClass)" :alt="hero.sClass" class="class-icon">
              <span class="attr">{{ hero.sClass }}</span>
              <img v-if="hero.element!==0" :src="getImage(hero.sElement)" :alt="hero.sElement" class="class-icon">
              <span class="attr">{{ hero.sElement }}</span>
              <span class="lvl">(Level {{ heroLevel }})</span>
            </div>
          </div>
        </div>
        <transition name="slide-fade">
        <div v-show="showDetails" class="stat-block">
          <ul class="border-right">
            <li><span class="cell-cap">Health</span><span class="cell-data">{{ heroHealth }}</span></li>
            <li><span class="cell-cap">Damage</span><span class="cell-data">{{ heroDamage }}</span></li>
            <li><span class="cell-cap">Atk Spd</span><span class="cell-data">{{ heroAS }}</span></li>
            <li><span class="cell-cap">Atk /sec</span><span class="cell-data">{{ atkSec }}</span></li>
            <li><span class="cell-cap">Crit</span><span class="cell-data">{{ heroCrit }}</span></li>
            <li><span class="cell-cap">Dodge</span><span class="cell-data">{{ heroDodge }}</span></li>
            <li><span class="cell-cap">Defense</span><span class="cell-data">{{ heroDefense }}</span></li>
            <li v-if="!isMinion"><span class="cell-cap">CDR</span><span class="cell-data">{{ heroCDR }}</span></li>
          </ul>
          <ul>
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
        <hero-skill v-show="hero.skill && showDetails"
          :hero="hero" :level="heroLevel" :show-info="showSkillDetails"
        ></hero-skill>
      </div>
    <!-- </div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { campBonuses, heroImages } from '../api/const.js';

export default {
  props: {
    hero: Object,
    level: Number,
  },

  data () {
    return {
      showDetails: false,
      moveSpeeds: ['Immob.', 'Ultra F.', 'V.Fast', 'V.Fast', 'Fast', 'Med', 'Slow', 'V.Slow'],
    };
  },

  computed: {
    ...mapState({
      globalLevel: state => state.heroes.heroLevel,
      skillLevel: state => state.heroes.skillLevel,
      cdr: state => state.heroes.cdr,
      campLevel: state => state.heroes.campLevel,
      selectedHeroes: state => state.heroes.selectedHeroes,
      showSkillDetails: state => state.heroes.showSkillDetails,
    }),
    isMinion () {
      return this.hero.id > 100;
    },
    heroLevel () {
      return this.isMinion ? this.level : this.globalLevel;
    },
    campBonus () {
      return campBonuses[this.campLevel];
    },
    heroHealth () {
      const m = this.hero;
      let val = m.hp.base + m.hp.inc * (this.heroLevel-1) ** this.hero.hpCoef;
      val *= m.id === 4 ? 1.2 : 1.3; // Nuka only has 3 'hearts'
      return Math.trunc(val).toLocaleString();
    },
    heroDamage () {
      const m = this.hero;
      if( !m.attack ) return '-';
      let val = m.attack.damage + m.attack.damageInc * (this.heroLevel-1) ** m.dmgCoef;
      val *= this.campBonus;
      val *= m.id === 4 ? 1.2 : 1.3;
      return Math.round(val).toLocaleString();
    },
    heroAS () {
      let val = this.AS;
      return this.digit2(val);
    },
    heroCrit () {
      const m = this.hero;
      let val = m.crit
      return this.digit1(val)+'%';
    },
    heroDodge () {
      const m = this.hero;
      let val = m.dodge;
      return this.digit1(val)+'%';
    },
    heroDefense () {
      const m = this.hero;
      let val = this.isMinion ? 0 : m.id === 4 ? 2 : 3;
      return this.digit1(m.def+val).toLocaleString()+'%';
    },
    heroCDR () {
      // const m = this.hero;
      let val = this.isMinion ? 0 : this.cdr;
      return this.digit1(val)+'%';
    },
    AS () {
      return (this.isMinion ? 0 : this.$store.state.heroes.heroExtraAS) + this.hero.as;
    },
    heroDPS () {
      const m = this.hero;
      if( !m.attack ) return '-';
      let val = m.attack.damage + m.attack.damageInc * (this.heroLevel-1) ** m.dmgCoef;
      val *= this.campBonus;
      val *= m.id === 4 ? 1.2 : 1.3;
      /* vvv   attacks per second   vvv */
      val *= 1 / (Math.ceil(1000/this.AS)/10 + m.attack.castTime);
      return Math.round(val).toLocaleString();
    },
    atkSec () {
      const m = this.hero;
      if( !m.attack ) return '-';
      return (1 / (Math.ceil(1000/this.AS)/10 + m.attack.castTime)).toFixed(3);
    },
    heroEHP () {
      const m = this.hero;
      let val = m.hp.base + m.hp.inc * (this.heroLevel-1) ** this.hero.hpCoef;
      val *= Math.min(2, 1+(m.defense || 300)/10000);
      val *= 100/(100-Math.min(m.dodge,80));
      val *= m.id === 4 ? 1.2 : 1.3; // Nuka only has 3 'hearts'
      return Math.round(val).toLocaleString();
    },
    heroRange () {
      return this.hero.attack ? this.hero.attack.range : 0;
    },
    heroVision () {
      return this.hero.vision || 0;
    },
    heroMoveSpeed () {
      return `${this.hero.moveSpeed || 0} (${this.moveSpeeds[this.hero.moveSpeed]})`;
    },
    heroRespawn () {
      return this.hero.respawnCD+'s';
    },
    heroSwingTime () {
      return this.hero.attack ? this.hero.attack.castTime+'s' : '-';
    },

  },

  methods: {
    toggleDetails () {
      if( this.isMinion ) {
        this.showDetails = !this.showDetails;
      }
    },
    setColor(color) {
      if( this.selectedHeroes.length === 1 ) return;
      document.getElementById('close'+this.hero.id).style.color = color;
    },
    getImage(key) {
      return heroImages.get(key);
    },
    digit1: val => Math.round(val*10)/10,
    digit2: val => Math.round(val*100)/100,
    showCloseButton(event) {
      this.setColor('#aaa');
    },
    hideCloseButton(event) {
      this.setColor('#eee');
    },
    deselectHero() {
      this.$store.commit('deselectMaiden', this.hero);
    }
  },

  created() {
    this.showDetails = !this.isMinion || this.$store.state.heroes.showMinionDetails;
  },

  components: {
    HeroSkill: () => import('./HeroSkill.vue'),
  },

}
</script>

<style lang="scss" scoped>
.hero-icon {
  width: 3.2em;
  height: 3.2em;
  margin-right: .5em;
}
.class-icon {
  width: 1.6em;
  height: 1.6em;
  margin-right: .2em;
}
.border-rarity {
  border-width: 3px;
  border-style: solid;
  border-radius: .4em;
}

.attr {
  font-size: .85em;
  margin: 0 .5em 0 .1em;
}

ul {
  display: inline-table;
  margin: .15em .35em;
  padding: 0;
}

li {
  display: table-row;
  margin-bottom: .4em;
}

.cell-cap {
  text-align: end;
  font-weight: 700;
  font-size: .8em;
}

.cell-data {
  font-size: .9em;
  text-align: center;
  min-width: 6.2em;
}

h4, span {
  display: table-cell;
}

.lvl {
  margin-left: .5em;
  font-size: 1em;
}

.wide {
  width: 100%;
}
.center {
  align-items: center;
}

.hero-name {
  margin: 0 .4em 0 0;
  font-size: 1.1em;
  font-weight: 600;
  text-shadow: 0 0 3px #bbb;
}

.hero-pad {
  padding: .3em 0 .1em 0 !important; // my bad xD
}

.hero-title {
  font-size: .9em;
}

.stat-block {
  display: flex;
  align-self: flex-start;
  align-items: flex-start;
}

.container {
  display: flex;
  position: relative;
  margin: 0 0 .35em;
  background: #eee;
  border-radius: .4em;
  padding: 0 .4em .4em .4em;
  color: #555;
  border: 1px solid #aaa;
}

.flex-top {
  align-items: flex-start;
}

.border-right {
  border-right: 1px solid #bbb;
  padding-right: .5em;
}

.no-pad {
  padding: 0;
}
.text-shadow {
  text-shadow: 0 0 1px #ddd;
}
.headline {
  align-items: center;
  justify-content: start;
}
.flex-col {
  display: flex;
  flex-direction: column;
}

.close {
  cursor: pointer;
  position: absolute;
  border: none;
  width: 25px;
  height: 24px;
  top: 0;
  right: -.2em;
  font-weight: 600;
  font-size: 1.3em;
  background: transparent;
  margin: .3em .6em 0 0;
  padding: 0;
  color: #eee;
  transition: all .4s ease;
  &:hover {
    transition: all .4s ease;
    color: #555 !important;
    box-shadow: 0px 0px 1px 1px #777;
    background: #ccc;
  }
}
</style>
