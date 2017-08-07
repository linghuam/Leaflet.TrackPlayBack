import L from 'leaflet'

L.Playback = L.Playback || {}

L.Playback.Track = L.Class.extend({

  initialize : function (map, dataObj, options) {
    this._map = map
    this._trackPoints = []
    this.options = options || {}
    
    if(dataObj.timePosList && dataObj.timePosList.length) {
        for(var i = 0, len = dataObj.timePosList.length; i < len; i++) {
          this.addTrackPoint(dataObj.timePosList[i])
        }
    }
  },

  addTrackPoint : function (trackPoint) {
    this._trackPoints.push(trackPoint);
  },

  getTimes : function () {
    var times = []
    for(let i = 0, len = this._trackPoints.length; i < len; i++) {
      times.push(this._trackPoints[i].time)
    }
    return times;
  },

  getStartTrackPoint : function () {
    return this._trackPoints[0]
  },

  getEndTrackPoint : function () {
    return this._trackPoints[this._trackPoints.length-1]
  },

  getTrackPointByTime : function (time) {
    for(let i = 0, len = this._trackPoints.length; i < len; i++) {
      if (this._trackPoints[i].time === time) {
        return this._trackPoints[i]
      }
    }    
  },

  getCalculateTrackPointByTime : function (time) {
    var startPt = this.getStartTrackPoint()
    var endPt = this.getEndTrackPoint()
    var times = this.getTimes()
    if (time < startPt.time || time > endPt.time) return;
    var left = 0
    var right = times.length - 1 
    var n = undefined
    while (right - left !== 1) {
      n = parseInt((left + right) / 2)
      if (time > times[n]) left = n 
      else right = n
    }
    
    var t0 = times[left]
    var t1 = times[right]
    var t = time
    startPt = L.point(this.getTrackPointByTime(t0).lng,this.getTrackPointByTime(t0).lat) 
    endPt = L.point(this.getTrackPointByTime(t1).lng,this.getTrackPointByTime(t1).lat) 
    var s = startPt.distanceTo(endPt);
    var v = s / (t1 - t0)
    var sinx = (endPt.y - startPt.y) / s
    var cosx = (endPt.x - startPt.x) /s
    var step = v * (t - t0)
    var x = startPt.x + step * cosx
    var y = startPt.y + step * sinx
    return {
      lng: x,
      lat: y,
      time: time
    }

  },

  getTrackPointsBeforeTime: function (time) {
    var tpoints = []
    for(let i = 0, len = this._trackPoints.length; i < len; i++){
      if(this._trackPoints[i].time < time){
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
