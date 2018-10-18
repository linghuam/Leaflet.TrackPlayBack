import L from 'leaflet'
/**
 * 时钟类，控制轨迹播放动画
 */
export const Clock = L.Class.extend({

  includes: L.Mixin.Events,

  options: {
    // 播放速度
    // 计算方法 fpstime * Math.pow(2, this._speed - 1)
    speed: 12,
    // 最大播放速度
    maxSpeed: 65
  },

  initialize: function (trackController, options) {
    L.setOptions(this, options)

    this._trackController = trackController
    this._endTime = this._trackController.getMaxTime()
    this._curTime = this._trackController.getMinTime()
    this._speed = this.options.speed
    this._maxSpeed = this.options.maxSpeed
    this._intervalID = null
    this._lastFpsUpdateTime = 0
  },

  start: function () {
    if (this._intervalID) return
    this._intervalID = L.Util.requestAnimFrame(this._tick, this)
  },

  stop: function () {
    if (!this._intervalID) return
    L.Util.cancelAnimFrame(this._intervalID)
    this._intervalID = null
    this._lastFpsUpdateTime = 0
  },

  rePlaying: function () {
    this.stop()
    this._curTime = this._trackController.getMinTime()
    this.start()
  },

  slowSpeed: function () {
    this._speed = this._speed <= 1 ? this._speed : this._speed - 1
    if (this._intervalID) {
      this.stop()
      this.start()
    }
  },

  quickSpeed: function () {
    this._speed = this._speed >= this._maxSpeed ? this._speed : this._speed + 1
    if (this._intervalID) {
      this.stop()
      this.start()
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
    return !!this._intervalID
  },

  setCursor: function (time) {
    this._curTime = time
    this._trackController.drawTracksByTime(this._curTime)
    this.fire('tick', {
      time: this._curTime
    })
  },

  setSpeed: function (speed) {
    this._speed = speed
    if (this._intervalID) {
      this.stop()
      this.start()
    }
  },

  // 计算两帧时间间隔，单位：秒
  _caculatefpsTime: function (now) {
    let time
    if (this._lastFpsUpdateTime === 0) {
      time = 0
    } else {
      time = now - this._lastFpsUpdateTime
    }
    this._lastFpsUpdateTime = now
    // 将毫秒转换成秒
    time = time / 1000
    return time
  },

  _tick: function () {
    let now = +new Date()
    let fpstime = this._caculatefpsTime(now)
    let isPause = false
    let stepTime = fpstime * Math.pow(2, this._speed - 1)
    this._curTime += stepTime
    if (this._curTime >= this._endTime) {
      this._curTime = this._endTime
      isPause = true
    }
    this._trackController.drawTracksByTime(this._curTime)
    this.fire('tick', {
      time: this._curTime
    })
    if (!isPause) this._intervalID = L.Util.requestAnimFrame(this._tick, this)
  }
})

export const clock = function (trackController, options) {
  return new Clock(trackController, options)
}
