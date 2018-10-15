import {Track} from './track'
import {TrackController} from './trackcontroller'
import {Clock} from './clock'
import {Draw} from './draw'
import * as Util from './util'

/**
 * single track data
 * [{lat: 30, lng: 116, time: 1502529980, heading: 300, info:[]},{},....]
 *
 * mutiple track data
 * [single track data, single track data, single track data]
 */
export const TrackPlayBack = L.Class.extend({
    initialize: function (data, map, options = {}) {
        let drawOptions = {
            trackPointOptions: options.trackPointOptions,
            trackLineOptions: options.trackLineOptions,
            targetOptions: options.targetOptions,
            toolTipOptions: options.toolTipOptions
        }
        this._tracks = this._initTracks(data)
        this._draw = new Draw(map, drawOptions)
        this._trackController = new TrackController(this._tracks, this._draw)
        this._clock = new Clock(this._trackController, options.clockOptions)

        this._clock.setCursor(this._clock.getStartTime())

    },
    addTrack: function () {

    },
    start: function () {
        this._clock.start()
        return this
    },
    stop: function () {
        this._clock.stop()
        return this
    },
    rePlaying: function () {
        this._clock.rePlaying()
        return this
    },
    slowSpeed: function () {
        this._clock.slowSpeed()
        return this
    },
    quickSpeed: function () {
        this._clock.quickSpeed()
        return this
    },
    getSpeed: function () {
        return this._clock.getSpeed()
    },
    getCurTime: function () {
        return this._clock.getCurTime()
    },
    getStartTime: function () {
        return this._clock.getStartTime()
    },
    getEndTime: function () {
        return this._clock.getEndTime()
    },
    isPlaying: function () {
        return this._clock.isPlaying()
    },
    setCursor: function (time) {
        this._clock.setCursor(time)
        return this
    },
    setSpeed: function (speed) {
        this._clock.setSpeed(speed)
        return this
    },
    _initTracks: function(data) {
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