import Vue from 'vue';
import store from './store/index';
import VueRouter from 'vue-router';
import App from './App.vue';
import { routes } from './routes';
import './registerServiceWorker'
import tooltipDirective from './directives/tooltip-directive';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(tooltipDirective);

const router = new VueRouter({
  routes,
  mode: 'history',
  base: process.env.BASE_URL,
});


var vm = new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router,
  beforeCreate() {
    // load store from localStorage
    this.$store.commit('loadStore');
  },
  mounted() {
    // save store changes to localStorage
    this.$store.commit('watchStore');
  }
})

//vm.$mount('#app');
