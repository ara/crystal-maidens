<template>
  <ul class="navContainer">
    <li><router-link to='/'>Home</router-link></li>
    <li><router-link to='/Maps'>Maps</router-link></li>
    <li><router-link to="/Maidens">Maidens</router-link></li>
  </ul>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.navContainer {
  display: inline-flex;
  list-style: none;
  > * {
    margin: 0 20px;
  }
}
</style>
