<template>
  <div id="app">
    <app-header></app-header>
    <router-view>
    </router-view>
  </div>
</template>

<script>
import Header from './components/Header';
export default {
  components: {
    appHeader: Header
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
  :focus {
    outline-color: #2c3e50 !important;
  }
  a:not(:visited) {
    color:#2b2;
  }
  a:visited {
    color: #777;
  }
}
</style>
