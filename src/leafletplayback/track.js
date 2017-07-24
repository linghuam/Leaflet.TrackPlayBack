import L from 'leaflet'

L.Playback = L.Playback || {}

L.Playback.Track = L.Class.extend({

  initialize: function (map, dataObj, options) {
    this._map = map
    this.options = options || {}
    this._dataObj = dataObj
    this._ticks = []
    this._times = []
    this._marker = null

    var sampleTimes = dataObj.timePosList

    for (var i = 0, len = sampleTimes.length; i < len; i++) {
      var ti = sampleTimes[i].time
      this._times.push(ti)
      this._ticks[ti] = sampleTimes[i]
      if (i === 0) {
        this._startTime = ti
      }
      if (i === len - 1) {
        this._endTime = ti
      }
    }

    if (!this._trackLineFeatureGroup) {
      this._trackLineFeatureGroup = L.featureGroup([]).addTo(this._map)
    }

    if (!this._trackPointFeatureGroup) {
      this._trackPointFeatureGroup = L.featureGroup([]).addTo(this._map)
    }

    // 地图移动时，取消虚线样式
    this._map.on('moveend', function () {
      if (this._map.hasLayer(this._trackLineFeatureGroup)) {
        this._trackLineFeatureGroup.eachLayer(function (layer) {
          if (layer._path) {
            layer._path.style.strokeDasharray = 'none'
          }
        }, this)
      }
    }, this)

    // 为地图添加缩放事件,避免在缩放时执行动画
    this._map.on('zoomend ', function () {
      if (this._marker) {
        this._marker._icon.style[L.DomUtil.TRANSITION] = 'all 0ms linear'
      }
    }, this)
  },

  getFirstTick: function () {
    return this._ticks[this._startTime]
  },

  getLastTick: function () {
    return this._ticks[this._endTime]
  },

  getStartTime: function () {
    return this._startTime
  },

  getEndTime: function () {
    return this._endTime
  },

  getTimes: function () {
    return this._times
  },

  getTimeInterval: function (timestamp) {
    var index = this._times.indexOf(timestamp)
    if (index !== -1 && index !== this._times.length - 1) {
      var next = this._times[index + 1]
      var inteval = next - timestamp
    }
    return inteval
  },

  tick: function (timestamp) {
    return this._ticks[timestamp]
  },

  getLatLng: function (timestamp) {
    var tick = this.tick(timestamp)
    if (tick) return L.latLng(tick.lat, tick.lng)
  },

  setMarker: function (timestamp, options) {
    var latlng = null

            // if time stamp is not set, then get first tick
    if (timestamp) {
      latlng = this.getLatLng(timestamp)
    } else {
      latlng = this.getLatLng(this._startTime)
    }

    if (latlng) {
      this._marker = new L.Playback.MoveableMarker(latlng, options, this._dataObj)
    }

    return this._marker
  },

  getMarker: function () {
    return this._marker
  },

  removeMarker: function () {
    if (this._map.hasLayer(this._marker)) {
      this._map.removeLayer(this._marker)
      this._marker = null
    }
  },

  createTrackPoint: function (timestamp) {
    var latlng = this.getLatLng(timestamp)
    if (latlng) var cricleMarker = L.circleMarker(latlng, this.options.OriginCircleOptions)
    var infoObj = this.tick(timestamp)
    if (cricleMarker && infoObj) cricleMarker.bindTooltip(this.getTooltipText(infoObj), this.getTooltipOptions())
    // 将最后一个点的信息绑定到船舶上
    if (this._marker) {
      this._marker.unbindTooltip()
      this._marker.bindTooltip(this.getTooltipText(infoObj), this.getTooltipOptions())
    }
    return cricleMarker
  },

  getTooltipText: function (targetobj) {
    var content = []
    content.push('<table>')
    content.push('<tr><td>批号:</td><td>' + targetobj.info_ph + '</td></tr>')
    content.push('<tr><td>经度:</td><td>' + targetobj.info_lng + '</td></tr>')
    content.push('<tr><td>纬度:</td><td>' + targetobj.info_lat + '</td></tr>')
    content.push('<tr><td>时间:</td><td>' + targetobj.info_time + '</td></tr>')
    content.push('<tr><td>航向:</td><td>' + targetobj.info_dir + '</td></tr>')
    content.push('<tr><td>航艏向:</td><td>' + targetobj.info_heading + '</td></tr>')
    content.push('<tr><td>航速:</td><td>' + targetobj.info_speed + '</td></tr>')
    content.push('</table>')
    content = content.join('')
    return content
  },

  getTooltipOptions: function () {
    return {
      offset: [0, 0],
      direction: 'top',
      permanent: false
    }
  },

 /*
 * latLng 要移到的坐标点
 * transitionTime 移到最新点经历的时间
 * timestamp 当前的时间点
 */
  moveMarker: function (latLng, transitionTime, timestamp) {
    if (this._marker) {
      var latlngold = this._marker.getLatLng()
      var tick = this.tick(timestamp)

      if (transitionTime !== 0 && tick) {
        // 绘制上一次到当前时间的历史轨迹线
        var latlngs = [
                        [latlngold.lat, latlngold.lng],
                        [latLng.lat, latLng.lng]
        ]

        var dir = tick.dir

        var polyline = L.polyline(latlngs, this.options.trackLineOptions)
        this._trackLineFeatureGroup.addLayer(polyline)
        if (polyline._path) {
          var path = polyline._path
          var length = path.getTotalLength()
          path.style.transition = path.style.WebkitTransition = 'none'
          path.style.strokeDasharray = length + ',' + length
          path.style.strokeDashoffset = length
          path.getBoundingClientRect()
          path.style.transition = path.style.WebkitTransition =
                            'stroke-dashoffset ' + transitionTime + 'ms linear'
          path.style.strokeDashoffset = '0'
        }

        // 绘制当前时间的轨迹点
        var point = this.createTrackPoint(timestamp)
        // this._trackPointFeatureGroup.addLayer(point);

        // 添加轨迹线的时间应该在船舶移动后添加
        var self = this;
        (function (polyline, point, transitionTime, dir) {
          self._timeoutTicker = setTimeout(function () {
            if (!self._timeoutTicker) return
            // self._trackLineFeatureGroup.addLayer(polyline);
            self._trackPointFeatureGroup.addLayer(point)
            self._marker.setIconAngle(dir)
          }, transitionTime)
        })(polyline, point, transitionTime, dir)

        // 移动目标
        // this._marker.setIconAngle(tick.dir);
        this._marker.move(latLng, transitionTime)
      } else {
        this.clearTrackInfo()
        // 绘制从开始到当前时间的历史轨迹线
        this.drawHistoryTrackLine(timestamp)
        // 绘制从开始到当前时间的历史轨迹点
        this.drawHistoryTrackPoints(timestamp)
      }
    }
  },

  drawHistoryTrackLine: function (timestamp) {
    var latlngs = []
    for (var i = 0, len = this._times.length; i < len; i++) {
      if (this._times[i] <= timestamp) {
        var latlng = this.getLatLng(this._times[i])
        if (latlng) {
          latlngs.push(latlng)
        }
      }
    }
    var polylineHis = L.polyline(latlngs, this.options.trackLineOptions)
    this._trackLineFeatureGroup.addLayer(polylineHis)
  },

  drawHistoryTrackPoints: function (timestamp) {
    for (var i = 0, len = this._times.length; i < len; i++) {
      if (this._times[i] <= timestamp) {
        var pt = this.createTrackPoint2(this._times[i])
        if (pt) {
          this._trackPointFeatureGroup.addLayer(pt)
        }
      }
    }
  },

  createTrackPoint2: function (timestamp) {
    var latlng = this.getLatLng(timestamp)
    if (latlng) var cricleMarker = L.circleMarker(latlng, this.options.OriginCircleOptions)
    var infoObj = this.tick(timestamp)
    if (infoObj) cricleMarker.bindTooltip(this.getTooltipText(infoObj), this.getTooltipOptions())
    // 将最后一个点的信息绑定到船舶上
    if (!this._marker) {
      this.setMarker(timestamp, this.options)
      this._map.addLayer(this._marker)
    }
    if (this._marker) {
      this._marker.setLatLng(latlng)
      this._marker.setIconAngle(infoObj.dir)
      this._marker.unbindTooltip()
      this._marker.bindTooltip(this.getTooltipText(infoObj), this.getTooltipOptions())
    }
    return cricleMarker
  },

  // 清除历史轨迹
  clearTrackInfo: function () {
    try {
      this.removeMarker()
      if (this._timeoutTicker) {
        clearTimeout(this._timeoutTicker)
        this._timeoutTicker = null
      }
      if (this._trackLineFeatureGroup) {
        this._trackLineFeatureGroup.clearLayers()
        // this._trackLineFeatureGroup = null;
      }
      if (this._trackPointFeatureGroup) {
        this._trackPointFeatureGroup.clearLayers()
        // this._trackPointFeatureGroup = null;
      }
    } catch (e) {
      console.log('tshf:clearlayer error')
    }
  }
})
