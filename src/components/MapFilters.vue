<template>
<div class="row">
  <div class="col-12">

    <div class="portlet">
      <span class="switch">
        <label>
          <input type="checkbox" v-model="fBossesOnly">
          <p>Bosses only</p>
          <span></span>
        </label>
      </span>

      <div class="form-group">
        <label for="crystals">Crystals</label>
        <select id="crystals" class="input" @input="fCrystal=$event.target.value" @mousewheel.passive="selectWheel($event,'fCrystal')">
          <option value="">All</option>
          <option value="Fire">Fire</option>
          <option value="Nature">Nature</option>
          <option value="Water">Water</option>
          <option value="Light">Light</option>
          <option value="Dark">Dark</option>
        </select>
      </div>

      <button :enabled="fCrystal" @click="fCrystal=''">Clear</button>

      <div class="form-group">
        <label for="cid">Maps</label>
        <select id="cid" class="input" @input="fCampaign=$event.target.value" @mousewheel.passive="selectWheel($event,'fCampaign')">
          <option value="-2">All</option>
          <option value="-1" selected>All Campaigns</option>
          <option v-for="c in campaigns" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>

      <div>
        <button v-for="col in colProfiles" :key="col.name" @click="applyColProfile(col)" :class="col.name===selectedProfileName?'selected':''">{{ col.name }}</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {
  mapState,
  mapGetters
} from 'vuex';

export default {
  data() {
    return {
      fCampaign: -1,
      fCrystal: '',
      fBossesOnly: false,
    }
  },

  watch: {
    fCampaign(val, oldVal) {
      this.$store.commit('updateFilterCampaign', val);
      this.$store.commit('updateCurrPage', 1);
    },
    fCrystal(val, oldVal) {
      this.$store.commit('updateFilterCrystal', val);
      this.$store.commit('updateCurrPage', 1);
    },
    fBossesOnly(val, oldVal) {
      this.$store.commit('updateFilterBossesOnly', val);
      this.$store.commit('updateCurrPage', 1);
    }
  },

  computed: {
    ...mapState({
      colProfiles: state => state.maps.colProfiles,
      selectedProfileName: state => state.maps.selectedProfileName,
    }),
    ...mapGetters(['maps', 'campaigns']),
  },

  methods: {
    applyColProfile(colProfile) {
      this.$store.dispatch('setColProfile', colProfile);
    },

    selectWheel(e, propName) {
      const options = e.target.options;
      const maxSel = options.length - 1;
      const prevSel = options.selectedIndex;
      const offset = e.deltaY > 0 ? 1 : -1;
      const newSel = Math.max(0, Math.min(maxSel, prevSel + offset));
      if (newSel !== prevSel) {
        this[propName] = options[newSel].value;
        options[newSel].selected = true;
      }
    },
  },


}
</script>

<style lang="scss" scoped>
.selected {
    background: linear-gradient(#f2f2f2,#da9);
    &:active {
        background: linear-gradient(#da9,#f2f2f2);
    }
}
</style>
