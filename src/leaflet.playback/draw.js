import L from 'leaflet'
import {TrackLayer} from './tracklayer'

export var Draw = L.Class.extend({

  options: {
    trackPointOptions: {
      useCanvas: true,
      stroke: false,
      color: '#ef0300',
      fill: true,
      fillColor: '#ef0300',
      radius: 4
    },
    trackLineOptions: {
      stroke: true,
      color: '#1C54E2', // stroke color
      weight: 2,
      fill: false,
      fillColor: '#000'
    },
    shipOptions: {
      useImg: false,
      imgUrl: '../../static/images/ship.png',
      width: 12,
      height: 24,
      color: '#00f', // stroke color
      fillColor: '#9FD12D'
    },
    toolTipOptions: {
      offset: [0, 0],
      direction: 'top',
      permanent: false
    }
  },

  initialize: function (map, options) {
    L.setOptions(this, options)
    this._map = map
    this._trackLayer = new TrackLayer().addTo(map)
    this._canvas = this._trackLayer.getContainer()
    this._ctx = this._canvas.getContext('2d')
    this._bufferTracks = []
    this._trackPointFeatureGroup = L.featureGroup([]).addTo(map)

    this._trackLayer.on('update', this._trackLayerUpdate, this)
    this._map.on('mousemove', this._onmousemoveEvt, this)
  },

  _trackLayerUpdate: function () {
    if (this._bufferTracks.length) {
      this._clearLayer()
      this._bufferTracks.forEach(function (element, index) {
        this._drawTrack(element, false)
      }.bind(this));
    }
  },

  _onmousemoveEvt: function (e) {
    var point = e.layerPoint
    if (this._bufferTracks.length) {
      for (let i = 0, leni = this._bufferTracks.length; i < leni; i++) {
        for (let j = 0, len = this._bufferTracks[i].length; j < len; j++) {
          let tpoint = this._map.latLngToLayerPoint(L.latLng(this._bufferTracks[i][j].lat, this._bufferTracks[i][j].lng))
          if (point.distanceTo(tpoint) <= this.options.trackPointOptions.radius) {
            this._opentoolTip(this._bufferTracks[i][j])
            return;
          }
        }
      }
    }
    if (this._map.hasLayer(this._tooltip)) {
      this._map.removeLayer(this._tooltip)
    }
    this._canvas.style.cursor = 'pointer'
  },

  _opentoolTip: function (trackpoint) {
    if (this._map.hasLayer(this._tooltip)) {
      this._map.removeLayer(this._tooltip)
    }
    this._canvas.style.cursor = 'default'
    var latlng = L.latLng(trackpoint.lat, trackpoint.lng)
    var tooltip = this._tooltip = L.tooltip(this.options.toolTipOptions)
    tooltip.setLatLng(latlng)
    tooltip.addTo(this._map)
    tooltip.setContent(this.getTooltipText(trackpoint))
  },

  _drawTrack: function (trackpoints) {
    // 画轨迹线
    this._drawTrackLine(trackpoints)
    // 画船
    if (this.options.shipOptions.useImg) {
      this._drawShip2(trackpoints[trackpoints.length - 1])
    } else {
      this._drawShip(trackpoints[trackpoints.length - 1])
    }
    // 画经过的轨迹点
    if (this.options.trackPointOptions.useCanvas) {
      this._drawTrackPoints(trackpoints)
    } else {
      this._drawTrackPoints2(trackpoints)
    }
  },

  drawTrack: function (trackpoints) {
    this._bufferTracks.push(trackpoints)
    // 画轨迹线
    this._drawTrackLine(trackpoints)
    // 画船
    if (this.options.shipOptions.useImg) {
      this._drawShip2(trackpoints[trackpoints.length - 1])
    } else {
      this._drawShip(trackpoints[trackpoints.length - 1])
    }
    // 画经过的轨迹点
    if (this.options.trackPointOptions.useCanvas) {
      this._drawTrackPoints(trackpoints)
    } else {
      this._drawTrackPoints2(trackpoints)
    }
  },

  _drawTrackLine: function (trackpoints) {
    var options = this.options.trackLineOptions
    var tp0 = this._map.latLngToLayerPoint(L.latLng(trackpoints[0].lat, trackpoints[0].lng))
    this._ctx.save()
    this._ctx.beginPath()
    // 画轨迹线
    this._ctx.moveTo(tp0.x, tp0.y)
    for (let i = 1, len = trackpoints.length; i < len; i++) {
      let tpi = this._map.latLngToLayerPoint(L.latLng(trackpoints[i].lat, trackpoints[i].lng))
      this._ctx.lineTo(tpi.x, tpi.y)
    }
    if (options.stroke) {
      this._ctx.strokeStyle = options.color
      this._ctx.lineWidth = options.weight
      this._ctx.stroke()
    }
    if (options.fill) {
      this._ctx.fillStyle = options.fillColor
      this._ctx.fill()
    }
    this._ctx.restore()
  },

  _drawTrackPoints: function (trackpoints) {
    var options = this.options.trackPointOptions
    this._ctx.save()
    for (let i = 0, len = trackpoints.length; i < len; i++) {
      if (trackpoints[i].isOrigin) {
        let latLng = L.latLng(trackpoints[i].lat, trackpoints[i].lng)
        let radius = options.radius
        let point = this._map.latLngToLayerPoint(latLng)
        this._ctx.beginPath()
        this._ctx.arc(point.x, point.y, radius, 0, Math.PI * 2, false)
        if (options.stroke) {
          this._ctx.strokeStyle = options.color
          this._ctx.stroke()
        }
        if (options.fill) {
          this._ctx.fillStyle = options.fillColor
          this._ctx.fill()
        }
      }
    }
    this._ctx.restore()
  },

  _drawTrackPoints2: function (trackpoints) {
    for (let i = 0, len = trackpoints.length; i < len; i++) {
      if (trackpoints[i].isOrigin) {
        let latLng = L.latLng(trackpoints[i].lat, trackpoints[i].lng)
        let cricleMarker = L.circleMarker(latLng, this.options.trackPointOptions)
        cricleMarker.bindTooltip(this.getTooltipText(trackpoints[i]), this.options.toolTipOptions)
        this._trackPointFeatureGroup.addLayer(cricleMarker)
      }
    }
  },

  _drawShip: function (trackpoint) {
    var point = this._map.latLngToLayerPoint(L.latLng(trackpoint.lat, trackpoint.lng))
    var rotate = trackpoint.dir || 0
    var w = this.options.shipOptions.width
    var h = this.options.shipOptions.height
    var dh = h / 3

    this._ctx.save()
    this._ctx.fillStyle = this.options.shipOptions.fillColor
    this._ctx.strokeStyle = this.options.shipOptions.color
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

  _drawShip2: function (trackpoint) {
    var point = this._map.latLngToLayerPoint(L.latLng(trackpoint.lat, trackpoint.lng))
    var dir = trackpoint.dir || 0
    var width = this.options.shipOptions.width
    var height = this.options.shipOptions.height
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
    img.src = this.options.shipOptions.imgUrl
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

  removeLayer: function () {
    if (this._map.hasLayer(this._trackLayer)) {
      this._map.removeLayer(this._trackLayer)
    }
    if (this._map.hasLayer(this._trackPointFeatureGroup)) {
      this._map.removeLayer(this._trackPointFeatureGroup)
    }
  },

  _clearLayer: function () {
    var bounds = this._trackLayer.getBounds()
    if (bounds) {
      var size = bounds.getSize();
      this._ctx.clearRect(bounds.min.x, bounds.min.y, size.x, size.y);
    } else {
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
    if (this._map.hasLayer(this._trackPointFeatureGroup)) {
      this._trackPointFeatureGroup.clearLayers()
    }
  },

  clear: function () {
    this._clearLayer()
    this._bufferTracks = []
  }
})

export var draw = function (map, options) {
  return new Draw(map, options)
}
