import L from 'leaflet'

L.Playback = L.Playback || {}

L.Playback.TrackController = L.Class.extend({

  initialize: function (map, tracks, draw, options) {
    this.options = options || {}

    this._map = map

    this._tracks = []

    this._minTime = null
    this._maxTime = null

    this._draw = draw

    if(tracks && tracks.length) {
      for(let i = 0, len = tracks.length; i < len; i++) {
        this.addTrack(tracks[i])
      }
    }

    this.updateTime()
  },

  getMinTime: function () {
    return this._minTime
  },

  getMaxTime: function () {
    return this._maxTime
  },

  addTrack: function (track) {
    if(track) {
      this._tracks.push(track)
      this.updateTime()
    }
  },

  updateTime: function () {
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

  drawTrackByTime: function (time) {
    this._draw.clear()
    for (let i = 0, len = this._tracks.length ; i < len; i++) {
      let track = this._tracks[i]
      let tps = track.getTrackPointsBeforeTime (time) 
      if (tps && tps.length) this._draw.drawTrack(tps)
    }
  }

})
