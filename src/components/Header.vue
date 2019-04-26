<template>
  <ul class="navContainer">
    <router-link to='/' tag="li" exact exact-active-class="active">Home</router-link>
    <router-link to='/maps' tag="li" active-class="active">Maps</router-link>
    <router-link to="/maidens" tag="li" active-class="active">Maidens</router-link>
    <router-link to="/items" tag="li" active-class="active">Items</router-link>
  </ul>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.navContainer {
  margin: .3em auto 1em;
  display: inline-flex;
  list-style: none;
  > * {
    margin: 0 10px;
  }
}
li {
  cursor: pointer;
  text-decoration: none;
  border: 1px solid #777;
  border-radius: .3em;
  padding: .3em;
  background: #eee;
  width: 6em;
  &.active {
    // background: #fd0;
    background: #888;
    color: white;
  }
}
</style>
