<template>
  <div>
    <div class="flex-row filters">
      <div class="flex-col">

        <div>
          <label for="selClass">Class</label>
          <select id="selClass" @input="setFilterClass($event)">
            <option v-for="heroClass in ['All','Warrior','Mage','Marksman','Engineer','Support']"
              :key="heroClass">{{ heroClass }}</option>
          </select>
        </div>

        <div>
          <label for="selEle">Element</label>
          <select id="selEle" @input="setFilterElem($event)">
            <option
              v-for="ele in ['All','Fire','Nature','Water','Light','Dark']"
              :key="ele.id"
            >{{ ele }}</option>
          </select>
        </div>

        <div class="flexitem-right">
          <label for="txHeroAS">Atk Spd test</label>
          <input type="number" min="0" max="200" step="20" id="txHeroAS"
            style="width:3em"
            v-model="heroExtraAS"
          >
      </div>


      </div>

      <div class="flex-col">
        <div class="flexitem-right">
          <label for="txHeroLevel">Maiden Lvl</label>
          <input type="number" min="1" max="85" id="txHeroLevel"
            style="width:3em"
            @input="setHeroLevel($event)"
            :value="heroLevel"
          >
        </div>
        <div class="flexitem-right">
          <label for="txSkillLevel">Skill Lvl</label>
          <input type="number" min="1" max="29" id="txSkillLevel"
            style="width:3em"
            @input="setSkillLevel($event)"
            :value="skillLevel"
          >
        </div>
        <div class="flexitem-right">
          <label for="txCDR">CDR</label>
          <input type="number" min="0" max="50" step="5" id="txCDR"
            style="width:3em"
            @input="setCDR($event)"
            :value="cdr"
          >
        </div>
        <div class="flexitem-right">
          <label for="txCamp">Camp Lvl</label>
          <input type="number" min="0" max="15" step="1" id="txCamp"
            style="width:3em"
            @input="setCampLevel($event)"
            :value="campLevel"
          >
        </div>
      </div>
    </div>
    <br>
    <div class="flex-row vcenter">
      <div>

        <table>
          <thead @contextmenu.prevent="$refs.colMenu.open">
            <th v-for="c in filteredHeroCols" :key="c.id"
              :class="c.dataField===sorting.col1?'hlCol':''"
              @click.middle.exact.prevent="onColMiddleClick($event,c)"
              @click.left.exact="updateHeroesSort(c)"
            >{{ c.caption }}</th>
          </thead>

          <tbody>
            <tr
              v-for="m in sortedMaidens"
              :key="m.id"
              :id="'m'+m.id"
              :class="['h'+m.sElement, m.selected?'selected':'']"
              @click.exact="select(m)"
              @click.ctrl.exact="select(m,true)"
            >
              <td v-for="col in heroCols.filter(c => c.visible)" :key="col.index"
                :class="sorting.col1===col.dataField?'hl'+m.sElement:''"
                :style="'text-align:'+(col.align || 'right')"
              >
              <img v-if="col.dataField==='name'" :title="m.sClass"
                :src="getImage(m.sClass)"
                style="width: 18px; height: 18px; vertical-align: bottom; margin-right:.2em;"
              ><span style="display:inline-flex;justify-self:flex-end">{{ m[col.displayField] }}</span></td>
            </tr>
          </tbody>

        </table>

      </div>
      <div style="margin-left:1.2em;">
        <hero-card :hero="hero"
          v-for="hero in selectedHeroes" :key="hero.id"
          style="box-shadow: .2em .2em .2em 0 #777"></hero-card>
      </div>
    </div>

    <vue-context :closeOnClick="false" ref="colMenu" class="cm">
      <ul class="cm">
        <li v-for="col in heroCols" :key="col.id"
          @click="onCMClick(col)"
          class="cm"
          :class="col.val==='name'?'disabled':''"
        >
          <span :style="{float:'left', opacity:col.visible?1:0, marginRight:'.6em'}"
          >{{ '✓' }}</span>
          {{ col.caption }}
        </li>
      </ul>
    </vue-context>

  </div>
</template>

<script>
import HeroCard from './HeroCard';
import { mapState, mapGetters, mapMutations } from 'vuex';
import { VueContext } from 'vue-context';
import { heroImages } from '../api/const.js';

export default {
  data() {
    return {
    }
  },

  computed: {
    ...mapState({
      heroLevel: state => state.heroes.heroLevel,
      skillLevel: state => state.heroes.skillLevel,
      cdr: state => state.heroes.cdr,
      campLevel: state => state.heroes.campLevel,
      heroCols: state => state.heroes.heroCols,
      sorting: state => state.heroes.sorting,
      classImages: state => state.heroes.classImages,
      selectedHeroes: state => state.heroes.selectedHeroes,
    }),

    heroExtraAS: {
      get () {
        return this.$store.state.heroes.heroExtraAS;
      },
      set (val) {
        this.$store.commit('updateHeroExtraAS', parseInt(val));
      },
    },

    computedMaidens (state) {
      const time = Date.now();
      const data = state.maidens.map( m => this.computeMaiden(m) );
      console.log(`Maidens computed in ${Date.now()-time} ms.`);
      return data;
    },

    sortedMaidens (state) {
      return state.computedMaidens.sort(
        this.sortHeroesFunc( this.sorting.col1, this.sorting.col1Asc, this.sorting.col2, this.sorting.col2Asc )
      );
    },

    ...mapGetters(['maidens','filteredHeroCols']),
  },

  methods: {
    getImage (key) {
      return heroImages.get(key);
    },
    computeMaiden (maiden) {
      for( const col of this.heroCols ) {
        if( col.dataField.startsWith('col') ) {
          maiden[col.dataField] = col.val(maiden);
        }
        if( col.fmt ) {
          maiden[col.displayField] = col.fmt( maiden, maiden[col.dataField] );
        }
      }
      return maiden;
    },
    sort (maidens, ...args) {
      return maidens.sort( this.sortHeroesFunc(...args) );
    },
    setHeroLevel (event) {
      this.$store.dispatch('setHeroLevel', parseInt(event.target.value));
    },
    setSkillLevel (event) {
      this.$store.dispatch('setSkillLevel', parseInt(event.target.value));
    },
    setCDR (event) {
      this.$store.dispatch('setCDR', parseInt(event.target.value));
    },
    setCampLevel (event) {
      this.$store.dispatch('setCampLevel', parseInt(event.target.value));
    },
    setFilterClass (event) {
      this.$store.commit('updateFilterHeroClass', event.target.value);
    },
    setFilterElem (event) {
      this.$store.commit('updateFilterHeroElement', event.target.value);
    },
    onColMiddleClick (event, col) {
      this.updateHeroColVisibility( { col, visible:false } );
    },
    onCMClick (col) {
      this.updateHeroColVisibility( { col, visible:!col.visible } );
    },
    classIcon (hero) {
      return this.classImages[hero.class];
    },
    select (hero, multiSelect=false) {
      /* Normal clicks don't multi select.
        But if you click on a selected hero that is
        part of a multi select, it will deselect it. */
      if( !multiSelect ) {
        if( this.selectedHeroes.length > 1 &&
            this.selectedHeroes.includes(hero)
        ) {
          return this.$store.commit('deselectMaiden', hero);
        }
        this.$store.commit('deselectAllMaidens');
      }
      if( !this.selectedHeroes.includes(hero) ) {
        this.$store.commit('selectMaiden', hero);
      }
    },

    ...mapMutations(['updateHeroColVisibility','computeMaidens','updateHeroesSort']),

    sortHeroesFunc: (field, asc, field2, asc2) => (a,b) => {
      if( a[field] !== b[field] ) {
        if( asc ) { [a, b] = [b, a]; }
        return typeof a[field] === 'string'
          ? b[field].localeCompare( a[field] )
          : b[field] - a[field];
      } else {
        if( asc2 ) { [a, b] = [b, a]; }
        return typeof a[field2] === 'string'
          ? b[field2].localeCompare( a[field2] )
          : b[field2] - a[field2];
      }
    },

  },

  mounted () {
    this.select(this.maidens[0]);
  },

  components: {
    VueContext,
    HeroCard,
  },

}
</script>

<style lang="scss" scoped>
$p-dark: #333;
$p-medium: #777;
$p-ml: #bbb;
$p-light: #eee;

$fire: #f4cccc;
$nature: #d9ead3;
$water: #c9daf8;
$light: #fff2cc;
$dark: #d9d2e9;

$darkenBy: 5%;

.filters {
  justify-content: center;
  * {
    margin-right: .6em;
    margin-top: .2em;
    font-size: .95em;
  }
  input, select {
    align-items: baseline;
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.flexitem-right {
  display: flex;
  justify-content: flex-end;
  label {
    align-self: center;
  }
}

.flexitem-left {
  display: flex;
  justify-content: flex-start;
}

.hlCol {
  background: $p-ml;
}
.hFire {
  background: $fire;
}
.hlFire {
  background: darken($fire, $darkenBy) !important;
}
.hNature {
  background: $nature;
}
.hlNature {
  background: darken($nature, $darkenBy) !important;
}
.hWater{
  background: $water;
}
.hlWater {
  background: darken($water, $darkenBy) !important;
}
.hLight {
  background: $light;
}
.hlLight {
  background: darken($light, $darkenBy) !important;
}
.hDark {
  background: $dark;
}
.hlDark {
  background: darken($dark, $darkenBy) !important;
}

.selected {
  outline: 4px solid #3c78d8;
  outline-offset: -2px;
}

table {
  box-shadow: 0px 0px 8px 1px rgba(51, 51, 51, 0.5);
  cursor: default;
  margin-left: .5em;

  font-size: smaller;
  background-color: $p-dark;
  display: inline-block;
  vertical-align: top;

  border-collapse: collapse;
  border-spacing: 0px;

  table-layout: auto;

  tfoot, thead {
    background-color: $p-light;
  }

  th {
    // position: sticky; top: 0;
    background-color: $p-light;
    padding: .3em .1em .2em .4em;
    text-align: left;
    width: auto;
    cursor: pointer;
    border: 1px solid $p-medium;
  }
  td {
    border: 1px solid $p-ml;
    padding: .1em .3em;
    &:first-child {
      border-left-color: $p-medium;
    }
    &:last-child {
      border-right-color: $p-medium;
    }
    text-align: right;
  }

  tr {
    &:last-child td {
      border-bottom-color: $p-medium;
    }
  }
}
.vcenter {
  justify-content: center;
}
body {
  margin: 0 !important;
  padding: 0 !important;
}

</style>
