import L from 'leaflet'

L.Playback = L.Playback || {}

L.Playback.Clock = L.Class.extend({

  initialize: function (trackController, callback, options) {
    this._trackController = trackController
    L.setOptions(this, options)
    this._endTime = this._trackController.getMaxTime()
    this._curTime = this._trackController.getMinTime()
    this._speed = this.options.speed ? this.options.speed : 1
    this._intervalTime = this.options.intervalTime || 200
    this._callback = callback || function () {}
  },

  _tick: function () {
    this._curTime += Math.pow(2, this._speed - 1)
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

  stop: function () {
    if (!this._intervalID) return;
    clearInterval(this._intervalID);
    this._intervalID = null;
  },

  rePlaying: function () {
    this.stop()
    this._curTime = this._trackController.getMinTime()
    this.start()
  },

  slowSpeed: function () {
    this._speed <= 1 ? this._speed : this._speed -= 1;
    if (this._intervalID) {
      this.stop();
      this.start();
    }
  },

  quickSpeed: function () {
    this._speed >= this.max_speed ? this._speed : this._speed += 1;
    if (this._intervalID) {
      this.stop();
      this.start();
    }
  },

  getSpeed: function () {
    return this._speed
  },

  getCurTime: function () {
    return this._curTime
  },

  getStartTime: function () {
    return this._trackController.getMinTime()
  },

  getEndTime: function () {
    return this._trackController.getMaxTime()
  },

  isPlaying: function () {
    return this._intervalID ? 1 : 0
  },

  setCursor: function (time) {
    this._curTime = time
    this._trackController.drawTrackByTime(this._curTime)
    this._callback(this._curTime)
  },

  setSpeed: function (speed) {
    this._speed = speed
    if (this._intervalID) {
      this.stop()
      this.start()
    }
  }

})
