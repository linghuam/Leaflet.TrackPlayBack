import L from 'leaflet'

L.Playback = L.Playback || {}

L.Playback.TrackController = L.Class.extend({

  initialize: function (map, tracks, options) {
    this.options = options || {}

    this._map = map

    this._tracks = []

    // initialize tick points
    this.setTracks(tracks)
  },

  clearTracks: function () { // 控件关闭时执行清理工作
    while (this._tracks.length > 0) {
      var track = this._tracks.pop()
      // var marker = track.getMarker();

      // if (marker) {
      //     this._map.removeLayer(marker);
      // }

      track.clearTrackInfo()
    }
  },

  clearNoDeletTrack: function () { // 清理轨迹，但不删除
    for (var i = 0, len = this._tracks.length; i < len; i++) {
      var track = this._tracks[i]
      track.clearTrackInfo()
    }
  },

  setTracks: function (tracks) {
    // reset current tracks
    this.clearTracks()

    this.addTracks(tracks)
  },

  addTracks: function (tracks) {
    // return if nothing is set
    if (!tracks) {
      return
    }

    if (tracks instanceof Array) {
      for (var i = 0, len = tracks.length; i < len; i++) {
        this.addTrack(tracks[i])
      }
    } else {
      this.addTrack(tracks)
    }
  },

        // add single track
  addTrack: function (track, timestamp) {
            // return if nothing is set
    if (!track) {
      return
    }

            // var marker = track.setMarker(timestamp, this.options);

            // if (marker) {
            //     marker.addTo(this._map);
            //     //定位到track所在位置
            //     this._map.panTo(marker.getLatLng());

    this._tracks.push(track)
            // }
  },

  tock: function (timestamp, transitionTime, lasttime) {
            // for (var i = 0, len = this._tracks.length; i < len; i++) {
            //     var latLng = this._tracks[i].getLatLng(timestamp);
            //     if (transitionTime === 0 || latLng) {
            //         this._tracks[i].moveMarker(latLng, transitionTime, timestamp);
            //     }
            // }

    for (var i = 0, len = this._tracks.length; i < len; i++) {
      var track = this._tracks[i]
      var latLng = track.getLatLng(timestamp)
      if (track.tick(lasttime) && !track.getMarker()) {
        var marker = track.setMarker(lasttime, this.options)
        if (marker) {
          this._map.addLayer(marker)
          track.moveMarker(marker.getLatLng(), 0, lasttime)
                        // this._map.panTo(marker.getLatLng());
        }
      }
      if (transitionTime === 0 || latLng) {
        track.moveMarker(latLng, transitionTime, timestamp)
      }
    }
  },

  locateToMarker: function (timestamp) {
    for (var i = 0, len = this._tracks.length; i < len; i++) {
      var track = this._tracks[i]
      var latLng = track.getLatLng(timestamp)
      if (latLng) {
        this._map.panTo(latLng)
        break
      }
    }
  },

  getStartTime: function () {
    var earliestTime = 0

    if (this._tracks.length > 0) {
      earliestTime = this._tracks[0].getStartTime()
      for (var i = 1, len = this._tracks.length; i < len; i++) {
        var t = this._tracks[i].getStartTime()
        if (t < earliestTime) {
          earliestTime = t
        }
      }
    }

    return earliestTime
  },

  getEndTime: function () {
    var latestTime = 0

    if (this._tracks.length > 0) {
      latestTime = this._tracks[0].getEndTime()
      for (var i = 1, len = this._tracks.length; i < len; i++) {
        var t = this._tracks[i].getEndTime()
        if (t > latestTime) {
          latestTime = t
        }
      }
    }

    return latestTime
  },

  getAllTimes: function () {
    var alltimes = []
            // concat
    if (this._tracks.length > 0) {
      for (var i = 0, len = this._tracks.length; i < len; i++) {
        var timesi = this._tracks[i].getTimes()
        alltimes = alltimes.concat(timesi)
      }
    }
            // unique
    alltimes = this.uniqueArr(alltimes)
            // sort
    for (var i = 0, leni = alltimes.length; i < leni - 1; i++) {
      for (var j = 0; j < leni - 1 - i; j++) {
        if (alltimes[j] > alltimes[j + 1]) {
          var temp = alltimes[j]
          alltimes[j] = alltimes[j + 1]
          alltimes[j + 1] = temp
        }
      }
    }

    return alltimes
  },

  uniqueArr: function (arr) {
    var temp = []
    for (var i = 0, len = arr.length; i < len; i++) {
      if (temp.indexOf(arr[i]) === -1) {
        temp.push(arr[i])
      }
    }
    return temp
  },

  getTracks: function () {
    return this._tracks
  }
})
