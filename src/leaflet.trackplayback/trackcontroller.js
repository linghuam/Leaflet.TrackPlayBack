import { isArray } from './util'
import { Track } from './track'

export const TrackController = L.Class.extend({

  initialize: function (tracks = [], draw, options) {
    L.setOptions(this, options)

    if (isArray(tracks)) {
      this._tracks = tracks
    } else if (tracks instanceof Track) {
      this._tracks = [tracks]
    } else {
      throw new Error('track must be an instance of `Track` or an array of `Track` instance!')
    }

    this._draw = draw

    // this._map = map

    this._minTime = null

    this._maxTime = null

    this._update()

    // this._caculateCount()

    // this.locateToFirstTrack()
  },

  getMinTime: function () {
    return this._minTime
  },

  getMaxTime: function () {
    return this._maxTime
  },

  locateToFirstTrack: function () {
    if (this._tracks.length) {
      var track0 = this._tracks[0]
      var spoint = track0.getStartTrackPoint();
      if (spoint) {
        var latlng = L.latLng(spoint.lat, spoint.lng);
        // this._map.panTo(latlng);
      }
    }
  },

  addTrack: function (track) {
    if (isArray(track)) {
      for (let i = 0, len = track.length; i < len; i++) {
        this.addTrack(track[i])
      }
    }
    if (track instanceof Track) {
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

export const trackController = function (tracks, draw, options) {
  return new TrackController(tracks, draw, options)
}
