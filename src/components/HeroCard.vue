<template>
  <div class="container" >
    <div class="flex-row">
      <div class="flex-col">
        <div class="flex-row align-center">
          <h4>{{ hero.name }}</h4>
          <img :src="getImage(hero.sClass)" alt="hero.sClass" class="class-icon">
          <img :src="getImage(hero.sElement)" alt="hero.sElement" class="class-icon">
        </div>
        <div class="flex-row wrap align-center">
          <ul class="border-right">
            <li><span class="cell-cap">Health</span><span class="cell-data">{{ heroHealth }}</span></li>
            <li><span class="cell-cap">Damage</span><span class="cell-data">{{ heroDamage }}</span></li>
            <li><span class="cell-cap">Atk Spd</span><span class="cell-data">{{ heroAS }}</span></li>
            <li><span class="cell-cap">Crit</span><span class="cell-data">{{ heroCrit }}</span></li>
            <li><span class="cell-cap">Dodge</span><span class="cell-data">{{ heroDodge }}</span></li>
            <li><span class="cell-cap">Defense</span><span class="cell-data">{{ heroDefense }}</span></li>
            <li><span class="cell-cap">CDR</span><span class="cell-data">{{ heroCDR }}</span></li>
          </ul>
          <ul>
            <li><span class="cell-cap">EHP</span><span class="cell-data">{{ heroEHP }}</span></li>
            <li><span class="cell-cap">DPS</span><span class="cell-data">{{ heroDPS }}</span></li>
            <li><span class="cell-cap">Range</span><span class="cell-data">{{ heroRange }}</span></li>
            <li><span class="cell-cap">Vision</span><span class="cell-data">{{ heroVision }}</span></li>
            <li><span class="cell-cap">Movement</span><span class="cell-data">{{ heroMoveSpeed }}</span></li>
            <li><span class="cell-cap">Swing Time</span><span class="cell-data">{{ heroSwingTime }}</span></li>
            <li><span class="cell-cap">Respawn</span><span class="cell-data">{{ heroRespawn }}</span></li>
          </ul>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { campBonuses, heroImages } from '../api/const.js';

export default {
  props: {
    hero: Object,
  },

  data () {
    return {
      moveSpeeds: ['', '', '', 'V.Fast', 'Fast', 'Med', 'Slow', 'V.Slow'],
    };
  },

  computed: {
    ...mapState({
      heroLevel: state => state.heroes.heroLevel,
      skillLevel: state => state.heroes.skillLevel,
      cdr: state => state.heroes.cdr,
      campLevel: state => state.heroes.campLevel,
    }),
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
      let val = m.attack.damage + m.attack.damageInc * (this.heroLevel-1) ** m.dmgCoef;
      val *= this.campBonus;
      val *= m.id === 4 ? 1.2 : 1.3;
      return Math.round(val).toLocaleString();
    },
    heroAS () {
      const m = this.hero;
      let val = m.as;
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
      let val = m.id === 4 ? 200 : 300;
      return this.digit1(val/100).toLocaleString()+'%';
    },
    heroCDR () {
      const m = this.hero;
      let val = this.cdr;
      return this.digit1(val)+'%';
    },
    AS () {
      console.log('total AS:', this.$store.state.heroes.heroExtraAS + this.hero.as);
      return this.$store.state.heroes.heroExtraAS + this.hero.as;
    },
    heroDPS () {
      const m = this.hero;
      let val = m.attack.damage + m.attack.damageInc * (this.heroLevel-1) ** m.dmgCoef;
      val *= this.campBonus;
      val *= m.id === 4 ? 1.2 : 1.3;
      /* vvv   attacks per second   vvv */
      val *= Math.floor(this.AS/10)/10 + m.attack.castTime;
      return Math.round(val).toLocaleString();
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
      return this.hero.attack.range;
    },
    heroVision () {
      return this.hero.vision;
    },
    heroMoveSpeed () {
      return `${this.hero.moveSpeed} (${this.moveSpeeds[this.hero.moveSpeed]})`;
    },
    heroRespawn () {
      return this.hero.respawnCD+'s';
    },
    heroSwingTime () {
      return this.hero.attack.castTime+'s';
    },

  },

  methods: {
    getImage(key) {
      return heroImages.get(key);
    },
    digit1: val => Math.round(val*10)/10,
    digit2: val => Math.round(val*100)/100,
  }

}
</script>

<style lang="scss" scoped>
.class-icon {
  width: 1.8em;
  height: 1.8em;
  margin-right: .2em;
}

ul {
  margin: .15em .35em;
  padding: 0;
}

li {
  display: table-row;
  margin-bottom: .4em;
}

.cell-cap {
  display: table-cell;
  text-align: right;
  font-weight: 700;
  font-size: .8em;
  // padding-right: 1em;
}

.cell-data {
  display: table-cell;
  font-size: .9em;
  text-align: right;
  margin-left: 2em;
  min-width: 5em;
}

img, h4, span {
  display: table-cell;
}

h4 {
  margin: .7em .5em;
}

.align-center {
  align-items: center;
  justify-content: center;
}

.container {
  margin: 0 0 1.2em;
  background: #eee;
  border-radius: .4em;
  padding: 0 .4em .4em .4em;
  color: #444;
}

.border-right {
  border-right: 1px solid #bbb;
  margin-right: .5em;
  padding-right: .5em;
}

.flex-row {
  display: flex;
  flex-direction: row;
  padding: 0;
}
.wrap {
  flex-wrap: wrap;
}
.flex-col {
  display: flex;
  flex-direction: column;
}
</style>