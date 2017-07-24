import L from 'leaflet'

L.Playback = L.Playback || {}

L.Playback.Clock = L.Class.extend({

  initialize: function (trackController, callback, options) {
    this._trackController = trackController
    this._callbacksArry = []
    if (callback) this.addCallback(callback)
    L.setOptions(this, options)

    this._speed = this.options.speed
    this.max_speed = this.options.Max_Speed
    this._alltime = this._trackController.getAllTimes()
    this._cursor = this._trackController.getStartTime()
    this._trackController.locateToMarker(this._cursor)
    if (this._alltime.length) { // 规定n分钟内播放完，除以时间点个数得到每一次变化的时间
      this._tickLen = 5 * 60 * 1000 / this._alltime.length
    }
            // this._transitionTime = this.getTransitionTime();  //this._tickLen / this._speed;
  },

  _tick: function (transtitionTime) {
            // 旧版
            // if (self._cursor > self.getEndTime()) {
            //     clearInterval(self._intervalID);
            //     self._intervalID = null; //Linghuam add 播放停止后，再开始无法播放问题
            //     return;
            // }
            // self._trackController.tock(self._cursor, self._transitionTime);
            // self._callbacks(self._cursor);
            // self._cursor = self.getNextTime();
    var lasttime = this._cursor
    this._cursor = this.getNextTime()
    if (!this._cursor || this._cursor > this.getEndTime()) {
      clearTimeout(this._intervalID)
      this._intervalID = null // Linghuam add 播放停止后，再开始无法播放问题
      return
    }
    this._trackController.tock(this._cursor, transtitionTime, lasttime)
    this._callbacks(this._cursor)
  },

  _callbacks: function (cursor) {
    var arry = this._callbacksArry
    for (var i = 0, len = arry.length; i < len; i++) {
      arry[i](cursor)
    }
  },

  addCallback: function (fn) {
    this._callbacksArry.push(fn)
  },

        // 根据相邻两点之间的真实时间间隔设置动画时间
  getTransitionTime: function () {
    var t1 = this._cursor
    var t2 = this.getNextTime()
    var transitionTime = this._tickLen / Math.pow(2, this._speed) // 设置一个默认值
    if (t1 && t2 && t2 > t1) {
      transitionTime = (t2 - t1) / Math.pow(2, this._speed)
    }
    return transitionTime
  },

        // 时间控件的变化时间，需等动画完成后才能开始下一个时间
  getTransitionTimeClock: function () {
    if (this._cursor === this.getStartTime()) {
      return 0
    } else {
      var t1 = this.getLastTime()
      var t2 = this._cursor
      var transitionTime = this._tickLen / Math.pow(2, this._speed) // 设置一个默认值
      if (t1 && t2 && t2 > t1) {
        transitionTime = (t2 - t1) / Math.pow(2, this._speed)
      }
      return transitionTime
    }
  },

  start: function () {
            // 旧版
            // if (this._intervalID) return;
            // this._intervalID = window.setInterval(
            //   this._tick,
            //   this._transitionTime,
            //   this);

    if (this._intervalID) return
    this._intervalID = true
    this._intervalCount = 0
    var self = this;
    (function loop () {
      self._intervalCount++
      if (!self._intervalID) { // 播放暂停切换时停止播放
        return
      }
      var transtitionTime = self.getTransitionTime()
      var transitionTimeClock = self.getTransitionTimeClock()
                // if (self._intervalCount === 1) { //加减速时再开始，时钟变化时间应为零
                //     transitionTimeClock = 0;
                // } else {
                //     transitionTimeClock = self.getTransitionTimeClock();
                // }
      clearTimeout(self._intervalID)
      self._intervalID = setTimeout(function () {
        self._tick(transtitionTime)
        loop()
      }, transitionTimeClock)
    })()
  },

  stop: function () {
    if (!this._intervalID) return
    this.setCursor(this._cursor)
    clearTimeout(this._intervalID)
    this._intervalID = null
  },

  getSpeed: function () {
    return this._speed
  },

  isPlaying: function () {
    return !!this._intervalID
  },

  setSpeed: function (speed) {
    this._speed = speed
            // if (this._intervalID) {
            //     this.stop();
            //     this.start();
            // }
  },

        // 加速
  quickSpeed: function () {
    this._speed >= this.max_speed ? this._speed : this._speed += 1
    if (this._intervalID) {
      this.stop()
                // this.setCursor(this._cursor);
      this.start()
    }
  },

        // 减速
  slowSpeed: function () {
    this._speed <= 1 ? this._speed : this._speed -= 1
    if (this._intervalID) {
      this.stop()
                // this.setCursor(this._cursor);
      this.start()
    }
  },

        // 重新播放
  rePlaying: function () {
    this._trackController.clearNoDeletTrack()
    if (this.isPlaying()) {
      this.stop()
    }
    this.setCursor(this.getStartTime())
    this.start()
  },

  setCursor: function (ms) {
    var time = this.getValidCursor(ms)
    if (time) {
      this._cursor = time
      this._trackController.tock(this._cursor, 0, time)
    }
    this._callbacks(ms)
  },

  getValidCursor: function (time) {
    var curtime
    if (time <= this.getEndTime() && time >= this.getStartTime()) {
      curtime = time
      for (var i = 0, len = this._alltime.length; i < len; i++) {
        if (this._alltime[i] > curtime) {
          curtime = this._alltime[i - 1]
          break
        }
      }
    }
    return curtime
  },

  getTime: function () {
    return this._cursor
  },

  getAllTime: function () {
    return this._alltime
  },

  getStartTime: function () {
    return this._trackController.getStartTime()
  },

  getEndTime: function () {
    return this._trackController.getEndTime()
  },

  getLastTime: function () {
    var lasttime
    var index = this._alltime.indexOf(this._cursor)
    if (index !== -1 && index !== 0) {
      lasttime = this._alltime[index - 1]
    }
    return lasttime
            // if(index === -1) return this._alltime[0];
            // else if(index === 0) return this._alltime[this._alltime.length-1];
            // else return this._alltime[index-1];
  },

  getNextTime: function () {
    var nexttime
    var index = this._alltime.indexOf(this._cursor)
    if (index !== -1 && index !== this._alltime.length - 1) {
      nexttime = this._alltime[index + 1]
    }
    return nexttime
            // if(index === -1) return this._alltime[this._alltime.length-1];
            // else if(index === this._alltime.length-1) this.stop();
            // else return this._alltime[index+1];
  },

  getTickLen: function () {
    return this._tickLen
  }
})

L.Playback.Clock2 = L.Class.extend({

  initialize: function (trackController, callback, options) {
    this._trackController = trackController
    this._callbacksArry = []
    if (callback) this.addCallback(callback)
    L.setOptions(this, options)
    this._speed = this.options.speed
    this._tickLen = this.options.tickLen
    this._cursor = trackController.getStartTime()
    this._transitionTime = this._tickLen / this._speed
  },

  _tick: function (self) {
    if (self._cursor > self._trackController.getEndTime()) {
      clearInterval(self._intervalID)
      return
    }
    self._trackController.tock(self._cursor, self._transitionTime)
    self._callbacks(self._cursor)
    self._cursor += self._tickLen
  },

  _callbacks: function (cursor) {
    var arry = this._callbacksArry
    for (var i = 0, len = arry.length; i < len; i++) {
      arry[i](cursor)
    }
  },

  addCallback: function (fn) {
    this._callbacksArry.push(fn)
  },

  start: function () {
    if (this._intervalID) return
    this._intervalID = window.setInterval(
      this._tick,
      this._transitionTime,
      this)
  },

  stop: function () {
    if (!this._intervalID) return
    clearInterval(this._intervalID)
    this._intervalID = null
  },

  getSpeed: function () {
    return this._speed
  },

  isPlaying: function () {
    return !!this._intervalID
  },

  setSpeed: function (speed) {
    this._speed = speed
    this._transitionTime = this._tickLen / speed
    if (this._intervalID) {
      this.stop()
      this.start()
    }
  },

  setCursor: function (ms) {
    var time = parseInt(ms)
    if (!time) return
    var mod = time % this._tickLen
    if (mod !== 0) {
      time += this._tickLen - mod
    }
    this._cursor = time
    this._trackController.tock(this._cursor, 0)
    this._callbacks(this._cursor)
  },

  getTime: function () {
    return this._cursor
  },

  getStartTime: function () {
    return this._trackController.getStartTime()
  },

  getEndTime: function () {
    return this._trackController.getEndTime()
  },

  getTickLen: function () {
    return this._tickLen
  }

})
