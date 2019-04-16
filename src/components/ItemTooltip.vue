<template>
  <div class="tt" ref="tt" tt-pos="right" id="item-tooltip" v-show="hoveredItem" @mouseover="hideTT($event)" hidden>
    <div class="tt-grid">
      <img :src="getBackground(hoveredItem)" class="tt-bg">
      <img :src="hoveredItem ? hoveredItem.imageUrl:''" class="tt-icon">
      <span class="tt-name">{{ hoveredItem ? hoveredItem.name : '' }}</span>
      <span class="tt-type">{{ hoveredItem ? hoveredItem.sSlot : '' }} Level 5</span>
    </div>
    <ul>
      <li v-if="has('hp')">
        <span class="tt-statname">Health</span>
        <span class="tt-stat">{{ getStat('hp') }}%</span>
      </li>
      <li v-if="has('dmg')">
        <span class="tt-statname">Damage</span>
        <span class="tt-stat">{{ getStat('dmg') }}%</span>
      </li>
      <li v-if="has('as')">
        <span class="tt-statname">Atk Speed</span>
        <span class="tt-stat">{{ getStat('as') }}</span>
      </li>
      <li v-if="has('crit')">
        <span class="tt-statname">Crit</span>
        <span class="tt-stat">{{ getStat('crit') }}%</span>
      </li>
      <li v-if="has('dodge')">
        <span class="tt-statname">Dodge</span>
        <span class="tt-stat">{{ getStat('dodge') }}%</span>
      </li>
      <li v-if="has('def')">
        <span class="tt-statname">Defense</span>
        <span class="tt-stat">{{ getStat('def') }}%</span>
      </li>
      <li v-if="has('cdr')">
        <span class="tt-statname">CDR</span>
        <span class="tt-stat">{{ getStat('cdr') }}%</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { bgItems } from '../api/const.js';
import { hideTT as hideTooltip } from '../api/itemTooltip.js';

export default {
  computed: {
    ...mapState(['hoveredItem'])
  },

  methods: {
    getBackground(item) {
      return item ? bgItems.get(item.rarity) : null;
    },
    has(stat) {
      return this.hoveredItem && this.hoveredItem[stat];
    },
    hideTT(event) {
      event._tt = this.$refs.tt;
      hideTooltip(event);
    },
    getStat(stat) {
      const base = this.hoveredItem[stat];
      const inc = this.hoveredItem[stat + 'Inc'] || 0;
      return (
        Math.round(1.45 * (base + inc * (this.hoveredItem.maxLevel - 1)) * 10) /
        10
      );
    }
  },

};
</script>

<style lang="scss" scoped>
.tt, .tt::before {
  position: absolute;
  animation: fade-in 0.3s ease;
}
.tt {
  cursor: default;
  background-color: #eee;
  color: #555;
  border-radius: 6px;
  border: 1px solid #777;
  max-width: 200px;
  box-shadow: 1px 1px 3px #0008;
  padding: 5px;
}
.tt::before {
  content: "";
  border-width: 10px 8px 0 8px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
  border-style: solid;
}
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.tt-fade-out,
.tt-fade-out::before {
  animation: fade-out 0.3s ease forwards;
}
@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

[tt-pos="right"].tt {
  margin-left: 10px;
}
[tt-pos="right"]::before {
  // right: 100%;
  left: 0;
  top: 50%;
  margin-left: -14px;
  transform: translatey(-50%) rotate(90deg);
}

[tt-pos="left"].tt {
  transform: translatex(-10px);
}
[tt-pos="left"]::before {
  right: 0;
  margin-right: -14px;
  top: 50%;
  transform: translatey(-50%) rotate(-90deg);
}
ul, li {
  display: table-row;
}

.tt-grid {
  display: grid;
  grid-column-gap: 0.5em;
  grid-template-areas:
    "icon name"
    "icon type";
}
.tt-bg {
  grid-area: icon;
  width: 64px;
  height: 64px;
}
.tt-icon {
  grid-area: icon;
  justify-self: center;
  align-self: center;
  width: 48px;
  height: 48px;
}
.tt-name {
  grid-area: name;
  // white-space: nowrap;
}
.tt-type {
  grid-area: type;
  white-space: nowrap;
}

.tt-statname {
  display: table-cell;
  // width: 6em;
  text-align: right;
  font-size: 1em;
  margin-left: 0.4em;
}
.tt-stat {
  display: table-cell;
  width: 4em;
  font-size: 0.95em;
  text-align: right;
}
</style>
