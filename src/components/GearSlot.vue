<template>
  <div
    class="container"
    @click="onSlotClicked($event)"
    @mouseenter="showTT($event, maiden)"
    @mouseleave="hideTT($event)"
  >
    <img :src="uiImages.get('empty_slot_'+slot)" alt="itemSlots[slot]">
  </div>
</template>

<script>
import { itemSlots, SLOT, RARITY, CLASS, uiImages } from "../api/const.js";

export default {
  props: {
    slot: Number,
    maiden: Object
  },

  methods: {
    onSlotClicked(e) {},
    showTT(e, maiden) {},
    hideTT(e) {}
  }
};
</script>

<style lang="scss" scoped>
.container {
  cursor: pointer;
  background-image: url("../assets/ui/bg_item_slot.png");
}
</style>
