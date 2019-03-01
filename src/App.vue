<template>
  <div id="app">
    <MapFilters/><br>
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

<style>
.vue-simple-context-menu {
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  display: none;
  list-style: none;
  position: absolute;
  z-index: 1000000;
  background-color: #ECF0F1;
  border-bottom-width: 0px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  box-shadow: 0 3px 6px 0 rgba(51, 51, 51, 0.2);
  border-radius: 4px;
}
.vue-simple-context-menu--active {
    display: block;
}
.vue-simple-context-menu__item {
    display: flex;
    color: #333;
    cursor: pointer;
    padding: 5px 15px;
    align-items: center;
}
.vue-simple-context-menu__item:hover {
      background-color: #007AFF;
      color: #fff;
}
.vue-simple-context-menu li:first-of-type {
    margin-top: 4px;
}
.vue-simple-context-menu li:last-of-type {
    margin-bottom: 4px;
}


#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
