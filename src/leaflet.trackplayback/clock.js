
export const Clock = L.Evented.extend({

  options: {
    speed: 13,
    maxSpeed: 65
  },

  initialize: function (trackController, options) {
    L.setOptions(this, options)

    this._trackController = trackController
    this._endTime = this._trackController.getMaxTime()
    this._curTime = this._trackController.getMinTime()
    this._speed = this.options.speed
    this._maxSpeed = this.options.maxSpeed
    this._lastFpsUpdateTime = 0
  },

  // 计算帧率 ， 单位：帧/秒，浏览器的最大值是：60帧/秒
  caculateFps: function (now) {
    var fps = 1000 / (now - this._lastFpsUpdateTime)
    return fps
  },

  // 计算两帧时间间隔，单位：秒
  caculatefpsTime: function (now) {
    let time = (now - this._lastFpsUpdateTime) / 1000
    if (this._lastFpsUpdateTime === 0) {
      time = 0
    }
    this._lastFpsUpdateTime = now
    return time
  },

  start: function () {
    if (this._intervalID) return;
    this._intervalID = window.requestAnimationFrame(this._tick.bind(this))
  },

  stop: function () {
    if (!this._intervalID) return;
    window.cancelAnimationFrame(this._intervalID)
    this._intervalID = null
    this._lastFpsUpdateTime = 0
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
    this._speed >= this._maxSpeed ? this._speed : this._speed += 1;
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
    return this._intervalID ? true : false
  },

  setCursor: function (time) {
    this._curTime = time
    this._trackController.drawTracksByTime(this._curTime)
    this.fire('tick', {time: this._curTime})
  },

  setSpeed: function (speed) {
    this._speed = speed
    if (this._intervalID) {
      this.stop()
      this.start()
    }
  },

  _tick: function () {
    let now = +new Date()
    let fpstime = this.caculatefpsTime(now)
    let isPause = false
    let stepTime = fpstime * Math.pow(2, this._speed - 1)
    this._curTime += stepTime
    if (this._curTime >= this._endTime) {
      this._curTime = this._endTime
      isPause = true
    }
    this._trackController.drawTracksByTime(this._curTime)
    this.fire('tick', {time: this._curTime})
    if (!isPause) this._intervalID = window.requestAnimationFrame(this._tick.bind(this))
  }
})

export const clock = function (trackController, options) {
  return new Clock(trackController, options)
}
