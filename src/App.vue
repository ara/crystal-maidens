<template>
  <div id="app">
    <app-header></app-header>
      <app-item-tooltip></app-item-tooltip>
    <keep-alive>
      <router-view>
      </router-view>
    </keep-alive>
  </div>
</template>

<script>
import Header from './components/Header';
import ItemTooltip from './components/ItemTooltip';

export default {
  components: {
    appHeader: Header,
    appItemTooltip: ItemTooltip,
  },
}
</script>

<style lang="scss">
@import './assets/css/main.scss';


.r0 { border-color: $common; }
.r1 { border-color: $rare; }
.r2 { border-color: $epic; }
.r3 { border-color: $leg; }

</style>
