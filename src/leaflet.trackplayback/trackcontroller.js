import L from 'leaflet'

import {
  isArray
} from './util'
import {
  Track
} from './track'

/**
 * 控制器类
 * 控制轨迹和绘制
 */
export const TrackController = L.Class.extend({

  initialize: function (tracks = [], draw, options) {
    L.setOptions(this, options)

    this._tracks = []
    this.addTrack(tracks)

    this._draw = draw

    this._updateTime()
  },

  getMinTime: function () {
    return this._minTime
  },

  getMaxTime: function () {
    return this._maxTime
  },

  addTrack: function (track) {
    if (isArray(track)) {
      for (let i = 0, len = track.length; i < len; i++) {
        this.addTrack(track[i])
      }
    } else if (track instanceof Track) {
      this._tracks.push(track)
      this._updateTime()
    } else {
      throw new Error('tracks must be an instance of `Track` or an array of `Track` instance!')
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

  _updateTime: function () {
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

})

export const trackController = function (tracks, draw, options) {
  return new TrackController(tracks, draw, options)
}
