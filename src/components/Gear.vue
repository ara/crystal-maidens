<template>
  <div class="wrapper">

    <app-gear-slot
      v-for="slot in 6" :key="slot"
      :maiden="maiden" :itemSlot="slot-1"
      :item="getItem(slot-1)"
      v-item-tooltip="{ item: getItem(slot-1) }"
    ></app-gear-slot>
  </div>
</template>

<script>
import GearSlot from './GearSlot';
import { mapMutations } from 'vuex';

export default {
  props: {
    maiden: Object
  },

  data: () => ({
    // maidenGear: null,
  }),

  computed: {
    maidenGear () {
      return this.$store.state.maidensGear[this.maiden.id];
    }
  },

  methods: {
    ...mapMutations(['initMaidenGear']),
    getItem (slot) {
      return this.maidenGear ? this.maidenGear[slot] : null;
    },
  },

  components: {
    'app-gear-slot': GearSlot
  },

  created () {
    if( !this.$store.state.maidensGear[this.maiden.id] ) {
      this.initMaidenGear(this.maiden.id);
    }
  },
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
