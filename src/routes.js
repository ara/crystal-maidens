import Home from './components/Home.vue'
import Maps from './components/Maps.vue'
import Heroes from './components/Heroes.vue'

export const routes = [
  { path: '', component: Home },
  { path: '/maps', component: Maps },
  { path: '/maidens', component: Heroes },
];
