<template>
  <div class="wrapper">

    <app-gear-slot
      v-for="slot in 6" :key="slot"
      :maiden="maiden" :itemSlot="slot-1"
      :item="gearItemFromSlot(slot-1)"
      v-item-tooltip="{ itemID: gearIDFromSlot(slot-1) }"
    ></app-gear-slot>
  </div>
</template>

<script>
import GearSlot from './GearSlot';
import { mapMutations } from 'vuex';

export default {
  props: {
    maiden: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    // maidenItems: null,
  }),

  computed: {
    maidenItems () {
      return this.maidenGear
        .map( gearItemID => this.gearItems[gearItemID] );
    },
    maidenGear () {
      return this.$store.state.items.maidensGear[this.maiden.id];
    },
    gearItems () {
      return this.$store.state.items.gearItems;
    },
    baseItems () {
      return this.$store.getters.baseItems;
    }
  },


  methods: {
    // ...mapMutations(['initMaidenGear']),
    gearItemFromSlot (slot) {
      return this.maidenItems[slot];
    },
    gearIDFromSlot (slot) {
      const gearItem = this.maidenItems[slot];
      return gearItem ? gearItem.id : 0;
    },
  },

  components: {
    'app-gear-slot': GearSlot
  },

  created () {
    if( !this.$store.state.items.maidensGear[this.maiden.id] ) {
      this.$store.commit('initMaidenGear', this.maiden.id);
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
