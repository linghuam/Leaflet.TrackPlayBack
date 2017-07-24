import L from 'leaflet'

L.Playback = L.Playback || {}

L.Playback.MoveableMarker = L.Marker.extend({

  initialize: function (startLatLng, options) {
    var markerOptions = options.marker || {}
    L.Marker.prototype.initialize.call(this, startLatLng, markerOptions)
  },

  move: function (latLng, transitionTime) {
    // Only if CSS3 transitions are supported
    if (L.DomUtil.TRANSITION) {
      if (this._icon) {
        this._icon.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear'
        if (this._popup && this._popup._wrapper) { this._popup._wrapper.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear' }
      }
      if (this._shadow) {
        this._shadow.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear'
      }
    }
    this.setLatLng(latLng)
  },

  setIconAngle: function (iconAngle) {
    this.options.iconAngle = iconAngle
    if (this._map) { this.update() }
  },

  // modify leaflet markers to add our roration code
  /*
   * Based on comments by @runanet and @coomsie
   * https://github.com/CloudMade/Leaflet/issues/386
   *
   * Wrapping function is needed to preserve L.Marker.update function
  */
  _old__setPos: L.Marker.prototype._setPos,

  _updateImg: function (i, a, s) {
    a = L.point(s).divideBy(2)._subtract(L.point(a))
    var transform = ''
    transform += ' rotate(' + this.options.iconAngle + 'deg)'
    i.style[L.DomUtil.TRANSFORM] += transform
    i.style.transformOrigin = '50% 50%' // linghuam 设置旋转的参照点为中心点，解决船舶偏移问题
  },

  _setPos: function (pos) {
    if (this._icon) {
      this._icon.style[L.DomUtil.TRANSFORM] = ''
    }
    if (this._shadow) {
      this._shadow.style[L.DomUtil.TRANSFORM] = ''
    }

    this._old__setPos.apply(this, [pos])
    if (this.options.iconAngle) {
      var a = this.options.icon.options.iconAnchor
      var s = this.options.icon.options.iconSize
      var i
      if (this._icon) {
        i = this._icon
        this._updateImg(i, a, s)
      }

      if (this._shadow) {
        // Rotate around the icons anchor.
        s = this.options.icon.options.shadowSize
        i = this._shadow
        this._updateImg(i, a, s)
      }
    }
  }
})
