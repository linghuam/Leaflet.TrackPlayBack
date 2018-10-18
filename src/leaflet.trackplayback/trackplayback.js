import L from 'leaflet'

import {
  Track
} from './track'
import {
  TrackController
} from './trackcontroller'
import {
  Clock
} from './clock'
import {
  Draw
} from './draw'
import * as Util from './util'

/**
 * single track data
 * [{lat: 30, lng: 116, time: 1502529980, heading: 300, info:[]},{},....]
 *
 * mutiple track data
 * [single track data, single track data, single track data]
 */
export const TrackPlayBack = L.Class.extend({

  includes: L.Mixin.Events,

  initialize: function (data, map, options = {}) {
    let drawOptions = {
      trackPointOptions: options.trackPointOptions,
      trackLineOptions: options.trackLineOptions,
      targetOptions: options.targetOptions,
      toolTipOptions: options.toolTipOptions
    }
    this.tracks = this._initTracks(data)
    this.draw = new Draw(map, drawOptions)
    this.trackController = new TrackController(this.tracks, this.draw)
    this.clock = new Clock(this.trackController, options.clockOptions)

    this.clock.on('tick', this._tick, this)
  },
  start: function () {
    this.clock.start()
    return this
  },
  stop: function () {
    this.clock.stop()
    return this
  },
  rePlaying: function () {
    this.clock.rePlaying()
    return this
  },
  slowSpeed: function () {
    this.clock.slowSpeed()
    return this
  },
  quickSpeed: function () {
    this.clock.quickSpeed()
    return this
  },
  getSpeed: function () {
    return this.clock.getSpeed()
  },
  getCurTime: function () {
    return this.clock.getCurTime()
  },
  getStartTime: function () {
    return this.clock.getStartTime()
  },
  getEndTime: function () {
    return this.clock.getEndTime()
  },
  isPlaying: function () {
    return this.clock.isPlaying()
  },
  setCursor: function (time) {
    this.clock.setCursor(time)
    return this
  },
  setSpeed: function (speed) {
    this.clock.setSpeed(speed)
    return this
  },
  showTrackPoint: function () {
    this.draw.showTrackPoint()
    return this
  },
  hideTrackPoint: function () {
    this.draw.hideTrackPoint()
    return this
  },
  showTrackLine: function () {
    this.draw.showTrackLine()
    return this
  },
  hideTrackLine: function () {
    this.draw.hideTrackLine()
    return this
  },
  dispose: function () {
    this.clock.off('tick', this._tick)
    this.draw.remove()
    this.tracks = null
    this.draw = null
    this.trackController = null
    this.clock = null
  },
  _tick: function (e) {
    this.fire('tick', e)
  },
  _initTracks: function (data) {
    let tracks = []
    if (Util.isArray(data)) {
      if (Util.isArray(data[0])) {
        // 多条轨迹
        for (let i = 0, len = data.length; i < len; i++) {
          tracks.push(new Track(data[i]))
        }
      } else {
        // 单条轨迹
        tracks.push(new Track(data))
      }
    }
    return tracks
  }
})

export const trackplayback = function (data, map, options) {
  return new TrackPlayBack(data, map, options)
}
