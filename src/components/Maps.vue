<template>
  <div class="grid">
    <!-- <link href="http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet"> -->
    <table class="maps" @mousewheel.passive="wheelOnTable($event)">
      <thead @contextmenu.prevent="$refs.colMenu.open">
        <th
          v-for="(c,i) in filteredCols"
          :key="i"
          @click.middle.prevent="onColMiddleClick($event,c)"
          @click.left.ctrl="columnClicked([c.col,$event]);currPage=1"
          @click.left.shift="columnClicked([c.col,$event]);currPage=1"
          @click.left="columnClicked([c.col,$event]);currPage=1"
          :class="i==filteredCols.length-1?'longth':''"
        >{{ c.name }}<span
          :class="sortArrowClasses(c.col)" class="sort-arrow"
          >{{ sortArrow(c.col) }}</span>
        </th>
      </thead>
      <tbody style="">
        <tr
          v-for="m in maps.slice((currPage-1)*maxEntries, currPage*maxEntries)"
          :key="m.id"
          :class="campaignClass(m)"
        >
          <td
            v-for="(c,i) in filteredCols"
            :key="i"
            :style="'text-align:'+(c.align||'right')"
          >
            <span>{{ formatMapCell(m,c) }}</span>
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
        <li v-for="col in mapCols" :key="col.col"
          @click="onCMClick(col)"
          class="cm"
        >
          <span :style="{float:'left', opacity:col.hidden?0:1}"
          >{{ '✓' }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
          {{ col.name }}
        </li>
      </ul>
    </vue-context>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import { VueContext } from 'vue-context';
// import VueSimpleContextMenu from 'vue-simple-context-menu';

export default {

  computed: {
    ...mapState({
      mapCols: state => state.maps.mapCols,
      sortedCol1: state => state.maps.sortedCol1,
      sortedCol1Asc: state => state.maps.sortedCol1Asc,
      sortedCol2: state => state.maps.sortedCol2,
      sortedCol2Asc: state => state.maps.sortedCol2Asc,
    }),

    ...mapGetters(['lastPage','maps','filteredCols']),

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
    onColMiddleClick(event, col) {
      this.updateColVisibility( { col, visible:false } );
    },
    onCMClick(col) {
      this.updateColVisibility( { col, visible:col.hidden } );
    },

    formatMapCell(map,col) {
      let cell = map[col.col];
      if( col.func ) {
        cell = col.func(cell);
      }
      return cell;
    },

    ...mapMutations(['columnClicked','updateColVisibility']),

    sortArrow (col) {
      const asc = '▲';
      const desc = '▼';
      switch( col ) {
        case this.sortedCol1: return this.sortedCol1Asc ? asc : desc;
        case this.sortedCol2: return this.sortedCol2Asc ? asc : desc;
        default: return asc;
      }
    },
    sortArrowClasses (col) {
      return col === this.sortedCol1
        ? 'sort1'
        : col === this.sortedCol2
          ? 'sort2'
          : 'nosort'
    },
    campaignClass (map) {
      return map.campaignID < 2000 && map.campaignID % 1000 < 10 ? map.name.substr(0,2)+map.name[3] : 'CXX';
    },
    wheelOnTable (e) {
      this.currPage += e.wheelDelta > 0 ? -1 : 1;
    },
  },

  components: {
    VueContext,
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
  padding-top: 4px;
  vertical-align: baseline;

  > div {
    flex:1;
    * {
      margin-left: 8px;
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

.cm {
  width: auto !important;
  font-size: 14px;
  font-weight: 600;
  ul {
    padding: 0px !important;
    color: $p-dark;
    background-color: $p-light;
    li {
      padding: 4px 8px !important;
      &:hover {
        background: $p-medium !important;
        color: $p-light !important;
      }
    }
    li + li {
      border-top: 1px solid $p-ml;
    }
  }
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
