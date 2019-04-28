<template>
<div class="contain">
  <div class="row">
    <div class="col-4 flex">
      <div class="portlet">
        <div class="form-group">
          <label for="selClass" @click="setFilterClass('All')">Class</label>
          <select id="selClass" class="input" @input="setFilterClass($event.target.value)" :value="$store.state.heroes.filters.class">
            <option v-for="heroClass in ['All','Warrior','Mage','Marksman','Engineer','Support']" :key="heroClass">{{ heroClass }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="selEle" @click="setFilterElem('All')">Element</label>
          <select id="selEle" class="input" @input="setFilterElem($event.target.value)" :value="$store.state.heroes.filters.element">
            <option v-for="ele in ['All','Fire','Nature','Water','Light','Dark']" :key="ele.id">{{ ele }}</option>
          </select>
        </div>
      </div>

      <div class="portlet -btn">
        <i class="material-icons">settings</i>
      </div>
    </div>
    <div class="col-8">
      <div class="portlet">
        <div class="form-group">
          <label for="txCamp">Camp Lvl</label>
          <input type="number" min="0" max="15" step="1" id="txCamp" @input="setCampLevel($event)" :value="campLevel">
        </div>
        <div class="form-group">
          <label for="txHeroLevel">Maiden Lvl</label>
          <input type="number" min="1" max="85" id="txHeroLevel" @input="setHeroLevel($event)" :value="heroLevel">
        </div>
        <div class="form-group">
          <label for="txSkillLevel">Skill Lvl</label>
          <input type="number" min="1" max="29" id="txSkillLevel" @input="setSkillLevel($event)" :value="skillLevel">
        </div>

        <div class="seperator -y mr1"></div>

        <div class="form-group">
          <label for="txHeroAS" @click="$store.commit('updateHeroExtraAS',0)">Atk Spd test</label>
          <input type="number" min="0" max="1000" step="20" id="txHeroAS" v-model="heroExtraAS">
        </div>
        <div class="form-group">
          <label for="txCDR">CDR(%)</label>
          <input type="number" min="0" max="50" step="5" id="txCDR" @input="setCDR($event)" :value="cdr">
        </div>
        <div class="form-group">
          <label>Item Lvl</label>
          <input type="number" min="1" max="5" step="1">
        </div>

        <div class="seperator -y mr1"></div>

        <div class="form-group">
          <span class="switch">
            <label for="checkSkillDetails">
              <input id="checkSkillDetails" type="checkbox" v-model="showSkillDetails">
              <p>Show skill details</p>
              <span></span>
            </label>
          </span>
        </div>
        <div class="form-group">
          <span class="switch">
            <label for="checkMinionDetails">
              <input id="checkMinionDetails" type="checkbox" v-model="showMinionDetails">
              <p>Show minion details</p>
              <span></span>
            </label>
          </span>
        </div>
      </div>
    </div>
  </div>

  <div class="row">
    <aside class="col-4 maiden-overview-list">
      <table>
        <thead @contextmenu.prevent="$refs.colMenu.open">
          <th v-for="c in filteredHeroCols" :key="c.id" :class="c.dataField===sorting.col1?'hlCol':''" @click.middle.prevent="onColMiddleClick($event,c)" @click.left.exact="updateHeroesSort(c)">{{ c.caption }}</th>
        </thead>

        <tbody>
          <tr v-for="m in sortedMaidens" :key="m.id" :id="'m'+m.id" :class="['h'+m.sElement, selectedHeroIDs.includes(m.id)?'selected':'']" @click.exact="select(m)" @click.ctrl.exact="select(m,true)">
            <td v-for="col in profileColsObjects" :key="col.index" :class="sorting.col1===col.dataField?'hl'+m.sElement:''" :style="'text-align:'+(col.align || 'right')">
              <img v-if="col.dataField==='name'" :title="m.sClass" :src="getImage(m.sClass)" class="class-icon"><span>{{ m[col.displayField] }}</span></td>
          </tr>
        </tbody>

      </table>

    </aside>
    <div class="maiden-details-list">
      <hero-card :heroID="heroID" v-for="heroID in selectedHeroIDs" :key="heroID" class="maiden-details"></hero-card>
    </div>
  </div>

  <vue-context :closeOnClick="false" ref="colMenu" class="cm">
    <ul class="cm">
      <li v-for="col in heroCols" :key="col.id" @click="onCMClick(col)" class="cm" :class="col.val==='name'?'disabled':''">
        <span :style="{float:'left', opacity:profileCols.includes(col.caption)?1:0, marginRight:'.6em'}">{{ '✓' }}</span>
        {{ col.caption }}
      </li>
    </ul>
  </vue-context>

</div>
</template>

<script>
import HeroCard from './HeroCard';
import {
  mapState,
  mapGetters,
  mapMutations
} from 'vuex';
import {
  VueContext
} from 'vue-context';
import {
  heroImages
} from '../api/const.js';

export default {
  components: {
    VueContext,
    HeroCard,
  },


  data() {
    return {}
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
      selectedHeroIDs: state => state.heroes.selectedHeroIDs,
      heroColsProfiles: state => state.heroes.heroColsProfiles,
      profileName: state => state.heroes.selectedHeroColsProfile,
    }),
    ...mapGetters(['maidens', 'filteredHeroCols', 'items', 'heroCols']),

    profileCols() {
      const profileCols = this.heroColsProfiles.find(
        profile => profile.name === this.profileName);
      return profileCols ? profileCols.cols : null;
    },

    profileColsObjects() {
      /* using heroCols static order */
      return this.heroCols.filter(colObject =>
        this.profileCols.includes(colObject.caption)
      );
    },

    heroExtraAS: {
      get() {
        return this.$store.state.heroes.heroExtraAS;
      },
      set(val) {
        this.$store.commit('updateHeroExtraAS', parseFloat(val));
      },
    },

    showSkillDetails: {
      get() {
        return this.$store.state.heroes.showSkillDetails;
      },
      set(val) {
        this.$store.commit('updateShowSkillDetails', val);
      }
    },

    showMinionDetails: {
      get() {
        return this.$store.state.heroes.showMinionDetails;
      },
      set(val) {
        this.$store.commit('updateShowMinionDetails', val);
      }
    },

    computedMaidens(state) {
      const time = Date.now();
      const data = state.maidens.map(m => this.computeMaiden(m));
      console.log(`Maidens computed in ${Date.now()-time} ms.`);
      return data;
    },

    sortedMaidens(state) {
      return state.computedMaidens.sort(
        this.sortHeroesFunc(this.sorting.col1, this.sorting.col1Asc, this.sorting.col2, this.sorting.col2Asc)
      );
    },

  },

  methods: {
    ...mapMutations(['updateHeroColVisibility']),
    getImage(key) {
      return heroImages.get(key);
    },
    computeMaiden(maiden) {
      for (const col of this.heroCols) {
        if (col.dataField.startsWith('col')) {
          maiden[col.dataField] = col.val(maiden);
        }
        if (col.fmt) {
          maiden[col.displayField] = col.fmt(maiden, maiden[col.dataField]);
        }
      }
      return maiden;
    },
    sort(maidens, ...args) {
      return maidens.sort(this.sortHeroesFunc(...args));
    },
    setHeroLevel(event) {
      this.$store.dispatch('setHeroLevel', parseInt(event.target.value));
    },
    setSkillLevel(event) {
      this.$store.dispatch('setSkillLevel', parseInt(event.target.value));
    },
    setCDR(event) {
      this.$store.dispatch('setCDR', parseInt(event.target.value));
    },
    setCampLevel(event) {
      this.$store.dispatch('setCampLevel', parseInt(event.target.value));
    },
    setFilterClass(val) {
      this.$store.commit('updateFilterHeroClass', val);
    },
    setFilterElem(val) {
      this.$store.commit('updateFilterHeroElement', val);
    },
    onColMiddleClick(event, col) {
      event.stopPropagation();
      event.stopImmediatePropagation();
      event.preventDefault();
      this.updateHeroColVisibility({
        col: col.caption,
        visible: false,
        profileCols: this.profileCols,
      });
    },
    onCMClick(col) {
      this.updateHeroColVisibility({
        col: col.caption,
        visible: !this.profileCols.includes(col.caption),
        profileCols: this.profileCols,
      });
    },
    classIcon(hero) {
      return this.classImages[hero.class];
    },
    select(hero, multiSelect = false) {
      /* Normal clicks don't multi select.
        But if you click on a selected hero that is
        part of a multi select, it will deselect it. */
      if (!multiSelect) {
        if (this.selectedHeroIDs.length > 1 &&
          this.selectedHeroIDs.includes(hero.id)
        ) {
          return this.$store.commit('deselectMaidenID', hero.id);
        }
        this.$store.commit('deselectAllMaidenIDs');
      }
      if (!this.selectedHeroIDs.includes(hero.id)) {
        this.$store.commit('selectMaidenID', hero.id);
      }
    },

    ...mapMutations(['updateHeroColVisibility', 'computeMaidens', 'updateHeroesSort']),

    sortHeroesFunc: (field, asc, field2, asc2) => (a, b) => {
      if (a[field] !== b[field]) {
        if (asc) {
          [a, b] = [b, a];
        }
        return typeof a[field] === 'string' ?
          b[field].localeCompare(a[field]) :
          b[field] - a[field];
      } else {
        if (asc2) {
          [a, b] = [b, a];
        }
        return typeof a[field2] === 'string' ?
          b[field2].localeCompare(a[field2]) :
          b[field2] - a[field2];
      }
    },

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

.maiden-overview-list {
    float: left;
    margin: 0 1.2em;
}
.maiden-details-list {
    float: right;
    display: flex;
    flex-wrap: wrap;
    align-self: start;
}
.maiden-details {
    height: fit-content;
    box-shadow: rgb(119, 119, 119) 0.2em 0.2em 0.2em 0;
    margin: 0 1em 1em 0;
}

.filters {
    justify-content: center;
    * {
        margin-right: 0.6em;
        margin-top: 0.2em;
        font-size: 0.95em;
    }
    input,
    select {
        align-items: baseline;
    }
}

label {
    cursor: pointer;
}

.flex-row {
    display: flex;
    flex-direction: row;
}

.flex-col {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
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
.hWater {
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
    box-shadow: 0 0 8px 1px rgba(51, 51, 51, 0.5);
    cursor: default;
    white-space: nowrap;
    font-size: smaller;
    border-collapse: collapse;
    tfoot,
    thead {
        background-color: $p-light;
    }
    th {
        // position: sticky; top: 0;
        padding: 0.3em 0.1em 0.2em 0.4em;
        text-align: left;
        cursor: pointer;
        border: 1px solid $p-medium;
    }
    td {
        border: 1px solid $p-ml;
        padding: 0.1em 0.3em;
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
.class-icon {
    width: 18px;
    height: 18px;
    vertical-align: middle;
    margin-right: 0.2em;
}
body {
    margin: 0 !important;
    padding: 0 !important;
}
</style>
