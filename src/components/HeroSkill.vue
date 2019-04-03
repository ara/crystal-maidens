<template>
  <div class="wrapper"
    @click="toggleDetails"
    @mousedown.left="mousedown=true"
    @mouseup.left="mousedown=false;clearTimer()"
    @mouseout="mousedown=false;clearTimer()"
  >
    <div class="headline">
      <span class="skill-name">{{ hero.skill.name }}</span>
      <span class="skill-level">(Level {{ skillLevel }})</span>
    </div>
    <div class="skill-buttons" @click="$event.stopPropagation()">
      <button @mousedown.left="updateSkillLevel(-1)">-</button>
      <button @mousedown.left="updateSkillLevel(1)">+</button>
    </div>
    <div v-if="showDetails" class="card">
      <div class="flex-row border-top border-bottom desc">
        <span>{{ skill.desc }}</span>
      </div>
      <div class="flex-row flex-top">
        <ul class="border-right stats-list">
          <li><span class="cell-cap">CD (Base)</span><span class="cell-data">{{ currentCD }}s ({{ skill.CD }}s)</span></li>
          <li><span class="cell-cap">Cast Time</span><span class="cell-data">{{ skill.castTime }}s</span></li>
          <li><span class="cell-cap">Range</span><span class="cell-data">{{ skill.range }}</span></li>
          <li><span class="cell-cap">After Cast</span><span class="cell-data">{{ skill.actDelay }}</span></li>
          <li><span class="cell-cap">Walk Delay</span><span class="cell-data">{{ skill.walkDelay }}</span></li>
          <li><span class="cell-cap">Ticks/Hits</span><span class="cell-data">{{ skill.ticks }}</span></li>
        </ul>
      </div>

      <div class="flex-row border-top">
        <ul>
          <li v-for="(effect, i) in skill.effects" :key="i">
            <div v-html="formatEffect(hero, effect)" class="effect"></div>
          </li>
        </ul>
      </div>

    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import { effectTypes, targetTypes as targets, effects,
  maxStunDuration, maxSkillLevel } from '../api/const.js';

const formatValue = (value, color) =>
  `<span style="color:${color};font-weight:700;text-shadow:.5px .5px .2px #000;">${value}</span>`;

const TEXT_COLOR_MULTI_HITS = '#777';
const TEXT_COLOR_DURATION = 'orange';

const setOverTimeEffect = (str, ticks, duration) => {
  if( ticks > 1 ) {
    str = str.replace('#VALUE', formatValue(ticks+' x', TEXT_COLOR_MULTI_HITS)+' #VALUE');
    if( duration > 0 ) {
      str = str.slice(0, str.length-1) +
        ` over ${formatValue(duration/10, TEXT_COLOR_DURATION)} seconds.`;
    }
  }
  return str;
}

export default {
  props: {
    hero: Object,
    showInfo: Boolean,
  },

  data () {
    return {
      showDetails: this.showInfo,
      skill: this.hero.skill,
      mousedown: false,
    };
  },

  computed: {
    ...mapState({
      skillLevel: state => state.heroes.skillLevel,
      cdr: state => state.heroes.cdr,
    }),
    currentCD () {
      return this.skill.CD * (100-this.cdr)/100;
    },
  },

  methods: {
    toggleDetails () {
      this.showDetails = !this.showDetails;
    },
    formatEffect (hero, effect) {
      const mul = (this.skillLevel-1) ** this.hero.skillCoef;
      let val = 0;
      let str = effects.get(effect.type);
      
      str = str.replace(/<color=([^>]+)>([^<]+)<\/color>/g,
        '<span style="color:$1;font-weight:700;text-shadow: .5px .5px .2px #000;">$2</span>');
      str = str.replace('#TARGET', effect.target);
      
      if( effect.damage ) {
        val = effect.damage + (effect.damageInc || 0) * mul;
        str = setOverTimeEffect( str, hero.dmgTicks,
          hero.skill.dmgDuration || hero.skill.duration || 0 );
      }
      if( effect.hp ) {
        val = effect.hp + (effect.hpInc || 0) * mul;
        str = setOverTimeEffect( str, hero.healTicks,
          hero.skill.healDuration || hero.skill.duration || 0 );
      }
      if( effect.damagealter ) {
        val = Math.abs( effect.damagealter + (effect.damagealterInc || 0) * mul );
        str = str.replace('#ALTER', effect.damagealter>0 ? 'Boosts' : 'Reduces');
      }
      if( effect.defense ) {
        val = Math.abs( effect.defense + (effect.defenseInc || 0) * (this.skillLevel-1) );
      }
      if( effect.duration ) {
        let dur = (effect.duration + (effect.durationInc || 0) * (this.skillLevel-1)) / 10;
        if( effect.type === 'StunEffect' || effect.type === 'ConfuseEffect' ) {
          dur = Math.min( maxStunDuration, dur );
        }
        str = str.replace('#DURATION', dur );
      }
      if( effect.percent ) {
        val = Math.abs(effect.percent + (effect.percentInc || 0) * this.skillLevel) / 100;
      }
      if( effect.heroids ) {
        val = effect.maxconcurrent;
        str = str.replace('#LEVEL', this.skillLevel);
      }
      if( effect.type === 'MorphEffect' ) {
        let leg = 8, epic = 20, rare = 72;
        const p1 = Math.min( 24, this.skillLevel-1 );
        [leg, epic, rare] = [leg+1*p1, epic+2*p1, rare-3*p1];
        if( this.skillLevel > 25 ) {
          const p2 = this.skillLevel - 25;
          [leg, epic] = [leg+2*p2, epic-2*p2];
        }
        str = str.replace('#PERCENT1', 0)
          .replace('#PERCENT2', rare)
          .replace('#PERCENT3', epic)
          .replace('#PERCENT4', leg);
      }
      if( val !== 0 ) {
        str = str.replace('#VALUE', Math.round(val).toLocaleString());
      }
      return str;
    },
    updateSkillLevel (by, unrestricted, timer=420) {
      const upperLimit = unrestricted ? 100 : maxSkillLevel;
      const newSkillLevel = Math.min( upperLimit,
        Math.max(1, this.skillLevel+by) );
      this.$store.commit('updateSkillLevel', newSkillLevel );
      const accelTimer = Math.max(20, .6 * timer);
      this.timerID = setTimeout( (val, unlimited, lt) => {
        if( this.mousedown ) this.updateSkillLevel( val, unlimited, lt );
      }, timer, by, unrestricted, accelTimer );
    },
    clearTimer () {
      clearTimeout(this.timerID);
    },
  },

  created() {
    this.showDetails = this.$store.state.heroes.openSkillDetails;
  },

}
</script>

<style lang="scss" scoped>
.card {
  margin-top: .2em;
  text-shadow: 0 0 1px #bbb;
}
.desc {
  display: table-cell;
  width: 10%;
  padding: .1em;
  font-size: smaller;
  font-style: italic;
}
.effect {
  font-size: .8em;
  display: list-item !important;
  margin-left: 1.2em;
  margin-top: .2em;
  text-align: start;
}
.flex-row {
  max-width: 20em;
  // display: flow-root;
}
.border-top {
  border-top: 1px solid #bbb;
}
.border-bottom {
  border-bottom: 1px solid #bbb;
}
ul {
  margin: .3em;
  padding: 0;
}
li {
  display: table-row;
  margin-bottom: .4em;
}
.align-center {
  align-items: center;
  justify-content: center;
}
.cell-cap {
  display: table-cell;
  text-align: end;
  font-weight: 600;
  font-size: .75em;
}
.cell-data {
  display: table-cell;
  font-size: .9em;
  text-align: right;
  margin-left: 2em;
  min-width: 5em;
}
.skill-name {
  font-size: .95em;
  font-weight: 600;
  text-shadow: 0 1px 3px #bbb;
}
.skill-level {
  font-size: .95em;
  margin-left: .4em;
}
.wrapper {
  position: relative;
  cursor: pointer;
  border-radius: .3em;
  padding: 0.2em 0.4em 0 0.4em;
  margin-top: .2em;
  background: #ddd;
  border: 1px solid #aaa;
  width: 20em;
  &:hover button {
    opacity: 1;
    transition: opacity .3s ease;
  }
}
.skill-buttons {
  position: absolute;
  right: .25em;
  top: .2em;
  margin: 0;
}
button {
  cursor: pointer;
  border: 1px solid #aaa;
  border-radius: .2em;
  margin: 0 .15em;
  width: 18px;
  height: 18px;
  font-weight: 500;
  font-size: 1em;
  background: #ccc;
  padding: 0;
  transition: color .5s ease;
  opacity: 0;
  color: #555;
}
button:hover {
  background-color: #bbb !important;
}
button:focus {
  outline: 0;
}
.headline {
  padding-bottom: .2em;
}
</style>
