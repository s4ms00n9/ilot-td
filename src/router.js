import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import DemoChart from './components/DemoChart'
import DemoMaps from './components/DemoMaps'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '',
          name: 'Chart',
          component: DemoChart
        },
        {
          path: 'leaflet',
          name: 'Leaflet',
          component: DemoMaps
        }
      ]
    }
  ]
})
