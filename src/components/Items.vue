<template>
  <div class="flex-row">
    <div>
      <select v-model="classFilter">
        <option v-for="(sclass, index) in classes" :key="sclass" :value="index-1">{{ sclass }}</option>
      </select>
    </div>
    <div v-for="slot in slots" :key="slot.caption">
      <table>
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
            :ref="item.key"
          >
            <td>
            <img :src="item.imageUrl" class="item-icon"
            ><span class="item-name">{{ item.name }}</span></td>
          </tr>
        </tbody>

      </table>
    </div>
    <div class="ttt" ref="tt" tt-pos="right"
      v-show="hoveredItem"
      @mouseover="hideTT($event)">
      <div class="tt-grid">
        <img :src="getBackground(hoveredItem)" class="tt-bg">
        <img :src="hoveredItem.imageUrl" class="tt-icon">
        <span class="tt-name">{{ hoveredItem.name }}</span>
        <span class="tt-type">{{ hoveredItem.sSlot }}  Level 5</span>
      </div>
      <ul class="tt-ul">
        <li v-if="has('hp')">
          <span class="tt-statname">Health</span>
          <span class="tt-stat">{{ getStat('hp') }}%</span>
        </li>
        <li v-if="has('dmg')">
          <span class="tt-statname">Damage</span>
          <span class="tt-stat">{{ getStat('dmg') }}%</span>
        </li>
        <li v-if="has('as')">
          <span class="tt-statname">Atk Speed</span>
          <span class="tt-stat">{{ getStat('as') }}</span>
        </li>
        <li v-if="has('crit')">
          <span class="tt-statname">Crit</span>
          <span class="tt-stat">{{ getStat('crit') }}%</span>
        </li>
        <li v-if="has('dodge')">
          <span class="tt-statname">Dodge</span>
          <span class="tt-stat">{{ getStat('dodge') }}%</span>
        </li>
        <li v-if="has('def')">
          <span class="tt-statname">Defense</span>
          <span class="tt-stat">{{ getStat('def') }}%</span>
        </li>
        <li v-if="has('cdr')">
          <span class="tt-statname">CDR</span>
          <span class="tt-stat">{{ getStat('cdr') }}%</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { SLOT, RARITY, CLASS, classes, bgItems } from '../api/const.js';

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
      hoveredItem: {},
      prevNode: null,
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
    classes () { return ['All','Unrestricted', ...classes.slice(1)]; },
  },

  methods: {
    getBackground (item) {
      return bgItems.get(item.rarity);
    },
    showTT (item, e) {
      if( item === this.hoveredItem && !this.$refs.tt.hidden ) return;
      this.hoveredItem = item;
      this.$nextTick( this.setTooltipPos );
    },
    hideTT (e) {
      this.$refs.tt.hidden = true;
    },
    setTooltipPos () {
      const tt = this.$refs.tt;
      this.$refs.tt.hidden = false;
        const item = this.hoveredItem;
      const tableRow = this.$refs[item.key][0];
      const table = tableRow.offsetParent;
      const maxWidth = window.innerWidth;
      const maxHeight = window.innerHeight;
      let x = table.offsetLeft + tableRow.offsetLeft;
      let y = table.offsetTop + tableRow.offsetTop;
        // show below ?
      //y += tableRow.clientHeight + 1;
        // show right ?
      x += tableRow.clientWidth + 1;
      // tooltip overflow right but not left if repositioned ?
      if( x + tt.clientWidth > maxWidth && x ) {
          const prevX = x;
        x -= tableRow.clientWidth + 1 + tt.clientWidth + 1;
        tt.setAttribute('tt-pos', 'left');
        } else {
        tt.setAttribute('tt-pos', 'right');
        }

      // center vertically
      y -= tt.clientHeight/2 - tableRow.clientHeight/2;

        tt.style.left = x +'px';
        tt.style.top = y + 'px';
    },
    has (stat) {
      return this.hoveredItem && this.hoveredItem[stat];
    },
    getStat (stat) {
      const base= this.hoveredItem[stat];
      const inc = this.hoveredItem[stat+'Inc'] || 0;
      return Math.round(1.45 * (base + inc * (this.hoveredItem.maxLevel-1)) * 10)/10;
    },
    filterItems (item) {
      return (this.classFilter===-1 || item.class === this.classFilter) &&
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
$epic: #b9a0e4;
$leg: #ffe599;
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

.ttt {
  // width: 270px;
  background-color: #eee;
  color: #555;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  transition: all .3 ease;
  border: 1px solid #777;
  max-width: 200px;
  box-shadow: 1px 1px 3px #0008;
  padding: 5px;
  animation: fade .3s ease;
}
.ttt::before {
  content: "";
  position:absolute;
  border-width: 10px 8px 0 8px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
  border-style: solid;
  animation: fade .3s ease;
}
@keyframes fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

[tt-pos='right'].ttt {
  margin-left: 10px;
}
[tt-pos='right']::before {
  // right: 100%;
  left: 0;
  top: 50%;
  margin-left: -14px;
  transform: translatey(-50%) rotate(90deg);
}


[tt-pos='left'].ttt {
  transform: translatex(-10px);
}
[tt-pos='left']::before {
  right: 0;
  margin-right: -14px;
  top: 50%;
  transform: translatey(-50%) rotate(-90deg);
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
  // white-space: nowrap;
}
.tt-type {
  grid-area: type;
  white-space: nowrap;
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
