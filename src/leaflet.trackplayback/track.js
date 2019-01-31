import L from 'leaflet'

import {
  isArray
} from './util'

/**
 * 轨迹类
 */
export const Track = L.Class.extend({

  initialize: function (trackData = [], options) {
    L.setOptions(this, options)

    trackData.forEach(item => {
      // 添加 isOrigin 字段用来标识是否是原始采样点，与插值点区分开
      item.isOrigin = true
    })
    this._trackPoints = trackData
    this._timeTick = {}
    this._update()
  },

  addTrackPoint: function (trackPoint) {
    if (isArray(trackPoint)) {
      for (let i = 0, len = trackPoint.length; i < len; i++) {
        this.addTrackPoint(trackPoint[i])
      }
    }
    this._addTrackPoint(trackPoint)
  },

  getTimes: function () {
    let times = []
    for (let i = 0, len = this._trackPoints.length; i < len; i++) {
      times.push(this._trackPoints[i].time)
    }
    return times
  },

  getStartTrackPoint: function () {
    return this._trackPoints[0]
  },

  getEndTrackPoint: function () {
    return this._trackPoints[this._trackPoints.length - 1]
  },

  getTrackPointByTime: function (time) {
    return this._trackPoints[this._timeTick[time]]
  },

  _getCalculateTrackPointByTime: function (time) {
    // 先判断最后一个点是否为原始点
    let endpoint = this.getTrackPointByTime(time)
    let startPt = this.getStartTrackPoint()
    let endPt = this.getEndTrackPoint()
    let times = this.getTimes()
    if (time < startPt.time || time > endPt.time) return
    let left = 0
    let right = times.length - 1
    let n
    // 处理只有一个点情况
    if (left === right) {
      return endpoint
    }
    // 通过【二分查找】法查出当前时间所在的时间区间
    while (right - left !== 1) {
      n = parseInt((left + right) / 2)
      if (time > times[n]) left = n
      else right = n
    }

    let t0 = times[left]
    let t1 = times[right]
    let t = time
    let p0 = this.getTrackPointByTime(t0)
    let p1 = this.getTrackPointByTime(t1)
    startPt = L.point(p0.lng, p0.lat)
    endPt = L.point(p1.lng, p1.lat)
    let s = startPt.distanceTo(endPt)
    // 不同时间在同一个点情形
    if (s <= 0) {
      endpoint = p1
      return endpoint
    }
    // 假设目标在两点间做匀速直线运动
    // 求解速度向量，并计算时间 t 目标所在位置
    let v = s / (t1 - t0)
    let sinx = (endPt.y - startPt.y) / s
    let cosx = (endPt.x - startPt.x) / s
    let step = v * (t - t0)
    let x = startPt.x + step * cosx
    let y = startPt.y + step * sinx
    // 求目标的运动方向，0-360度
    let dir = endPt.x >= startPt.x ? (Math.PI * 0.5 - Math.asin(sinx)) * 180 / Math.PI : (Math.PI * 1.5 + Math.asin(sinx)) * 180 / Math.PI
      
    if (endpoint) {
      if (endpoint.dir === undefined) {
        endpoint.dir = dir
      }
    } else {
      endpoint = {
        lng: x,
        lat: y,
        dir: endPt.dir || dir,
        isOrigin: false,
        time: time
      }
    }
    return endpoint
  },

  // 获取某个时间点之前走过的轨迹
  getTrackPointsBeforeTime: function (time) {
    let tpoints = []
    for (let i = 0, len = this._trackPoints.length; i < len; i++) {
      if (this._trackPoints[i].time < time) {
        tpoints.push(this._trackPoints[i])
      }
    }
    // 获取最后一个点，根据时间线性插值而来
    let endPt = this._getCalculateTrackPointByTime(time)
    if (endPt) {
      tpoints.push(endPt)
    }
    return tpoints
  },

  _addTrackPoint: function (trackPoint) {
    trackPoint.isOrigin = true
    this._trackPoints.push(trackPoint)
    this._update()
  },

  _update: function () {
    this._sortTrackPointsByTime()
    this._updatetimeTick()
  },

  // 轨迹点按时间排序 【冒泡排序】
  _sortTrackPointsByTime: function () {
    let len = this._trackPoints.length
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - 1 - i; j++) {
        if (this._trackPoints[j].time > this._trackPoints[j + 1].time) {
          let tmp = this._trackPoints[j + 1]
          this._trackPoints[j + 1] = this._trackPoints[j]
          this._trackPoints[j] = tmp
        }
      }
    }
  },

  // 为轨迹点建立时间索引，优化查找性能
  _updatetimeTick: function () {
    this._timeTick = {}
    for (let i = 0, len = this._trackPoints.length; i < len; i++) {
      this._timeTick[this._trackPoints[i].time] = i
    }
  }
})

export const track = function (trackData, options) {
  return new Track(trackData, options)
}
