<template>
  <div id="app">
    <leaflet-map></leaflet-map>
  </div>
</template>

<script>
import LeafletMap from './components/leafletmap'

export default {
  name: 'app',
  components: {
    LeafletMap
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
