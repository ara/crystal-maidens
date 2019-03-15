import Vue from 'vue';
import store from './store/index';
import VueRouter from 'vue-router';
import App from './App.vue';
import { routes } from './routes';
import './registerServiceWorker'

Vue.config.productionTip = false;

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: 'history',
});


var vm = new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router,
})

//vm.$mount('#app');
