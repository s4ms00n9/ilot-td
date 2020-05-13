import Vue from 'vue'
import Vuex from 'vuex'
import originalMapData from './assets/zadanie-telemetria.json';
import originalChartData from './assets/zadanie-wykres.json';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    originalChartData,
    originalMapData
  },
  getters: {
    chartData(state) {
      return JSON.parse(JSON.stringify(state.originalChartData).replace(/\s(?=\w+":)/g, ""));
    },
    mapData(state) {
      return state.originalMapData.filter(d => d.Latitude !== 0 && d.Longitude !== 0);
    }
  },
  mutations: {
  },
  actions: {
  }
})
