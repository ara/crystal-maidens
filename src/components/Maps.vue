<template>
  <div class="grid">
    <!-- <link href="http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet"> -->
    <table class="maps" @mousewheel.passive="wheelOnTable($event)">
      <thead @contextmenu.prevent="$refs.colMenu.showMenu($event)">
        <th
          v-for="(c,i) in filteredCols"
          :key="i"
          @click="columnClicked([c.col,$event]);currPage=1"
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
            :style="'text-align:'+c.align"
          >
            <span>{{ c.func ? c.func( m[c.col]) : m[c.col] }}</span>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td :colspan="filteredCols.length">
          <table class="paging">
            <tr>
              <td style="align:right"></td>
              <td>
                <div>
                  <button @click="currPage--" :disabled="currPage<=1">
                    <b>◄</b>
                  </button>
                  <input type="text" size="1" v-model="currPage" >
                  <span style="vertical-align:middle">/ {{ lastPage }}</span>
                  <button @click="currPage++" :disabled="currPage>=lastPage">
                    <b>►</b>
                  </button>
                </div>
                <div style="transform: scaleY(.7)">
                  <input type=range min=1 :max=lastPage value=1 v-model=currPage>
                </div>
              </td>
              <td><span>TEST</span></td>
            </tr>
          </table>
          </td>
        </tr>
      </tfoot>
    </table>
    <vue-simple-context-menu
      elementId="colMenu"
      :options="mapCols"
      ref="colMenu"
      @option-clicked="optionClicked">
    </vue-simple-context-menu>
  </div>
</template>

<script>
import { mapGetters, mapSetters, mapMutations, mapState } from 'vuex';
import VueSimpleContextMenu from 'vue-simple-context-menu';

export default {
  data () {
    return {
      //
    }
  },

  computed: {
    ...mapState(['maxEntries','mapCols','vip','sortedCol1','sortedCol1Asc','sortedCol2','sortedCol2Asc']),
    ...mapGetters(['lastPage','maps', 'filteredCols']),
    currPage: {
      get () {
        return this.$store.state.currPage;
      },
      set (val) {
        this.$store.commit('updateCurrPage', val);
      },
    },
  },

  methods: {
    ...mapMutations(['columnClicked']),
    sortArrow (col) {
      const asc = '▲';
      const desc = '▼';
      switch( col ) {
        case this.sortedCol1: return this.sortedCol1Asc ? asc : desc;
        case this.sortedCol2: return this.sortedCol2Asc ? asc : desc;
        default: return asc;
      }
    },
    sortArrowClasses (col,cc2) {
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
    optionClicked (event, item) {
      this.$set( event.option, 'hidden', !event.option.hidden );
    },
  },

  components: {
    VueSimpleContextMenu,
  },

}
</script>

<style lang="scss" scoped>
$p-medium: #777;
$p-light: #eee;
$p-dark: #333;

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
thead,
tfoot {
  background-color: $p-light;
}
tfoot>div,span,input,button {
  margin-left: 8px;
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
  .paging {
    background-color: $p-light;
  }
}
td {
  padding: .2em .4em;
}
th {
  padding: .3em .1em .2em .4em;
  text-align: left;
  width: auto;
}

.longth {
  white-space: pre-line;
}
.footer {
  display: flex;
  /* flex-basis: 33%; */
}
b.footer {
  font-size: 13px;
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
.left {
  text-align: left;
}
.right {
  text-align: right;
}
.center {
  text-align: center;
}
body {
    margin: 0 !important;
    padding: 0 !important;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
