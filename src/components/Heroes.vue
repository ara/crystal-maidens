<template>
<div class="contain">
  <div class="row">
    <!-- REVIEW: Structure change: TableFilter + Table in col-4 -->
    <div class="col-4">
      <div class="flex">
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
          <div class="form-group">
            <label>Enemy Element</label>
            <select class="input">
              <option v-for="ele in ['Normal','Fire','Nature','Water','Light','Dark']" :key="ele.id">{{ ele }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="portlet p0 overflow-a flexible-height">
        <table>
          <thead @contextmenu.prevent="$refs.colMenu.open">
            <th v-for="c in filteredHeroCols" :key="c.id"
              :class="{'hlCol': c.dataField===sorting.col1}"
              @click.middle.prevent="onColMiddleClick($event,c)"
              @click.left.exact="updateHeroesSort(c)"
            >{{ c.caption }}</th>
          </thead>
          <tbody>
            <tr
              v-for="m in sortedMaidens"
              :key="m.id"
              :id="'m'+m.id"
              :class="[ 'h'+m.sElement, { 'selected': selectedHeroIDs.includes(m.id) }]"
              @click.exact="select(m)"
              @click.ctrl.exact="select(m,true)"
            >
              <td v-for="col in profileColsObjects" :key="col.index"
                :class="{ ['hl'+m.sElement]: sorting.col1===col.dataField }"
                :style="'text-align:'+(col.align || 'right')"
              >
              <img v-if="col.dataField==='name'" :title="m.sClass"
                :src="getImage(m.sClass)" class="class-icon"
              ><span>{{ m[col.displayField] }}</span></td>
            </tr>
          </tbody>

        </table>
      </div>
    </div>

    <!-- REVIEW: Structure change: HeroConfig + HeroCard in col-8 -->
    <div class="col-8 p0">
      <div class="portlet m0_5">
        <div class="portlet-block">
          <div class="form-group col-4">
            <label for="txCamp">Camp Lvl</label>
            <input type="number" min="0" max="15" step="1" id="txCamp" @input="setCampLevel($event)" :value="campLevel">
          </div>
          <div class="form-group col-4">
            <label for="txHeroLevel">Maiden Lvl</label>
            <input type="number" min="1" max="85" id="txHeroLevel" @input="setHeroLevel($event)" :value="heroLevel">
          </div>
          <div class="form-group col-4">
            <label for="txSkillLevel">Skill Lvl</label>
            <input type="number" min="1" max="29" id="txSkillLevel" @input="setSkillLevel($event)" :value="skillLevel">
          </div>
        </div>
        <div class="portlet-block">
          <div class="form-group col-4">
            <label for="txHeroAS" @click="$store.commit('updateHeroExtraAS',0)">Atk Spd test</label>
            <input type="number" min="0" max="1000" step="20" id="txHeroAS" v-model="heroExtraAS">
          </div>
          <div class="form-group col-4">
            <label for="txCDR">CDR(%)</label>
            <input type="number" min="0" max="50" step="5" id="txCDR" @input="setCDR($event)" :value="cdr">
          </div>
          <div class="form-group col-4">
            <label>Item Lvl</label>
            <input type="number" min="1" max="5" step="1">
          </div>
        </div>
        <div class="portlet-block">
          <div class="form-group col-6">
            <span class="switch">
              <label for="checkSkillDetails">
                <input id="checkSkillDetails" type="checkbox" v-model="showSkillDetails">
                <p>Show skill details</p>
                <span></span>
              </label>
            </span>
          </div>
          <div class="form-group col-6">
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
      <hero-card :heroID="heroID" v-for="heroID in selectedHeroIDs" :key="heroID"></hero-card>
    </div>
  </div>

    <vue-context :closeOnClick="false" ref="colMenu" class="cm">
      <ul class="cm">
        <li v-for="col in heroCols" :key="col.id"
          @click="onCMClick(col)"
          class="cm"
          :class="{ disabled: col.val==='name' }"
        >
          <span :style="{float:'left', opacity:profileCols.includes(col.caption)?1:0, marginRight:'.6em'}"
          >{{ '✓' }}</span>
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
        return typeof a[field] === 'string'
          ? b[field].localeCompare(a[field])
          : b[field] - a[field];
      } else {
        if (asc2) {
          [a, b] = [b, a];
        }
        return typeof a[field2] === 'string'
          ? b[field2].localeCompare(a[field2])
          : b[field2] - a[field2];
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

// $darkenBy: 5%;

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

</style>
