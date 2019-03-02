<template>
  <div style="display:inline-block;">
    <span>{{ maps.length }} maps</span><br>
    <label><span>Bosses only</span>
      <input type="checkbox" v-model="fBossesOnly"><br>
    </label>
    <label for="crystals">Crystals</label>
    <select id="crystals"
      @input="fCrystal=$event.target.value"
      @mousewheel.prevent="selectWheel($event,'fCrystal')">
      <option value="">All</option>
      <option value="Dark">Dark</option>
      <option value="Fire">Fire</option>
      <option value="Light">Light</option>
      <option value="Nature">Nature</option>
      <option value="Water">Water</option>
    </select>
    <button
      :enabled="fCrystal"
      @click="fCrystal=''"
    >Clear</button><br>
    <label for="cid">Maps</label>
    <!-- <select id="cid" v-model="filterCampaign"
      @mousewheel.prevent="selectWheel($event,'filterCampaign')"> -->
    <select id="cid"
      @input="fCampaign=$event.target.value"
      @mousewheel.prevent="selectWheel($event,'fCampaign')"
    >
      <option value="">All</option>
      <option value="-1" selected>All Campaigns</option>
      <option v-for="c in campaigns" :key="c.id"
        :value="c.id">{{ c.name }}</option>
    </select>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data () {
    return {
      fCampaign: -1,
      fCrystal: '',
      fBossesOnly: false,
    }
  },

  watch: {
    fCampaign (val, oldVal) {
      this.$store.commit('updateFilterCampaign', val);
      this.$store.commit('updateCurrPage', 1);
    },
    fCrystal (val, oldVal) {
      console.log('fCrystal watcher', val, oldVal);
      this.$store.commit('updateFilterCrystal', val);
      this.$store.commit('updateCurrPage', 1);
    },
    fBossesOnly (val, oldVal) {
      this.$store.commit('updateFilterBossesOnly', val);
      this.$store.commit('updateCurrPage', 1);
    }
  },

  computed: {
    ...mapGetters(['maps','filteredCols','campaigns']),
  },

  methods: {
    campaignSelected (e) {
      console.log(e);
      //this.fCampaign = $event.target.value
    },
    selectWheel (e, propName) {
      const options = e.target.options;
      const maxSel = options.length-1;
      const prevSel = options.selectedIndex;
      const offset = e.deltaY > 0 ? 1 : -1;
      const newSel = Math.max(0, Math.min(maxSel, prevSel+offset));
      if( newSel !== prevSel ) {
        this[propName] = options[newSel].value;
        options[newSel].selected = true;
      }
    },
  },
}
</script>

<style scoped>
* {
  margin-left: 8px;
  box-sizing: border-box;
}
</style>
