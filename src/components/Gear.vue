<template>
  <div class="wrapper">
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
.wrapper {
  display: flex;
  flex-direction: column;
}
.item {
  justify-content: space-evenly;
}
</style>
