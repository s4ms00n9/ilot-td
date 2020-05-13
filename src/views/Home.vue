<template>
  <div>
    <v-tabs centered>
      <v-tab
        v-for="tab in tabs"
        :key="tab.name"
        :to="{ name: tab.name }"
        exact
      >
        {{ tab.name }}
      </v-tab>
    </v-tabs>
    <router-view />
  </div>
</template>

<script>
  import DemoChart from '../components/DemoChart'
  import DemoMaps from '../components/DemoMaps'

  export default {
    data: () => ({
      tabs: [
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
    })
  }
</script>
<style scoped>
</style>
