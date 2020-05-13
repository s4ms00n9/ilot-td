<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <span>Demo</span>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content id="content">
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
<style scoped>
html {
  overflow-y: auto !important;
}
#content {
  margin: 0 auto;
}
</style>
