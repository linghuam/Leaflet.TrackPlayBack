import L from 'leaflet'

L.Playback = L.Playback || {}

L.Playback.Clock = L.Class.extend({

  options: {
    intervalTime: 100,
    speed: 1
  },

  initialize: function (trackController, callback, options) {
    this._trackController = trackController
    L.setOptions(options, this)
  },
  
  start: function () {

    var endTime = this._trackController.getMaxTime()
    var curTime = this._trackController.getMinTime()

  },

  stop : function () {},  

  quickSpeed: function () {},

  slowSpeed: function () {}

})

