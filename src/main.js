import Vue from 'vue';
import App from './App.vue';

import { store } from './store/store';

Vue.config.productionTip = false;

var vm = new Vue({
  render: function (h) { return h(App) },
  store
}).$mount('#app');

global.vm = vm;
