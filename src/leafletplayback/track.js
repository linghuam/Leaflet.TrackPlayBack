import L from 'leaflet'

L.Playback = L.Playback || {}

L.Playback.Track = L.Class.extend({

  initialize: function (map, dataObj, options) {
    this._map = map
    this._trackPoints = []
    this.options = options || {}

    if (dataObj.timePosList && dataObj.timePosList.length) {
      for (let i = 0, len = dataObj.timePosList.length; i < len; i++) {
        // isOrigin标记是否属于原始点
        dataObj.timePosList[i].isOrigin = true
        this.addTrackPoint(dataObj.timePosList[i])
      }
    }
  },

  addTrackPoint: function (trackPoint) {
    this._trackPoints.push(trackPoint);
  },

  getTimes: function () {
    var times = []
    for (let i = 0, len = this._trackPoints.length; i < len; i++) {
      times.push(this._trackPoints[i].time)
    }
    return times;
  },

  getStartTrackPoint: function () {
    return this._trackPoints[0]
  },

  getEndTrackPoint: function () {
    return this._trackPoints[this._trackPoints.length - 1]
  },

  getTrackPointByTime: function (time) {
    for (let i = 0, len = this._trackPoints.length; i < len; i++) {
      if (this._trackPoints[i].time === time) {
        return this._trackPoints[i]
      }
    }
  },

  getCalculateTrackPointByTime: function (time) {
    // 先判断最后一个点是否为原始点
    var endpoint = this.getTrackPointByTime(time)
    var startPt = this.getStartTrackPoint()
    var endPt = this.getEndTrackPoint()
    var times = this.getTimes()
    if (time < startPt.time || time > endPt.time) return;
    var left = 0
    var right = times.length - 1
    var n
    // 处理只有一个点情况
    if (left === right) {
       return endpoint 
    }
    while (right - left !== 1) {
      n = parseInt((left + right) / 2)
      if (time > times[n]) left = n
      else right = n
    }

    var t0 = times[left]
    var t1 = times[right]
    var t = time
    startPt = L.point(this.getTrackPointByTime(t0).lng, this.getTrackPointByTime(t0).lat)
    endPt = L.point(this.getTrackPointByTime(t1).lng, this.getTrackPointByTime(t1).lat)
    var s = startPt.distanceTo(endPt);
    // 【不同时间在同一个点情形】
    if (s <= 0) {
      endpoint = this.getTrackPointByTime(t1)
      endpoint.time = time
      return endpoint
    }
    var v = s / (t1 - t0)
    var sinx = (endPt.y - startPt.y) / s
    var cosx = (endPt.x - startPt.x) / s
    var step = v * (t - t0)
    var x = startPt.x + step * cosx
    var y = startPt.y + step * sinx
    var dir = endPt.x >= startPt.x ? (Math.PI * 0.5 - Math.asin(sinx)) * 180 / Math.PI : (Math.PI * 1.5 + Math.asin(sinx)) * 180 / Math.PI

    if (endpoint) {
      if (endpoint.dir === undefined) { endpoint.dir = dir }
    } else {
      endpoint = {
        lng: x,
        lat: y,
        dir: dir,
        isOrigin: false,
        time: time
      }
    }
    return endpoint
  },

  getTrackPointsBeforeTime: function (time) {
    var tpoints = []
    for (let i = 0, len = this._trackPoints.length; i < len; i++) {
      if (this._trackPoints[i].time < time) {
        tpoints.push(this._trackPoints[i])
      }
    }
    var endPt = this.getCalculateTrackPointByTime(time)
    if (endPt) {
      tpoints.push(endPt)
    }
    return tpoints
  }

})
