<template>
  <table ref="table">
    <tbody>
      <tr
        v-for="item in itemList" :key="item.id"
        :id="'item'+item.id"
        :class="['bg' + item.rarity, currentItem && item.id === currentItem.id ? 'selected' : '']"
        v-item-tooltip="{ itemID:item.id, direction:'right' }"
        @click="equip(item)"
      >
        <td>
        <img :src="fieldFromGearItem(item,'imageUrl')" class="item-icon"
        ><span class="item-name">{{ fieldFromGearItem(item,'name') }}</span></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import { SLOT, bgItems } from '../api/const.js';

export default {
  props: {
    itemSlot: {
      type: Number,
      required: true,
    },
    maiden: {
      type: Object,
      required: true,
    },
    fnHide: {
      type: Function,
      required: true,
    },
    currentItem: {
      type: Object,
      required: false,
    }
  },

  computed: {
    ...mapState({
      gearItems: state => state.items.gearItems,
    }),
    ...mapGetters(['baseItems']),
    itemList () {
      const t = Date.now();
      const items = [];
      for( const key in this.gearItems ) {
        const item = this.gearItems[key];
        const baseItem = this.baseItems[item.itemID];
        if( (baseItem.slot === this.itemSlot) &&
          (baseItem.class === this.maiden.class) &&
          (!baseItem.maiden || baseItem.maiden === this.maiden.id)
        ) {
          items.push(item);
        }
      }
      console.log(`itemList computed in ${Date.now()-t} ms.`);
      return items;
      // return this.items.filter( i =>
        // (i.slot === this.itemSlot) &&
        // (i.class === this.maiden.class) &&
        // (!i.maiden || i.maiden === this.maiden.id)
      // );
    },
  },

  methods: {
    ...mapMutations(['equipItem']),
    fieldFromGearItem (gearItem, field) {
      const baseItem = this.baseItems[gearItem.itemID];
      return baseItem ? baseItem[field] : '';
    },
    equip (gearItem) {
      console.log(
        '[GSIL equip()] maidenID:', this.maiden.id,
        '\nitemSlot:', this.itemSlot,
        '\nitem.id:', gearItem.id
      );
      this.equipItem({
        maidenID: this.maiden.id,
        slot: this.itemSlot,
        itemID: gearItem.id
      });
      console.log('[GSIL equip()] maide\'s gear:', this.$store.state.items.maidensGear[this.maiden.id],);
    },
  },

  created () {
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

.item-name {
  display:inline-flex;
  justify-self:flex-start;
}
.selected {
  outline: 3px solid #3c78d8;
  outline-offset: -1px;
}

table {
  z-index: 1;
  box-shadow: 2px 2px 2px 0px rgba(51, 51, 51, 0.5);
  cursor: default;
  margin-left: .5em;
  white-space: nowrap;

  font-size: smaller;
  vertical-align: top;

  border-collapse: collapse;
  border-spacing: 0px;

  tfoot, thead {
    background-color: $p-light;
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
