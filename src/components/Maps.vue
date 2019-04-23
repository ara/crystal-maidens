<template>
  <div class="grid">
    <MapFilters/><br><br>
    <!-- <link href="http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet"> -->
    <table class="maps" @mousewheel.passive="wheelOnTable($event)">
      <thead @contextmenu.prevent="$refs.colMenu.open">
        <th
          v-for="(c,i) in filteredCols"
          :key="i"
          @click.middle.exact.prevent="onColMiddleClick($event,c)"
          @click.left.ctrl="updateMapsSort([c.val,$event]);currPage=1"
          @click.left.shift="updateMapsSort([c.val,$event]);currPage=1"
          @click.left.exact="updateMapsSort([c.val,$event]);currPage=1"
          :class="i==filteredCols.length-1?'longth':''"
        >{{ c.caption }}<span
          :class="sortArrowClasses(c.val)" class="sort-arrow"
          >{{ sortArrow(c.val) }}</span>
        </th>
      </thead>
      <tbody style="">
        <tr
          v-for="m in computeMaps( sortedMaps.slice((currPage-1)*maxEntries, currPage*maxEntries) )"
          :key="m.id"
          :class="campaignClass(m)"
        >
          <td
            v-for="col in profileColsObjects"
            :key="col.index"
            :style="'text-align:'+(col.align||'right')"
          >
            <span>{{ m[col.displayField] }}</span>
          </td>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <td :colspan="filteredCols.length">
            <div class="pagingContainer">

                <div/><div/>

                <div>
                  <button @click="currPage--" :disabled="currPage<=1">
                    <b>◄</b>
                  </button>
                  <input type="text" size="1" v-model="currPage" >
                  <span >/ {{ lastPage }}</span>
                  <button @click="currPage++" :disabled="currPage>=lastPage">
                    <b>►</b>
                  </button>
                </div>

                <div>
                  <div style="transform: scaleY(.7);float:left">
                  <input style="width:6em;vertical-align:top;margin-top:auto"
                    type=range min=1 :max=lastPage value=1 v-model=currPage>
                  </div>

                </div>
                  <div>
                  <div class="align-items:flex-end">
                    <span style="font-size:smaller">Items per page</span>
                    <select v-model="maxEntries">
                      <option v-for="v in [10,20,30,40,50]" :key="v.id">{{ v }}</option>
                    </select>
                  </div>
                </div>

            </div>
          </td>
        </tr>
      </tfoot>
    </table>
    <vue-context :closeOnClick="false" ref="colMenu" class="cm">
      <ul class="cm">
        <li v-for="col in mapCols" :key="col.index"
          @click="onCMClick(col)"
          class="cm"
          :class="col.val==='name'?'disabled':''"
        >
          <span :style="{float:'left', opacity:profileCols.includes(col.val)?1:0, marginRight:'.6em'}"
          >{{ '✓' }}</span>
          {{ col.caption }}
        </li>
      </ul>
    </vue-context>
  </div>
</template>

<script>
import MapFilters from './MapFilters';
import { mapState, mapGetters, mapMutations } from 'vuex';
import { VueContext } from 'vue-context';
// import VueSimpleContextMenu from 'vue-simple-context-menu';

export default {

  computed: {
    ...mapState({
      sorting: state => state.maps.sorting,
      profileName: state => state.maps.selectedProfileName,
    }),

    ...mapGetters(['lastPage','maps','filteredCols','mapCols']),

    profileCols () {
      const profileCols = this.$store.state.maps.colProfiles.find(
        profile => profile.name === this.profileName );
      return profileCols ? profileCols.cols : null;
    },

    profileColsObjects () {
      console.log('pcols:', this.profileCols );
      return this.profileCols.map( profileColName => {
        return this.mapCols.find( colObject => profileColName === colObject.val )
      });
    },

    computedMaps () {
      const time = Date.now();
      const data = this.maps.map( m => this.computeMap(m, this.mapCols) );
      console.log(`Maps computed in ${Date.now()-time} ms.`);
      return data;
    },

    sortedMaps (state) {
      const s = this.sorting;
      return state.maps.sort(
        this.sortMapsFunc( s.col1, s.col1Asc, s.col2, s.col2Asc )
      );
    },

    currPage: {
      get () {
        return this.$store.state.maps.currPage;
      },
      set (val) {
        this.$store.commit('updateCurrPage', val);
      },
    },

    maxEntries: {
      get () {
        return this.$store.state.maps.maxEntries;
      },
      set (val) {
        this.$store.commit('updateMaxEntries', val);
        this.currPage = 1;
      }
    },
  },

  methods: {
    computeMap (map) {
      for( const col of this.mapCols ) {
        if( col.dataField.startsWith('col') ) {
          map[col.dataField] = col.val(map);
        }
        if( col.fmt ) {
          map[col.displayField] = col.fmt( map[col.dataField], map );
        }
      }
      return map;
    },

    computeMaps (maps) {
      const time = Date.now();
      const data = maps.map( this.computeMap );
      console.log(`Maps computed in ${Date.now()-time} ms.`);
      return data;
    },

    onColMiddleClick(event, col) {
      this.updateColVisibility( {
        col: col.val,
        visible: false,
        profileCols: this.profileCols,
      } );
    },
    onCMClick(col) {
      this.updateColVisibility( {
        col: col.val,
        visible: !this.profileCols.includes(col.val),
        profileCols: this.profileCols
      } );
    },

    ...mapMutations(['updateMapsSort','updateColVisibility']),

    sortArrow (col) {
      const asc = '▲';
      const desc = '▼';
      switch( col ) {
        case this.sorting.col1: return this.sorting.col1Asc ? asc : desc;
        case this.sorting.col2: return this.sorting.col2Asc ? asc : desc;
        default: return asc;
      }
    },
    sortArrowClasses (col) {
      return col === this.sorting.col1
        ? 'sort1'
        : col === this.sorting.col2
          ? 'sort2'
          : 'nosort'
    },
    campaignClass (map) {
      return map.campaignID < 2000 && map.campaignID % 1000 < 10 ? map.name.substr(0,2)+map.name[3] : 'CXX';
    },
    wheelOnTable (e) {
      this.currPage += e.wheelDelta > 0 ? -1 : 1;
    },

    sortMapsFunc: (field, asc, field2, asc2) => (a,b) => {
      if( a[field] !== b[field] ) {
        if( asc ) { [a, b] = [b, a]; }
        return typeof a[field] === 'string'
          ? a[field].localeCompare( b[field] )
          : b[field] - a[field];
      } else {
        if( asc2 ) { [a, b] = [b, a]; }
        return typeof a[field2] === 'string'
          ? a[field2].localeCompare( b[field2] )
          : b[field2] - a[field2];
      }
    },

  },

  components: {
    VueContext,
    MapFilters,
    // VueSimpleContextMenu,
  },

}
</script>


<style lang="scss" scoped>

$p-dark: #333;
$p-medium: #777;
$p-ml: #bbb;
$p-light: #eee;

.pagingContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding-top: 2px;
  vertical-align: baseline;

  > div {
    flex:1;
    * {
      margin-left: .6em;
    }
  }
  span {
    font-size: smaller;
  }
  .float-right {
    float: right;
  }
}

.fill {
  width:-webkit-fill-available;
  width:-moz-available;
}

.disabled {
    pointer-events:none; //This makes it not clickable
    opacity:0.6;         //This grays it out to look disabled
}

.update-enter-active {
    transition: all .5s ease-in;
}
.update-leave-active {
    transition: all .5s ease-out;
}
.update-enter, .update-leave-to {
    opacity: .5;
    background-color: #fd0;
}

.maps {
  background-color: $p-medium;
  box-shadow: 0px 0px 8px 1px rgba(51, 51, 51, 0.5);
  cursor: default;
}

table {
  background-color: $p-dark;
  display: inline-block;
  white-space: pre;
  vertical-align: top;
  border-spacing: 1px;
  table-layout: auto;

  // tbody tr:hover {
  //   outline: 3px solid #3c78d8;
  // }

  thead, tfoot {
    background-color: $p-light;
  }

  th {
    padding: .3em .1em .2em .4em;
    text-align: left;
    width: auto;
    cursor: pointer;

    .sort-arrow {
      float: right;
    }
    .nosort {
      opacity: 0;
    }
    .sort1 {
      /* color: black; */
      opacity: 1;
    }
    .sort2 {
      /* color: #aaa; */
      opacity: .4;
    }
  }

  td {
    padding: .15em .35em;
  }
}


.longth {
  white-space: pre-line;
}

.C1E {
  background-color: #fff2cc;
}
.C1H {
  background-color: #fce5cd;
}
.C2E {
  background-color: #ead1dc;
}
.C2H {
  background-color: #d9d2e9;
}
.C3E {
  background-color: #d0e0e3;
}
.C3H {
  background-color: #d9ead3;
}
.CXX {
  background-color: #ddd;
}

body {
  margin: 0 !important;
  padding: 0 !important;
}

a {
  color: #42b983;
}

</style>
