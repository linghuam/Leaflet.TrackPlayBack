import L from 'leaflet'

L.Playback = L.Playback || {}

L.Playback.Draw = L.Class.extend({

  initialize: function (trackLayer, map) {
    this._trackLayer = trackLayer
    this._canvas = this._trackLayer.getContainer()
    this._ctx = this._canvas.getContext('2d')
    this._map = map
    this._bufferTracks = []
    this._trackPointFeatureGroup = L.featureGroup([]).addTo(this._map)
    this._trackLayer.on('update', this.trackLayerDraw, this)
    this._map.on('mousemove', this.onmousemoveEvt, this)
    this.trackPointOptions = {
          stroke: false,
          color: '#ef0300',
          fillColor: '#ef0300',
          fillOpacity: 1,
          radius: 4,
          renderer: L.svg()
    }
  },

  onmousemoveEvt: function (e) {
    var point = e.layerPoint
    if(this._bufferTracks.length) {
      for(let i = 0, leni = this._bufferTracks.length; i < leni; i++) {
        for(let j = 0, len = this._bufferTracks[i].length; j < len; j++) {
          let tpoint = this._map.latLngToLayerPoint(L.latLng(this._bufferTracks[i][j].lat, this._bufferTracks[i][j].lng))
          if(point.distanceTo(tpoint) <= 5) {
            this.OpenPopup(this._bufferTracks[i][j])
            return;
          }
        }
      }
    }
  },

  OpenPopup: function (trackpoint) {
    var latlng = L.latLng(trackpoint.lat, trackpoint.lng)
    var tooltip = L.tooltip(this.getTooltipOptions())
    tooltip.setTooltipContent(this.getTooltipText(trackpoint))
    tooltip.openTooltip(latlng)
    tooltip.addTo(this._map)
  },

  trackLayerDraw: function () {
    if(this._bufferTracks.length) {
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
      this._trackPointFeatureGroup.clearLayers()
      this._bufferTracks.forEach(function (element, index) {
        this.drawTrack(element, false)
      }.bind(this));
    }
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

  drawTrack: function (trackpoints, isbuffer) {
    if(isbuffer === undefined) isbuffer = true
    if(isbuffer) this._bufferTracks.push(trackpoints)
    // 画轨迹线
    this.drawTrackLine(trackpoints)
    // 画船
    this.drawShip(trackpoints[trackpoints.length - 1])
    // 画经过的轨迹点
    this.drawTrackPoints(trackpoints)
  },

  drawTrackLine: function (trackpoints) {
    var tp0 = this._map.latLngToLayerPoint(L.latLng(trackpoints[0].lat, trackpoints[0].lng))
    this._ctx.save()
    this._ctx.beginPath()
    // 画轨迹线
    this._ctx.moveTo(tp0.x, tp0.y)
    for(let i = 1, len = trackpoints.length; i < len; i++) {
      let tpi = this._map.latLngToLayerPoint(L.latLng(trackpoints[i].lat, trackpoints[i].lng))
      this._ctx.lineTo(tpi.x, tpi.y)
    }
    this._ctx.stroke()
    this._ctx.restore()
  },

  drawTrackPoints: function (trackpoints) {
    this._ctx.save()
    for(let i = 0, len = trackpoints.length; i < len; i++) {
      if(trackpoints[i].isOrigin) {
        let latLng = L.latLng(trackpoints[i].lat, trackpoints[i].lng)
        let radius = 2
        let point = this._map.latLngToLayerPoint(latLng)
        this._ctx.beginPath()
        this._ctx.arc(point.x, point.y, radius, 0, Math.PI * 2, false)
        this._ctx.fill()
      }
    }
    this._ctx.restore()
  },

  drawTrackPoints2: function (trackpoints) {
    for(let i = 0, len = trackpoints.length; i < len; i++) {
      if(trackpoints[i].isOrigin) {
        let latLng = L.latLng(trackpoints[i].lat, trackpoints[i].lng)
        let cricleMarker = L.circleMarker(latLng, this.trackPointOptions)
        cricleMarker.bindTooltip(this.getTooltipText(trackpoints[i]), this.getTooltipOptions())
        this._trackPointFeatureGroup.addLayer(cricleMarker)
      }
    }
  },

  getTooltipText: function (targetobj) {
    var content = [];
    content.push('<table>');
    content.push('<tr><td>批号:</td><td>' + targetobj.info_ph + '</td></tr>');
    content.push('<tr><td>经度:</td><td>' + targetobj.info_lng + '</td></tr>');
    content.push('<tr><td>纬度:</td><td>' + targetobj.info_lat + '</td></tr>');
    content.push('<tr><td>时间:</td><td>' + targetobj.info_time + '</td></tr>');
    content.push('<tr><td>航向:</td><td>' + targetobj.info_dir + '</td></tr>');
    content.push('<tr><td>航艏向:</td><td>' + targetobj.info_heading + '</td></tr>');
    content.push('<tr><td>航速:</td><td>' + targetobj.info_speed + '</td></tr>');
    content.push('</table>');
    content = content.join('');
    return content;
  },

  getTooltipOptions: function () {
    return {
      offset: [0, 0],
      direction: 'top',
      permanent: false
    };
  },

  drawShip: function (trackpoint) {
    var point = this._map.latLngToLayerPoint(L.latLng(trackpoint.lat, trackpoint.lng))
    var rotate = trackpoint.dir
    var w = 12
    var h = 24
    var dh = h / 3

    this._ctx.save()
    this._ctx.fillStyle = '#f00'
    this._ctx.strokeStyle = '#00f'
    this._ctx.translate(point.x, point.y)
    this._ctx.rotate((Math.PI / 180) * rotate)
    this._ctx.beginPath()
    this._ctx.moveTo(0, 0 - h / 2)
    this._ctx.lineTo(0 - w / 2, 0 - h / 2 + dh)
    this._ctx.lineTo(0 - w / 2, 0 + h / 2)
    this._ctx.lineTo(0 + w / 2, 0 + h / 2)
    this._ctx.lineTo(0 + w / 2, 0 - h / 2 + dh)
    this._ctx.closePath()
    this._ctx.fill()
    this._ctx.stroke()
    this._ctx.restore()
  },

  drawShip2: function (trackpoint) {
    var point = this._map.latLngToLayerPoint(L.latLng(trackpoint.lat, trackpoint.lng))
    var dir = trackpoint.dir
    var width = 12
    var height = 25
    var offset = {
      x: width / 2,
      y: height / 2
    }
    var img = new Image()
    img.onload = function () {
      this._ctx.save()
      this._ctx.translate(point.x, point.y)
      this._ctx.rotate((Math.PI / 180) * dir)
      this._ctx.drawImage(img, 0 - offset.x, 0 - offset.y, width, height)
      this._ctx.restore()
    }.bind(this)
    img.src = '../../static/images/ship.png'
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

  removeLayer: function () {
    if (this._map.hasLayer(this._trackLayer)){
      this._map.removeLayer(this._trackLayer)
    }
    if (this._map.hasLayer(this._trackPointFeatureGroup)) {
      // this._trackPointFeatureGroup.clearLayers()
      this._map.removeLayer(this._trackPointFeatureGroup)
    }
  },

  clear: function () {
    var bounds = this._trackLayer.getBounds()
    if(bounds) {
      var size = bounds.getSize();
      this._ctx.clearRect(bounds.min.x, bounds.min.y, size.x, size.y);
    } else {
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
    if (this._map.hasLayer(this._trackPointFeatureGroup)) {
      this._trackPointFeatureGroup.clearLayers()
    }
    this._bufferTracks = []
  }
})
