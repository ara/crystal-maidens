<template>
  <div id="app">
    <MapFilters/><br><br>
    <Maps headers="headers"/>
  </div>
</template>

<script>
import Maps from './components/Maps.vue'
import MapFilters from './components/MapFilters'

export default {
  name: 'app',
  data () {
    return {
      //
    }
  },
  components: {
    Maps,
    MapFilters,
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
}
</style>
