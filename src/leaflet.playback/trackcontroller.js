import L from 'leaflet'

export var TrackController = L.Class.extend({

  initialize: function (tracks, draw, options) {
    L.setOptions(this, options)

    this._tracks = []

    this._minTime = null
    this._maxTime = null

    this._draw = draw

    if (tracks && tracks.length) {
      for (let i = 0, len = tracks.length; i < len; i++) {
        this._tracks.push(tracks[i])
      }
    }

    this._update()

    this._caculateCount()
  },

  getMinTime: function () {
    return this._minTime
  },

  getMaxTime: function () {
    return this._maxTime
  },

  addTrack: function (track) {
    if (track) {
      this._tracks.push(track)
      this._update()
    }
  },

  drawTracksByTime: function (time) {
    this._draw.clear()
    for (let i = 0, len = this._tracks.length; i < len; i++) {
      let track = this._tracks[i]
      let tps = track.getTrackPointsBeforeTime(time)
      if (tps && tps.length) this._draw.drawTrack(tps)
    }
  },

  _update: function () {
    if (this._tracks.length) {
      this._minTime = this._tracks[0].getStartTrackPoint().time
      this._maxTime = this._tracks[0].getEndTrackPoint().time
      for (let i = 0, len = this._tracks.length; i < len; i++) {
        let stime = this._tracks[i].getStartTrackPoint().time
        let etime = this._tracks[i].getEndTrackPoint().time
        if (stime < this._minTime) {
          this._minTime = stime
        }
        if (etime > this._maxTime) {
          this._maxTime = etime
        }
      }
    }
  },

  _caculateCount: function () {
    var shipCount = this._tracks.length
    var pointCount = 0
    for (let i = 0, len = shipCount; i < len; i++) {
      pointCount += this._tracks[i]._trackPoints.length
    }
    console.log('共有: ' + shipCount + '艘船;')
    console.log('共有: ' + pointCount + '个轨迹点;')
  }

})

export var trackController = function (tracks, draw, options) {
  return new TrackController(tracks, draw, options)
}
