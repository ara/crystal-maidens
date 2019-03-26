<template>
  <div id="app">
    <app-header></app-header>
    <keep-alive>
    <router-view>
    </router-view>
    </keep-alive>
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

$p-dark: #333;
$p-medium: #777;
$p-ml: #bbb;
$p-light: #eee;

.cm {
  width: auto !important;
  font-size: 14px;
  font-weight: 600;
  ul {
    padding: 0px !important;
    color: $p-dark;
    background-color: $p-light;
    li {
      padding: 4px 8px !important;
      &:hover {
        background: $p-medium !important;
        color: $p-light !important;
      }
    }
    li + li {
      border-top: 1px solid $p-ml;
    }
  }
}

</style>
