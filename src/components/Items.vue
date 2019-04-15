<template>
  <div>
    <div class="options">
      <select v-model="classFilter" class="item">
        <option v-for="(sclass, index) in classes" :key="sclass" :value="index-1">{{ sclass }}</option>
      </select>
      <br>
    </div>
    <div class="container">
      <div v-for="slot in slots" :key="slot.caption" class="container">
        <table class="item">
          <thead>
            <th>{{ slot.caption }}</th>
          </thead>

          <tbody>
            <tr
              v-for="item in itemsBySlot(slot)" :key="item.key"
              :id="item.key"
              :class="['bg'+item.rarity, item.selected?'selected':'']"
              v-item-tooltip="{ item, direction:'right' }"
            >
              <td>
              <img :src="item.imageUrl" class="item-icon"
              ><span class="item-name">{{ item.name }}</span></td>
            </tr>
          </tbody>

        </table>
      </div>
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
      prevNode: null,
    }
  },

  computed: {
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
    filterItems (item) {
      return (this.classFilter===-1 || item.class === this.classFilter) &&
      (!this.maidenFilter || item.maiden === this.maidenFilter) &&
      (this.rarityFilter === -1 || item.rarity === this.rarityFilter);
    },
    itemsBySlot (slot) {
      return this[slot.var];
    },
  },

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

.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 5px;
}
.item {
  align-self: start;
  margin: 5px;
}

.row {
  display: flex;
  flex-direction: row;
}

.item-name {
  display:inline-flex;
  justify-self:flex-start;
}
.selected {
  outline: 2px solid #3c78d8;
  outline-offset: -1px;
}

table {
  box-shadow: 0px 0px 4px 0px rgba(51, 51, 51, 0.5);
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

</style>
