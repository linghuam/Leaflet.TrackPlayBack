import { TrackLayer } from './tracklayer'

export const Draw = L.Class.extend({

  trackPointOptions: {
    isDraw: false,
    useCanvas: true,
    stroke: false,
    color: '#ef0300',
    fill: true,
    fillColor: '#ef0300',
    opacity: 0.3,
    radius: 4
  },
  trackLineOptions: {
    isDraw: false,
    stroke: true,
    color: '#1C54E2', // stroke color
    weight: 2,
    fill: false,
    fillColor: '#000',
    opacity: 0.3
  },
  targetOptions: {
    useImg: false,
    imgUrl: '../../static/images/ship.png',
    width: 8,
    height: 18,
    color: '#00f', // stroke color
    fillColor: '#9FD12D'
  },
  toolTipOptions: {
    offset: [0, 0],
    direction: 'top',
    permanent: false
  },

  initialize: function (map, options) {
    this.trackPointOptions = L.extend(this.trackPointOptions, options.trackPointOptions)
    this.trackLineOptions = L.extend(this.trackLineOptions, options.trackLineOptions)
    this.targetOptions = L.extend(this.targetOptions, options.targetOptions)
    this.toolTipOptions = L.extend(this.toolTipOptions, options.toolTipOptions)

    this._showTrackPoint = this.trackLineOptions.isDraw
    this._showTrackLine = this.trackLineOptions.isDraw

    this._map = map
    this._trackLayer = new TrackLayer().addTo(map)
    this._canvas = this._trackLayer.getContainer()
    this._ctx = this._canvas.getContext('2d')
    this._bufferTracks = []
    this._trackPointFeatureGroup = L.featureGroup([]).addTo(map)

    this._trackLayer.on('update', this._trackLayerUpdate, this)
    this._map.on('mousemove', this._onmousemoveEvt, this)
  },

  update: function () {
    this._trackLayerUpdate()
  },

  drawTrack: function (trackpoints) {
    this._bufferTracks.push(trackpoints)
    this._drawTrack(trackpoints)
  },

  showTrackPoint: function () {
    this._showTrackPoint = true
    this.update()
  },

  hideTrackPoint: function () {
    this._showTrackPoint = false
    this.update()
  },

  showTrackLine: function () {
    this._showTrackLine = true
    this.update()
  },

  hideTrackLine: function () {
    this._showTrackLine = false
    this.update()
  },

  removeLayer: function () {
    this._bufferTracks = []
    this._trackLayer.off('update', this._trackLayerUpdate, this)
    this._map.off('mousemove', this._onmousemoveEvt, this)
    if (this._map.hasLayer(this._trackLayer)) {
      this._map.removeLayer(this._trackLayer)
    }
    if (this._map.hasLayer(this._trackPointFeatureGroup)) {
      this._map.removeLayer(this._trackPointFeatureGroup)
    }
  },

  clear: function () {
    this._clearLayer()
    this._bufferTracks = []
  },

  _trackLayerUpdate: function () {
    if (this._bufferTracks.length) {
      this._clearLayer()
      this._bufferTracks.forEach(function (element, index) {
        this._drawTrack(element, false)
      }.bind(this))
    }
  },

  _onmousemoveEvt: function (e) {
    if (!this._showTrackPoint) {
      return
    }
    var point = e.layerPoint
    if (this._bufferTracks.length) {
      for (let i = 0, leni = this._bufferTracks.length; i < leni; i++) {
        for (let j = 0, len = this._bufferTracks[i].length; j < len; j++) {
          let tpoint = this._map.latLngToLayerPoint(L.latLng(this._bufferTracks[i][j].lat, this._bufferTracks[i][j].lng))
          if (point.distanceTo(tpoint) <= this.trackPointOptions.radius) {
            this._opentoolTip(this._bufferTracks[i][j])
            return
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
    var tooltip = this._tooltip = L.tooltip(this.toolTipOptions)
    tooltip.setLatLng(latlng)
    tooltip.addTo(this._map)
    tooltip.setContent(this._getTooltipText(trackpoint))
  },

  _drawTrack: function (trackpoints) {
    // 画轨迹线
    if (this._showTrackLine) {
      this._drawTrackLine(trackpoints)
    }
    // 画船
    if (this.targetOptions.useImg) {
      this._drawShipImage(trackpoints[trackpoints.length - 1])
    } else {
      this._drawShipCanvas(trackpoints[trackpoints.length - 1])
    }
    // 画经过的轨迹点
    if (this._showTrackPoint) {
      if (this.trackPointOptions.useCanvas) {
        this._drawTrackPointsCanvas(trackpoints)
      } else {
        this._drawTrackPointsSvg(trackpoints)
      }
    }
  },

  _drawTrackLine: function (trackpoints) {
    var options = this.trackLineOptions
    var tp0 = this._map.latLngToLayerPoint(L.latLng(trackpoints[0].lat, trackpoints[0].lng))
    this._ctx.save()
    this._ctx.beginPath()
    // 画轨迹线
    this._ctx.moveTo(tp0.x, tp0.y)
    for (let i = 1, len = trackpoints.length; i < len; i++) {
      let tpi = this._map.latLngToLayerPoint(L.latLng(trackpoints[i].lat, trackpoints[i].lng))
      this._ctx.lineTo(tpi.x, tpi.y)
    }
    this._ctx.globalAlpha = options.opacity
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

  _drawTrackPointsCanvas: function (trackpoints) {
    var options = this.trackPointOptions
    this._ctx.save()
    for (let i = 0, len = trackpoints.length; i < len; i++) {
      if (trackpoints[i].isOrigin) {
        let latLng = L.latLng(trackpoints[i].lat, trackpoints[i].lng)
        let radius = options.radius
        let point = this._map.latLngToLayerPoint(latLng)
        this._ctx.beginPath()
        this._ctx.arc(point.x, point.y, radius, 0, Math.PI * 2, false)
        this._ctx.globalAlpha = options.opacity
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

  _drawTrackPointsSvg: function (trackpoints) {
    for (let i = 0, len = trackpoints.length; i < len; i++) {
      if (trackpoints[i].isOrigin) {
        let latLng = L.latLng(trackpoints[i].lat, trackpoints[i].lng)
        let cricleMarker = L.circleMarker(latLng, this.trackPointOptions)
        cricleMarker.bindTooltip(this._getTooltipText(trackpoints[i]), this.toolTipOptions)
        this._trackPointFeatureGroup.addLayer(cricleMarker)
      }
    }
  },

  _drawShipCanvas: function (trackpoint) {
    var point = this._map.latLngToLayerPoint(L.latLng(trackpoint.lat, trackpoint.lng))
    var rotate = trackpoint.dir || 0
    var w = this.targetOptions.width
    var h = this.targetOptions.height
    var dh = h / 3

    this._ctx.save()
    this._ctx.fillStyle = this.targetOptions.fillColor
    this._ctx.strokeStyle = this.targetOptions.color
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

  _drawShipImage: function (trackpoint) {
    var point = this._map.latLngToLayerPoint(L.latLng(trackpoint.lat, trackpoint.lng))
    var dir = trackpoint.dir || 0
    var width = this.targetOptions.width
    var height = this.targetOptions.height
    var offset = {
      x: width / 2,
      y: height / 2
    }
    var img = new window.Image()
    img.onload = function () {
      this._ctx.save()
      this._ctx.translate(point.x, point.y)
      this._ctx.rotate((Math.PI / 180) * dir)
      this._ctx.drawImage(img, 0 - offset.x, 0 - offset.y, width, height)
      this._ctx.restore()
    }.bind(this)
    img.src = this.targetOptions.imgUrl
  },

  _getTooltipText: function (targetobj) {
    var content = []
    content.push('<table>')
    if (targetobj.info && targetobj.info.length) {
      for (let i = 0, len = targetobj.info.length; i < len; i++) {
        content.push('<tr>')
        content.push('<td>' + targetobj.info[i].key + '</td>')
        content.push('<td>' + targetobj.info[i].value + '</td>')
        content.push('</tr>')
      }
    }
    content.push('</table>')
    content = content.join('')
    return content
  },

  _clearLayer: function () {
    var bounds = this._trackLayer.getBounds()
    if (bounds) {
      var size = bounds.getSize()
      this._ctx.clearRect(bounds.min.x, bounds.min.y, size.x, size.y)
    } else {
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
    }
    if (this._map.hasLayer(this._trackPointFeatureGroup)) {
      this._trackPointFeatureGroup.clearLayers()
    }
  }
})

export const draw = function (map, options) {
  return new Draw(map, options)
}
