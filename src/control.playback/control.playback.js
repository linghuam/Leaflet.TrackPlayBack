import L from 'leaflet'
import $ from 'jquery'
import {PlayBack, playback} from '../leaflet.playback/index'
import './control.playback.css'

L.Control.PlayBack = L.Control.extend({

  options: {
    position: 'topright',
    data: {}
  },

  bootstrapIconClass: {
    play: 'glyphicon-play',
    stop: 'glyphicon-pause',
    restart: 'glyphicon-repeat',
    slow: 'glyphicon-backward',
    quick: 'glyphicon-forward',
    close: 'glyphicon-remove'
  },

  initialize: function (options) {
    L.Control.prototype.initialize.call(this, options)
    this._data = this.options.data
    this._playback = {}
  },

  onAdd: function (map) {
    this._initLayout()
    this._update()
    this._initEvts()
    return this._container
  },

  onRemove: function (map) {
    this._playback.draw.removeLayer()
  },

  getControlHtml: function () {
    var html = []
    html.push('<div class="optionsDiv">')
    html.push('<label><input type="checkbox" class="isshowpoint">显示轨迹点</label>')
    html.push('<label><input type="checkbox" class="isshowline">显示轨迹线</label>')
    html.push('</div>')
    html.push('<div class="operateContainer">')
    html.push('<span class="btn-play glyphicon glyphicon-play" title="播放"></span>')
    html.push('<span class="btn-restart glyphicon glyphicon-repeat" title="重播"></span>')
    html.push('<span class="btn-slow glyphicon glyphicon-backward" title="减速"></span>')
    html.push('<span class="btn-quick glyphicon glyphicon-forward" title="加速"></span>')
    html.push('<span class="speed"></span>')
    html.push('<span class="btn-close glyphicon glyphicon-remove" title="关闭"></span>')
    html.push('</div>')
    html.push('<div class="scrollContainer">')
    html.push('<span class="stime"></span>')
    html.push('<span class="etime"></span>')
    html.push('<input type="range" class="range"/>')
    html.push('<span class="curtime"></span>')
    html.push('</div>')
    return html.join('')
  },

  _initLayout: function () {
    var className = 'leaflet-control-playback'
    this._container = L.DomUtil.create('div', className)

    if (L.DomEvent) {
      L.DomEvent.disableClickPropagation(this._container)
    }

    var $container = $(this._container)
    $container.html(this.getControlHtml())

    this._operateObjs = {
      isshowpoint: $container.find('.isshowpoint'),
      isshowline: $container.find('.isshowline'),
      play: $container.find('.btn-play'),
      restart: $container.find('.btn-restart'),
      slow: $container.find('.btn-slow'),
      quick: $container.find('.btn-quick'),
      speed: $container.find('.speed'),
      close: $container.find('.btn-close'),
      startTime: $container.find('.stime'),
      endTime: $container.find('.etime'),
      range: $container.find('.range'),
      curTime: $container.find('.curtime')
    }
  },

  _initEvts: function () {
    L.DomEvent.on(this._operateObjs.isshowpoint.get(0), 'change', this._isshowpoint, this)
    L.DomEvent.on(this._operateObjs.isshowline.get(0), 'change', this._isshowline, this)
    L.DomEvent.on(this._operateObjs.play.get(0), 'click', this._play, this)
    L.DomEvent.on(this._operateObjs.restart.get(0), 'click', this._restart, this)
    L.DomEvent.on(this._operateObjs.slow.get(0), 'click', this._slow, this)
    L.DomEvent.on(this._operateObjs.quick.get(0), 'click', this._quick, this)
    L.DomEvent.on(this._operateObjs.close.get(0), 'click', this._close, this)
    L.DomEvent.on(this._operateObjs.range.get(0), 'click mousedown dbclick', L.DomEvent.stopPropagation)
      .on(this._operateObjs.range.get(0), 'click', L.DomEvent.preventDefault)
      .on(this._operateObjs.range.get(0), 'change', this._scrollchange, this)
      .on(this._operateObjs.range.get(0), 'mousemove', this._scrollchange, this)
  },

  _isshowpoint: function (e) {
    if (e.target.checked) {
      this._playback.draw.options.trackPointOptions.isDraw = true
    } else {
      this._playback.draw.options.trackPointOptions.isDraw = false
    }
    this._playback.draw.update()
  },

  _isshowline: function (e) {
    if (e.target.checked) {
      this._playback.draw.options.trackLineOptions.isDraw = true
    } else {
      this._playback.draw.options.trackLineOptions.isDraw = false
    }
    this._playback.draw.update()
  },

  _play: function () {
    var $this = this._operateObjs.play
    if ($this.hasClass(this.bootstrapIconClass.play)) {
      $this.removeClass(this.bootstrapIconClass.play)
      $this.addClass(this.bootstrapIconClass.stop)
      $this.attr('title', '停止')
      this._playback.clock.start()
    } else {
      $this.removeClass(this.bootstrapIconClass.stop)
      $this.addClass(this.bootstrapIconClass.play)
      $this.attr('title', '播放')
      this._playback.clock.stop()
    }
  },

  _restart: function () {
    var $play = this._operateObjs.play  // 播放开始改变播放按钮样式
    $play.removeClass(this.bootstrapIconClass.play)
    $play.addClass(this.bootstrapIconClass.stop)
    $play.attr('title', '停止')
    this._playback.clock.rePlaying()
  },

  _slow: function () {
    this._playback.clock.slowSpeed()
    var sp = this._playback.clock.getSpeed()
    this._operateObjs.speed.html('X' + sp)
  },

  _quick: function () {
    this._playback.clock.quickSpeed()
    var sp = this._playback.clock.getSpeed()
    this._operateObjs.speed.html('X' + sp)
  },

  _close: function () {
    L.DomUtil.remove(this._container)
    if (this.onRemove) {
      this.onRemove(this._map)
    }
    return this
  },

  _scrollchange: function (e) {
    var val = Number(e.target.value)
    this._playback.clock.setCursor(val)
  },

  _update: function () {
    var map = this._map
    var data = this._dataTransform(this._data.msg.shipList)
    if (map && data) {
      var tracks = []
      for (var i = 0, len = data.length; i < len; i++) {
        var track = new PlayBack.Track(data[i], this.options)
        tracks.push(track)
      }
      this._playback.draw = new PlayBack.Draw(map, this.options)
      this._playback.trackController = new PlayBack.TrackController(tracks, this._playback.draw, this.options)
      this._playback.clock = new PlayBack.Clock(this._playback.trackController, this._clockCallback.bind(this), this.options)

      this._operateObjs.speed.html('X' + this._playback.clock.getSpeed())
      this.setTime()
      this._playback.clock.setCursor(this.getStartTime())
    }
  },

  setTime: function () {
    var startTime = PlayBack.Util.getTimeStrFromUnix(this.getStartTime())
    var endTime = PlayBack.Util.getTimeStrFromUnix(this.getEndTime())
    var curTime = PlayBack.Util.getTimeStrFromUnix(this.getCurTime())
    this._operateObjs.startTime.html(startTime)
    this._operateObjs.endTime.html(endTime)
    this._operateObjs.curTime.html(curTime)
    this._operateObjs.range.attr('min', this.getStartTime())
    this._operateObjs.range.attr('max', this.getEndTime())
    this._operateObjs.range.val(this.getCurTime())
  },

  getStartTime: function () {
    return this._playback.clock.getStartTime()
  },

  getEndTime: function () {
    return this._playback.clock.getEndTime()
  },

  getCurTime: function () {
    return this._playback.clock.getCurTime()
  },

  _clockCallback: function (s) {
    // 更新时间
    var time = PlayBack.Util.getTimeStrFromUnix(s)
    this._operateObjs.curTime.html(time)
    // 更新时间轴
    this._operateObjs.range.val(s)
    // 播放结束后改变播放按钮样式
    if (s >= this.getEndTime()) {
      var $play = this._operateObjs.play
      $play.removeClass(this.bootstrapIconClass.stop)
      $play.addClass(this.bootstrapIconClass.play)
      $play.attr('title', '播放')
      this._playback.clock.stop()
    }
  },

  _dataTransform: function (data) {
    if (!data || !data.length) {
      console.log('playback_error:data transform error!')
      return
    }
    var datas = []
    for (var i = 0, len = data.length; i < len; i++) {
      var ph = data[i].num
      var dataobj = {}
      dataobj.timePosList = []
      for (var j = 0, lenj = data[i].posList.length; j < lenj; j++) {
        var obj = {}
        var pj = data[i].posList[j]
        obj.lng = pj.lo / 600000
        obj.lat = pj.la / 600000
        obj.time = pj.ti // 以秒为单位
        obj.dir = parseFloat(pj.co / 10)
        obj.heading = parseFloat(pj.he)
        obj.speed = parseFloat(pj.sp / 10)
        obj.info_ph = ph
        obj.info_lng = PlayBack.Util.latlngTodfmStr(obj.lat, 'lng')
        obj.info_lat = PlayBack.Util.latlngTodfmStr(obj.lat, 'lat')
        obj.info_time = PlayBack.Util.getTimeStrFromUnix(pj.ti)
        obj.info_dir = (pj.co / 10).toFixed(1) + '°'
        obj.info_heading = parseFloat(pj.he).toFixed(1) + '°'
        obj.info_speed = parseFloat(pj.sp / 10).toFixed(1) + '节'
        dataobj.timePosList.push(obj)
      }
      datas.push(dataobj)
    }
    return datas
  }
})

L.control.playback = function (options) {
  return new L.Control.PlayBack(options)
}
