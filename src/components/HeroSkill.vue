<template>
  <div class="wrapper" :class="isMinion?'ww-minion':'ww'"
    @mousedown.left="mousedown=true"
    @mouseup.left="clearTimer()"
    @mouseout="clearTimer()"
  >
    <div class="headline" @click="toggleSkillDetails">
      <img v-if="skillIcon" :src="skillIcon" class="skill-icon">
      <span class="skill-name">{{ skillName }}</span>
      <span class="skill-level">(Level {{ skillLevel }})</span>
      <div v-if="!isMinion" class="skill-buttons" @click="$event.stopPropagation()">
        <button class="skill-bt"
          @mousedown.left="updateSkillLevel(-1)"
        >-</button>
        <button class="skill-bt"
          @mousedown.left="updateSkillLevel(1)"
        >+</button>
      </div>
    </div>
    <transition name="slide-fade">
    <div v-show="showSkillDetails" class="card">
      <div v-if="isMinion" class="border-top" style="width:100%"></div>
      <div v-else class="desc border-top border-bottom">
        <span>{{ skill.desc }}</span>
      </div>
      <div class="wrapper-skill-stats">
        <ul class="border-right stats-list" id="skill-ul-1" style="text-align:end;">
          <li v-html="stat2('CD (s)', currentCD)"></li>
          <li v-html="stat2('Cast Time (s)', skill.castTime)"></li>
          <li v-html="stat2('Range', skill.range)"></li>
          <li v-html="stat2('Walk Delay', skill.walkDelay)"></li>
        </ul>
        <ul class="border-right stats-list" style="text-align:left;">
          <li v-html="stat2('Base CD (s)', skill.CD, true)"></li>
          <li v-html="stat2('After Cast (s)', skill.actDelay, true)"></li>
          <li v-html="stat2('Radius', skill.radius, true)"></li>
        </ul>
      </div>

      <div class="effects border-top">
        <ul>
          <li v-for="(effect, i) in skill.effects" :key="i">
            <div v-html="formatEffect(hero, effect)" class="effect"></div>
          </li>
        </ul>
      </div>

      <div v-if="skill.effects[0].heroids">
        <hero-card v-for="minionID in skill.effects[0].heroids" :key="minionID"
          :heroID="minionID" :level="skillLevel" :showInfo="false"
        ></hero-card>
      </div>

    </div>
    </transition>
  </div>
</template>

<script>
import HeroCard from './HeroCard';
import { mapState } from 'vuex';
import { effectTypes, targetTypes as targets, effects,
  maxStunDuration, maxSkillLevel, skillIcons } from '../api/const.js';

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
    heroID: Number,
    showInfo: Boolean,
    level: Number,
  },

  data () {
    return {
      showSkillDetails: this.showInfo || this.$store.state.heroes.showSkillDetails,
      mousedown: false,
    };
  },

  computed: {
    ...mapState({
      globalSkillLevel: state => state.heroes.skillLevel,
      cdr: state => state.heroes.cdr,
      heroes: (state, getters) => getters.heroes,
    }),
    hero () {
      return this.heroes.find( h => h.id === this.heroID );
    },
    skill () { return this.hero.skill; },
    skillIcon () { return skillIcons.get(this.skill.id); },
    skillName () { return this.skill.name || '#' + this.skill.id; },
    heroCDR () {
      return this.isMinion ? 0 : this.cdr;
    },
    currentCD () {
      return Math.ceil(this.skill.CD * (100-this.heroCDR) / 10) / 10;
    },
    isMinion () { return this.heroID > 100; },
    skillLevel () {
      return this.isMinion
        ? Math.floor( (this.level-1) / 3 ) + 1
        : this.globalSkillLevel;
    },
  },

  methods: {
    heroFromID (id) {
      return this.heroes.find( h => h.id === id );
    },
    stat2 (title, val, swap) {
      const part1 = Math.floor(val);
      let part2 = val - part1;
      part2 = Math.round(part2 * 10);
      let alignStart = 'text-align: start;';
      let data = `<span style="display: table-cell; width: 1.8em; font-size: .9em; text-align: end;">${part1}</span>`;
      if( part2 !== 0 ) {
        data += `<span style="display: table-cell; width: .8em; font-size: .9em; text-align: start;">.${part2}</span>`;
      } else {
        data += `<span style="display: table-cell; width: .8em"></span>`;
      }
      const caption = `<span style="display: table-cell; text-align: ${swap?'start':'end'}; padding-${swap?'left':'right'}:.8em; font-weight: 600; font-size: .75em;">${title}</span>`;
      return swap ? data+caption : caption+data;
    },
    toggleSkillDetails () {
      this.showSkillDetails = !this.showSkillDetails;
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
        if( effect.type === 'AlterAttackSpeed' && effect.target === 'yourself' ) {
          const buffedAS = (val/100+1) * (this.hero.as + this.$store.state.heroes.heroExtraAS);
          str += ' (=<span style="color:orange;font-weight:700;text-shadow: .5px .5px .2px #000;">'+
            buffedAS.toFixed(1) + '</span> AS)';
        }
      }
      if( effect.heroids ) {
        val = effect.maxconcurrent;
        str = str.replace('#LEVEL', this.skillLevel);
      }
      if( effect.type === 'MorphEffect' ) {
        let leg = 8;
        let epic = 20;
        let rare = 72;
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
      if( val ) {
        val = typeof val === 'number' ? Math.round(val).toLocaleString() : val;
        str = str.replace('#VALUE', val);
      }
      return str;
    },
    updateSkillLevel (by, unrestricted, timer=300) {
      const upperLimit = unrestricted ? 100 : maxSkillLevel;
      const newSkillLevel = Math.min( upperLimit,
        Math.max(1, this.skillLevel+by) );
      this.$store.commit('updateSkillLevel', newSkillLevel );
      const accelTimer = Math.max(25, 0.6 * timer);
      this.timerID = setTimeout( (val, unlimited, lt) => {
        if( this.mousedown ) this.updateSkillLevel( val, unlimited, lt );
      }, timer, by, unrestricted, accelTimer );
    },
    clearTimer () {
      this.mousedown = false;
      clearTimeout(this.timerID);
    },
  },

  components: {
    HeroCard,
  },

  created() {
  },

}
</script>

<style lang="scss" scoped>
.card {
  text-shadow: 0 0 1px #ccc;
}
.wrapper-skill-stats {
  display: flex;
  justify-content:center;
}
.skill-icon {
  width: 2.2em;
  height: 2.2em;
  border-radius: .5em;
  margin-right: .4em;
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
.effects {
  text-align: start;
}
.border-top {
  border-top: 1px solid #bbb;
}
.border-bottom {
  border-bottom: 1px solid #bbb;
}
ul {
  display: inline-table;
  margin: .3em;
  padding: 0;
}
#skill-ul-1 {
  border-right: 1px solid #aaa;
  padding-right: .9em;
}
li {
  display: table-row;
  margin-bottom: .4em;
}
.align-center {
  align-items: center;
  justify-content: center;
}
.skill-name {
  font-size: .95em;
  font-weight: 600;
  text-shadow: 0 1px 3px #bbb;
}
.skill-level {
  font-size: .95em;
  margin-left: .5em;
}
.wrapper {
  position: relative;
  border-radius: .3em;
  padding: 0.2em 0.4em 0 0.4em;
  margin-top: .2em;
  background: #ddd;
  border: 1px solid #aaa;
}
.ww {
  width: 20.5em;
}
.ww-minion {
  width: 18.6em;
}
.skill-buttons {
  position: absolute;
  right: .25em;
  top: .2em;
  display: flex;
  flex-direction: column-reverse;
  margin: 0;
}
.skill-bt {
  cursor: pointer;
  border: 1px solid #aaa;
  border-radius: .2em;
  margin: .1em .15em 0;
  width: 18px;
  height: 16px;
  font-size: .9em;
  font-weight: 600;
  background: #ccc;
  padding: 0;
  color: #555;
  &:hover {
    background-color: #bbb !important;
  }
  &:focus {
    outline: 0;
  }
}
.headline {
  display: flex;
  align-items: center;
  padding-bottom: .2em;
  cursor: pointer;
    &:hover button {
    opacity: 1;
    transition: opacity .4s ease;
  }
  &:not(:hover) button {
    opacity: 0;
    transition: opacity .4s ease;
  }
}


.slide-fade-enter-active
{
  transition: all .3s ease;
}
// .slide-fade-leave-active {
//   transition: opacity .3s ease;
// }
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
