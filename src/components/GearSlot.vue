<template>
  <div
    class="container2"
    @click="onSlotClicked($event)"
    v-on-clickaway="onClickOutside"
  >
    <img class="item-background" :src="itemBackgroundUrl">
    <img
      class="item-icon"
      :src="itemIcon"
    >
    <div v-if="listLoaded" class="item-list" :id="itemListID">
      <div v-show="displayList">
      <gear-slot-item-list
        :itemSlot="itemSlot"
        :maiden="maiden"
        :currentItem="item"
      ></gear-slot-item-list>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { SLOT, RARITY, CLASS, uiImages, bgItems } from '../api/const.js';
import { maxHeaderSize } from 'http';
import { onClickaway } from '../directives/v-on-clickaway.js';

export default {
  directives: {
    onClickaway,
  },

  components: {
    'gear-slot-item-list': () => import('./GearSlotItemList'),
  },

  props: {
    itemSlot: {
      type: Number,
      required: true,
    },
    maiden: {
      type: Object,
      required: true,
    },
    item: {
      type: Object,
      required: false,
    },
  },

  data: () => {
    return {
      listLoaded: false,
      displayList: false,
    }
  },

  computed: {
    baseItem () { return this.item ? this.$store.getters.baseItems[this.item.itemID] : null; },
    itemListID () { return `m${this.maiden.id}s${this.itemSlot}` },
    itemBackgroundUrl () {
      return this.item
        ? bgItems.get(this.item.rarity)
        : uiImages.get('bg_item_slot')
    },
    itemIcon() {
      return this.item
        ? this.baseItem.imageUrl
        : uiImages.get('empty_slot_' + this.itemSlot)
    }
  },

  methods: {
    onClickOutside (event) {
      this.displayList = false;
    },
    ...mapMutations(['setActiveItemList']),
    onSlotClicked(e) {
      this.listLoaded = true;
      this.displayList = !this.displayList;
      if( this.displayList ) {
        document.getElementById('item-tooltip').hidden = true;
      }
    },
  },

};
</script>

<style lang="scss" scoped>
.hide-item-list {
  display: none;
}
.container2 {
  position: relative;
  cursor: pointer;
  background-size: contain;
  background-repeat: no-repeat;
  width: 39px;
  height: 39px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: .05em;
  &:hover > .item-background,
  &:hover > .item-icon {
    transform: scale(1.1);
  }
}
.item-list {
  position: absolute;
  left: 38px;
  top: 0;
}

.item-background {
  position: relative;
  width: 100%;
  height: 100%;
}

.empty-icon,
.item-icon {
  position: absolute;
  align-self: center;
}

.item-icon {
  width: 75%;
  height: 75%;
}
</style>
