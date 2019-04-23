import { mapState, mapGetters } from 'vuex';

export default {

  computed: {
    ...mapState({
      gearItems: state => state.items.gearItems,
    }),
    ...mapGetters(['baseItems']),
    
  },

  methods: {
    fieldFromGearItem (gearItem, field) {
      const baseItem = this.baseItems[gearItem.itemID];
      return baseItem ? baseItem[field] : '';
    },
    
  }
}
