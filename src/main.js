import Vue from 'vue';
import store from './store/index';
import VueRouter from 'vue-router';
import App from './App.vue';
import { routes } from './routes';
import './registerServiceWorker'
import { showTT, hideTT } from './api/itemTooltip.js';

Vue.config.productionTip = false;

Vue.use(VueRouter);
const router = new VueRouter({
  routes,
  mode: 'history',
  base: process.env.BASE_URL,
});


var vm = new Vue({
  // el: '#app',
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

Vue.directive('item-tooltip', // bind + update func
  function (el, binding, vnode, context) {
    if( !context.store ) {
      context.store = store;
      context.vm = store._vm;
    }
    el.addEventListener('mouseenter', (e) => {
      showTT(e, el, binding, context, vnode);
    });
    el.addEventListener('mouseleave', (e) => hideTT(e, el, binding, context) );
  }
);

vm.$mount('#app');
