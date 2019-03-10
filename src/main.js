import Vue from 'vue';
import store from './store/index';
import App from './App.vue';
import './registerServiceWorker'


Vue.config.productionTip = false;

var vm = new Vue({
  el: '#app',
  render: function (h) { return h(App) },
  store
})

//vm.$mount('#app');
