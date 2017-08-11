<template>
  <div id="leaflet-map"></div>
</template>

<script>
import L from 'leaflet'
import '../assets/leaflet.googlelayer'
import '../control.playback/control.playback'
import Data from '../assets/data/3.json'

export default {
  data () {
    return {
      map: null
    }
  },
  mounted () {
    this.initMap()
  },
  methods: {
    initMap () {
      this.map = L.map('leaflet-map').setView([34, 133], 8)
      L.tileLayer.GoogleLayer().addTo(this.map)
      L.control.playback({
        data: Data
      }).addTo(this.map)
    }
  }
}

</script>

<style lang="scss" scoped>
@import url('http://cdn.bootcss.com/leaflet/1.0.0-rc.3/leaflet.css');
#leaflet-map {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

</style>
