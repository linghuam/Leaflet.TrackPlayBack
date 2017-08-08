import L from 'leaflet'

L.Playback = L.Playback || {}

L.Playback.Clock = L.Class.extend({

  initialize: function (trackController, callback, options) {
    this._trackController = trackController
    L.setOptions(this, options)
    this._endTime = this._trackController.getMaxTime()
    this._curTime = this._trackController.getMinTime()
    this._speed = this.options.speed ? this.options.speed : 0
    this._intervalTime = this.options.intervalTime || 100
    this._callback = callback || function () {}
  },

  _tick: function () {
    this._curTime += Math.pow(2,this._speed)
    if (this._curTime >= this._endTime) {
      this._curTime = this._endTime
      clearInterval(this._intervalID)
    }
    this._trackController.drawTrackByTime(this._curTime)    
    this._callback(this._curTime)
  },
  
  start: function () {
    if (this._intervalID) return;
    this._intervalID = window.setInterval(this._tick.bind(this), this._intervalTime)
  },

  stop : function () {
    if (!this._intervalID) return;
    clearInterval(this._intervalID);
    this._intervalID = null;
  },  

  getSpeed: function () {
    return this._speed
  },

  isPlaying: function () {
    return this._intervalID ? true : false
  },

  setSpeed: function (speed) {
    this._speed = speed
    if (this._intervalID) {
      this.stop()
      this.start()
    }
  }

})

