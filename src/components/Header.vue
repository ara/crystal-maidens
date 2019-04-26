<template>
  <header class="header">
    <router-link class="header-logo" to='/' tag="h1" exact exact-active-class="active">
      <i class="material-icons">home</i>
    </router-link>
    <nav class="header-nav-group">
      <router-link to='/maps' tag="li" active-class="active">Maps</router-link>
      <router-link to="/maidens" tag="li" active-class="active">Maidens</router-link>
      <router-link to="/items" tag="li" active-class="active">Items</router-link>
    </nav>
  </header>
</template>

<script>
export default {

}
</script>
