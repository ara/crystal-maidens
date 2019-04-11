<template>
  <div class="flex-row">
    <div v-for="slot in slots.slice(1,3)" :key="slot.caption">
      <table style="position:relative" id="anchor">
        <thead>
          <th>{{ slot.caption }}</th>
        </thead>

        <tbody>
          <tr
            v-for="item in itemsBySlot(slot)" :key="item.key"
            :id="item.key"
            :class="['bg'+item.rarity, item.selected?'selected':'', 'tt']"
            @mouseover="showTT(item,$event)"
            @mouseleave="hideTT($event)"
          >
            <td>
            <img :src="item.imageUrl" class="item-icon"
            ><span class="item-name">{{ item.name }}</span></td>
          </tr>
        </tbody>

        <tfoot>
          <tr>
            <div></div>
          </tr>
        </tfoot>
      </table>

    </div>
      <div id="tp" class="ttt" v-show="tparg" @mouseenter="$event.target.hidden=true">
          <div class="tt-grid">
            <img :src="getBackground(tparg)" class="tt-bg">
            <img :src="tparg.imageUrl" class="tt-icon">
            <span class="tt-name">{{ tparg.name }}</span>
            <span class="tt-type">{{ tparg.sSlot }}  Level 5</span>
  </div>
          <ul class="tt-ul">
            <li v-if="show('hp')">
              <span class="tt-statname">Health</span>
              <span class="tt-stat">{{ getStat('hp') }}%</span>
            </li>
            <li v-if="show('dmg')">
              <span class="tt-statname">Damage</span>
              <span class="tt-stat">{{ getStat('dmg') }}%</span>
            </li>
            <li v-if="show('as')">
              <span class="tt-statname">Atk Speed</span>
              <span class="tt-stat">{{ getStat('as') }}</span>
            </li>
            <li v-if="show('crit')">
              <span class="tt-statname">Crit</span>
              <span class="tt-stat">{{ getStat('crit') }}%</span>
            </li>
            <li v-if="show('dodge')">
              <span class="tt-statname">Dodge</span>
              <span class="tt-stat">{{ getStat('dodge') }}%</span>
            </li>
            <li v-if="show('def')">
              <span class="tt-statname">Defense</span>
              <span class="tt-stat">{{ getStat('def') }}%</span>
            </li>
            <li v-if="show('cdr')">
              <span class="tt-statname">CDR</span>
              <span class="tt-stat">{{ getStat('cdr') }}%</span>
            </li>
          </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { SLOT, RARITY, CLASS } from '../api/const.js';

export default {
  data () {
    return {
      slots: [
        { caption:'Head', var:'filteredHeadItems' },
        { caption:'Chest', var:'filteredChestItems' },
        { caption:'Main Hand', var:'filteredMainHandItems' },
        { caption:'Off Hand', var:'filteredOffHandItems' },
        { caption:'Feet', var:'filteredFeetItems' },
        { caption:'Neck', var:'filteredNeckItems' },
      ],
      classFilter: CLASS.MARKSMAN,
      maidenFilter: 0,
      rarityFilter: -1,
    }
  },

  computed: {
    ...mapState({
      // items: state => state.items.items,
    }),
    ...mapGetters(['items','headItems','chestItems','mainHandItems','offHandItems','feetItems','neckItems']),
    filteredHeadItems () { return this.headItems.filter( this.filterItems ); },
    filteredChestItems () { return this.chestItems.filter( this.filterItems ); },
    filteredMainHandItems () { return this.mainHandItems.filter( this.filterItems ); },
    filteredOffHandItems () { return this.offHandItems.filter( this.filterItems ); },
    filteredFeetItems () { return this.feetItems.filter( this.filterItems ); },
    filteredNeckItems () { return this.neckItems.filter( this.filterItems ); },
  },

  methods: {
    showTT (item, e) {
      const tt = document.getElementById('tp');
      if( !tt ) return;
      this.tparg = item;
      for( const el of e.path ) {
        if( el.tagName !== 'TR' ) continue;
        const table = el.parentNode.parentNode;
        let x = table.offsetLeft + el.offsetLeft;
        let y = table.offsetTop + el.offsetTop;
        
        if( x + el.offsetWidth + table.offsetWidth > window.innerWidth ) {
          // it overflows right, display on left side instead
          x -= el.offsetWidth;
        } else {
          x += table.offsetWidth;
        }

        console.log( y + el.offsetHeight, window.innerHeight )
        if( y + el.offsetHeight > window.innerHeight ) {
          y -= window.innerHeight - y - el.offsetHeight;
        }

        tt.style.left = x +'px';
        tt.style.top = y + 'px';
        tt.hidden = false;
      }
    },
    hideTT (e) {
      const tt = document.getElementById('tp');
      if( !tt ) return;
      tt.hidden = true;
    },
    show (stat) {
      // console.log(stat, this.tparg && this.tparg[stat]);
      return this.tparg && this.tparg[stat];
    },
    filterItems (item) {
      return (!this.classFilter || item.class === this.classFilter) &&
      (!this.maidenFilter || item.maiden === this.maidenFilter) &&
      (this.rarityFilter === -1 || item.rarity === this.rarityFilter);
    },
    itemsBySlot (slot) {
      return this[slot.var];
    },
  }

}
</script>

<style lang="scss" scoped>

$p-dark: #333;
$p-medium: #777;
$p-ml: #bbb;
$p-light: #eee;

$common: #eee;
$rare: #a4c2f4;
$rare2: rgb(112, 157, 247);
$epic3: #bd9ff0;
$epic2: #aa97da;
$epic: #b9a0e4;
$leg: #ffe599;
$set3: #8e8;
$set2: rgb(126, 214, 126);
$set: #73ce73;

.bg0 { background-color: $common; }
.bg1 { background-color: $rare; }
.bg2 { background-color: $epic; }
.bg3 { background-color: $leg; }
.bg4 { background-color: $set; }

.item-name {
  display:inline-flex;
  justify-self:flex-start;
}
.selected {
  outline: 2px solid #3c78d8;
  outline-offset: -1px;
}

table {
  box-shadow: 0px 0px 8px 1px rgba(51, 51, 51, 0.5);
  cursor: default;
  margin-left: .5em;
  white-space: nowrap;

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
    padding: 0 .2em .1em;
    &:first-child {
      border-left-color: $p-medium;
    }
    &:last-child {
      border-right-color: $p-medium;
    }
    text-align: left;
  }

  tr {
    &:last-child td {
      border-bottom-color: $p-medium;
    }
  }
}
.item-icon {
  width: 18px;
  height: 18px;
  margin-right: .2em;
  vertical-align: text-bottom;
}

/* Tooltip text */
.ttt {
  // visibility: hidden;
  // width: 120px;
  background-color: #eee;
  color: #555;
  padding: 5px;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  // transition: hidden .3 ease;
}

li {
  display: table-row;
}
.tt-ul {
  display:table-row;
}


.tt-grid{
  display: grid;
  grid-column-gap: .5em;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto;
  grid-template-areas:"icon name"
                      "icon type";
}
.tt-bg {
  grid-area: icon;
  width: 64px;
  height: 64px;
}
.tt-icon {
  grid-area: icon;
  justify-self: center;
  align-self: center;
  width: 48px;
  height: 48px;
}
.tt-name {
  grid-area: name;
}
.tt-type {
  grid-area: type;
}

.tt-statname {
  display: table-cell;
  // width: 6em;
  text-align: right;
  font-size: 1em;
  margin-left: .4em;
}
.tt-stat {
  display: table-cell;
  width: 4em;
  font-size: .95em;
  text-align: right;
}
</style>
