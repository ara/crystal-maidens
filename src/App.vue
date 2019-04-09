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

$common: #a87;
$rare: #36c;
$epic: #d4d;
$leg: #dc0;
$set: #0c0;

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

.flex-row {
  display: flex;
  flex-direction: row;
}
.flex-col {
  display: flex;
  flex-direction: column;
}

button {
  // background: linear-gradient(#eee,#ddd);
  background: linear-gradient(#f2f2f2,#dcdcdc);
  border: 1px solid #999;
  padding: .15em .5em;
  &:active {
    background: linear-gradient(#dcdcdc,#f2f2f2);
  }
  &:hover {
    border-color: #777;
  }
  &:focus {
    outline: 0;
  }
}


.slide-fade-enter-active
{
  transition: all .3s ease;
}
// .slide-fade-leave-active {
//   transition: opacity .3s ease;
// }
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.r0 { border-color: $common; }
.r1 { border-color: $rare; }
.r2 { border-color: $epic; }
.r3 { border-color: $leg; }

</style>
