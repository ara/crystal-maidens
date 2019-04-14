<template>
  <div class="container">
    <app-gear-slot v-for="slot in SLOT" :key="slot" maiden="maiden" class="item"></app-gear-slot>
  </div>
</template>

<script>
import GearSlot from "./GearSlot";
import { mapState } from "vuex";
import { SLOT } from "../api/const.js";

export default {
  props: {
    maiden: Object
  },

  components: {
    "app-gear-slot": GearSlot
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
}
.item {
  justify-content: space-evenly;
}
</style>
