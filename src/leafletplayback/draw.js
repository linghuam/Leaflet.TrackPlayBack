import L from 'leaflet'

L.Playback = L.Playback || {}

L.Playback.Draw = L.Class.extend({

  initialize: function (canvas, map) {
    this._canvas = canvas
    this._ctx = this._canvas.getContext('2d')
    this._map = map
  },

  drawPoint: function (latLng, radius) {
    radius = radius || 2
    var point = this._map.latLngToLayerPoint(latLng)
    this._ctx.beginPath()
    this._ctx.arc(point.x, point.y, radius, 0, Math.PI * 2, false)
    this._ctx.fill()
  },

  drawLine: function (startLatLng, endLatLng) {
  	var startPoint = this._map.latLngToLayerPoint(startLatLng)
  	var endPoint = this._map.latLngToLayerPoint(endLatLng)
    this._ctx.beginPath()
    this._ctx.moveTo(startPoint.x, startPoint.y)
    this._ctx.lineTo(endPoint.x, endPoint.y)
    this._ctx.stroke()
  },

  drawTrack: function (trackpoints) {
  	var tp0 = this._map.latLngToLayerPoint(L.latLng(trackpoints[0].lat, trackpoints[0].lng))
    this._ctx.beginPath() 
    // 画轨迹线
    this._ctx.moveTo(tp0.x, tp0.y)
    for(let i = 1, len = trackpoints.length; i < len; i++) {
      let tpi = this._map.latLngToLayerPoint(L.latLng(trackpoints[i].lat, trackpoints[i].lng))
      this._ctx.lineTo(tpi.x, tpi.y)
    }
    this._ctx.stroke();
    // 画经过的轨迹点
    for(let i = 0, len = trackpoints.length; i < len; i++) {
      this.drawPoint(L.latLng(trackpoints[i].lat, trackpoints[i].lng));
    }
  },

  color: function () {
    var gradient = this._ctx.createLinearGradient(0, 0, this._canvas.width, 0);
    gradient.addColorStop(0, '#f00');
    gradient.addColorStop(0.25, '#CC6633');
    gradient.addColorStop(0.5, '#FFFF00');
    gradient.addColorStop(0.75, '##B3EE3A');
    gradient.addColorStop(1, '#00f');
    this._ctx.fillStyle = gradient;
    this._ctx.strokeStyle = gradient;
  },

  clear: function () {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }
})
