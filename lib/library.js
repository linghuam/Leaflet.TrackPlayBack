(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Library", [], factory);
	else if(typeof exports === 'object')
		exports["Library"] = factory();
	else
		root["Library"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _index = __webpack_require__(1);

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

  initialize: function initialize(options) {
    L.Control.prototype.initialize.call(this, options);
    this._data = this.options.data;
    this._playback = {};
  },

  onAdd: function onAdd(map) {
    this._initLayout();
    this._update();
    this._initEvts();
    return this._container;
  },

  onRemove: function onRemove(map) {
    this._playback.draw.removeLayer();
  },

  getControlHtml: function getControlHtml() {
    var html = [];
    html.push('<div class="optionsDiv">');
    html.push('<label><input type="checkbox" class="isshowpoint">显示轨迹点</label>');
    html.push('<label><input type="checkbox" class="isshowline">显示轨迹线</label>');
    html.push('</div>');
    html.push('<div class="operateContainer">');
    html.push('<span class="btn-play glyphicon glyphicon-play" title="播放"></span>');
    html.push('<span class="btn-restart glyphicon glyphicon-repeat" title="重播"></span>');
    html.push('<span class="btn-slow glyphicon glyphicon-backward" title="减速"></span>');
    html.push('<span class="btn-quick glyphicon glyphicon-forward" title="加速"></span>');
    html.push('<span class="speed"></span>');
    html.push('<span class="btn-close glyphicon glyphicon-remove" title="关闭"></span>');
    html.push('</div>');
    html.push('<div class="scrollContainer">');
    html.push('<span class="stime"></span>');
    html.push('<span class="etime"></span>');
    html.push('<input type="range" class="range"/>');
    html.push('<span class="curtime"></span>');
    html.push('</div>');
    return html.join('');
  },

  _initLayout: function _initLayout() {
    var className = 'leaflet-control-playback';
    this._container = L.DomUtil.create('div', className);

    if (L.DomEvent) {
      L.DomEvent.disableClickPropagation(this._container);
    }

    var $container = $(this._container);
    $container.html(this.getControlHtml());

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
    };
  },

  _initEvts: function _initEvts() {
    L.DomEvent.on(this._operateObjs.isshowpoint.get(0), 'change', this._isshowpoint, this);
    L.DomEvent.on(this._operateObjs.isshowline.get(0), 'change', this._isshowline, this);
    L.DomEvent.on(this._operateObjs.play.get(0), 'click', this._play, this);
    L.DomEvent.on(this._operateObjs.restart.get(0), 'click', this._restart, this);
    L.DomEvent.on(this._operateObjs.slow.get(0), 'click', this._slow, this);
    L.DomEvent.on(this._operateObjs.quick.get(0), 'click', this._quick, this);
    L.DomEvent.on(this._operateObjs.close.get(0), 'click', this._close, this);
    L.DomEvent.on(this._operateObjs.range.get(0), 'click mousedown dbclick', L.DomEvent.stopPropagation).on(this._operateObjs.range.get(0), 'click', L.DomEvent.preventDefault).on(this._operateObjs.range.get(0), 'change', this._scrollchange, this).on(this._operateObjs.range.get(0), 'mousemove', this._scrollchange, this);
  },

  _isshowpoint: function _isshowpoint(e) {
    if (e.target.checked) {
      this._playback.draw.options.trackPointOptions.isDraw = true;
    } else {
      this._playback.draw.options.trackPointOptions.isDraw = false;
    }
    this._playback.draw.update();
  },

  _isshowline: function _isshowline(e) {
    if (e.target.checked) {
      this._playback.draw.options.trackLineOptions.isDraw = true;
    } else {
      this._playback.draw.options.trackLineOptions.isDraw = false;
    }
    this._playback.draw.update();
  },

  _play: function _play() {
    var $this = this._operateObjs.play;
    if ($this.hasClass(this.bootstrapIconClass.play)) {
      $this.removeClass(this.bootstrapIconClass.play);
      $this.addClass(this.bootstrapIconClass.stop);
      $this.attr('title', '停止');
      this._playback.clock.start();
    } else {
      $this.removeClass(this.bootstrapIconClass.stop);
      $this.addClass(this.bootstrapIconClass.play);
      $this.attr('title', '播放');
      this._playback.clock.stop();
    }
  },

  _restart: function _restart() {
    var $play = this._operateObjs.play; // 播放开始改变播放按钮样式
    $play.removeClass(this.bootstrapIconClass.play);
    $play.addClass(this.bootstrapIconClass.stop);
    $play.attr('title', '停止');
    this._playback.clock.rePlaying();
  },

  _slow: function _slow() {
    this._playback.clock.slowSpeed();
    var sp = this._playback.clock.getSpeed();
    this._operateObjs.speed.html('X' + sp);
  },

  _quick: function _quick() {
    this._playback.clock.quickSpeed();
    var sp = this._playback.clock.getSpeed();
    this._operateObjs.speed.html('X' + sp);
  },

  _close: function _close() {
    L.DomUtil.remove(this._container);
    if (this.onRemove) {
      this.onRemove(this._map);
    }
    return this;
  },

  _scrollchange: function _scrollchange(e) {
    var val = Number(e.target.value);
    this._playback.clock.setCursor(val);
  },

  _update: function _update() {
    var map = this._map;
    var data = this._dataTransform(this._data.msg.shipList);
    if (map && data) {
      var tracks = [];
      for (var i = 0, len = data.length; i < len; i++) {
        var track = new _index.PlayBack.Track(data[i], this.options);
        tracks.push(track);
      }
      this._playback.draw = new _index.PlayBack.Draw(map, this.options);
      this._playback.trackController = new _index.PlayBack.TrackController(tracks, this._playback.draw, this.options);
      this._playback.clock = new _index.PlayBack.Clock(this._playback.trackController, this._clockCallback.bind(this), this.options);

      this._operateObjs.speed.html('X' + this._playback.clock.getSpeed());
      this.setTime();
      this._playback.clock.setCursor(this.getStartTime());
    }
  },

  setTime: function setTime() {
    var startTime = _index.PlayBack.Util.getTimeStrFromUnix(this.getStartTime());
    var endTime = _index.PlayBack.Util.getTimeStrFromUnix(this.getEndTime());
    var curTime = _index.PlayBack.Util.getTimeStrFromUnix(this.getCurTime());
    this._operateObjs.startTime.html(startTime);
    this._operateObjs.endTime.html(endTime);
    this._operateObjs.curTime.html(curTime);
    this._operateObjs.range.attr('min', this.getStartTime());
    this._operateObjs.range.attr('max', this.getEndTime());
    this._operateObjs.range.val(this.getCurTime());
  },

  getStartTime: function getStartTime() {
    return this._playback.clock.getStartTime();
  },

  getEndTime: function getEndTime() {
    return this._playback.clock.getEndTime();
  },

  getCurTime: function getCurTime() {
    return this._playback.clock.getCurTime();
  },

  _clockCallback: function _clockCallback(s) {
    // 更新时间
    var time = _index.PlayBack.Util.getTimeStrFromUnix(s);
    this._operateObjs.curTime.html(time);
    // 更新时间轴
    this._operateObjs.range.val(s);
    // 播放结束后改变播放按钮样式
    if (s >= this.getEndTime()) {
      var $play = this._operateObjs.play;
      $play.removeClass(this.bootstrapIconClass.stop);
      $play.addClass(this.bootstrapIconClass.play);
      $play.attr('title', '播放');
      this._playback.clock.stop();
    }
  },

  _dataTransform: function _dataTransform(data) {
    if (!data || !data.length) {
      console.log('playback_error:data transform error!');
      return;
    }
    var datas = [];
    for (var i = 0, len = data.length; i < len; i++) {
      var ph = data[i].num;
      var dataobj = {};
      dataobj.timePosList = [];
      for (var j = 0, lenj = data[i].posList.length; j < lenj; j++) {
        var obj = {};
        var pj = data[i].posList[j];
        obj.lng = pj.lo / 600000; // 经度 【必须参数】
        obj.lat = pj.la / 600000; // 纬度 【必须参数】
        obj.time = pj.ti; // 以秒为单位的unix时间戳 【必须参数】
        obj.dir = parseFloat(pj.co / 10); // 航向 0-360度
        obj.heading = parseFloat(pj.he); // 航艏向 0-360度
        obj.info = [// 轨迹点信息
        { key: '批号', value: ph }, { key: '经度', value: _index.PlayBack.Util.latlngTodfmStr(obj.lat, 'lng') }, { key: '纬度', value: _index.PlayBack.Util.latlngTodfmStr(obj.lat, 'lat') }, { key: '时间', value: _index.PlayBack.Util.getTimeStrFromUnix(pj.ti) }, { key: '航向', value: (pj.co / 10).toFixed(1) + '°' }, { key: '航艏向', value: parseFloat(pj.he).toFixed(1) + '°' }, { key: '航速', value: parseFloat(pj.sp / 10).toFixed(1) + '节' }];
        dataobj.timePosList.push(obj);
      }
      datas.push(dataobj);
    }
    return datas;
  }
});

L.control.playback = function (options) {
  return new L.Control.PlayBack(options);
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.playback = exports.PlayBack = undefined;

var _track = __webpack_require__(2);

var _trackcontroller = __webpack_require__(3);

var _clock = __webpack_require__(4);

var _draw = __webpack_require__(6);

var _util = __webpack_require__(8);

var PlayBack = {};
var playback = {};

PlayBack.Track = _track.Track;
PlayBack.TrackController = _trackcontroller.TrackController;
PlayBack.Clock = _clock.Clock;
PlayBack.Draw = _draw.Draw;

playback.track = _track.track;
playback.trackController = _trackcontroller.trackController;
playback.clock = _clock.clock;
playback.draw = _draw.draw;

PlayBack.Util = _util.Util;

exports.PlayBack = PlayBack;
exports.playback = playback;

// window.L.PlayBack = PlayBack
// window.L.playback = playback

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// import L from 'leaflet'

var Track = exports.Track = L.Class.extend({

  initialize: function initialize(dataObj, options) {
    L.setOptions(this, options);

    this._trackPoints = [];
    this._timeTick = {};
    if (dataObj.timePosList && dataObj.timePosList.length) {
      for (var i = 0, len = dataObj.timePosList.length; i < len; i++) {
        // isOrigin标记是否属于原始点
        dataObj.timePosList[i].isOrigin = true;
        this._trackPoints.push(dataObj.timePosList[i]);
      }
      this._update();
    }
  },

  addTrackPoint: function addTrackPoint(trackPoint) {
    trackPoint.isOrigin = true;
    this._trackPoints.push(trackPoint);
    this._update();
  },

  getTimes: function getTimes() {
    var times = [];
    for (var i = 0, len = this._trackPoints.length; i < len; i++) {
      times.push(this._trackPoints[i].time);
    }
    return times;
  },

  getStartTrackPoint: function getStartTrackPoint() {
    return this._trackPoints[0];
  },

  getEndTrackPoint: function getEndTrackPoint() {
    return this._trackPoints[this._trackPoints.length - 1];
  },

  getTrackPointByTime: function getTrackPointByTime(time) {
    return this._timeTick[time];
  },

  getCalculateTrackPointByTime: function getCalculateTrackPointByTime(time) {
    // 先判断最后一个点是否为原始点
    var endpoint = this.getTrackPointByTime(time);
    var startPt = this.getStartTrackPoint();
    var endPt = this.getEndTrackPoint();
    var times = this.getTimes();
    if (time < startPt.time || time > endPt.time) return;
    var left = 0;
    var right = times.length - 1;
    var n;
    // 处理只有一个点情况
    if (left === right) {
      return endpoint;
    }
    while (right - left !== 1) {
      n = parseInt((left + right) / 2);
      if (time > times[n]) left = n;else right = n;
    }

    var t0 = times[left];
    var t1 = times[right];
    var t = time;
    if (!this.getTrackPointByTime(t0)) {
      console.log('error');
    }
    startPt = L.point(this.getTrackPointByTime(t0).lng, this.getTrackPointByTime(t0).lat);
    endPt = L.point(this.getTrackPointByTime(t1).lng, this.getTrackPointByTime(t1).lat);
    var s = startPt.distanceTo(endPt);
    // 不同时间在同一个点情形
    if (s <= 0) {
      endpoint = this.getTrackPointByTime(t1);
      return endpoint;
    }
    var v = s / (t1 - t0);
    var sinx = (endPt.y - startPt.y) / s;
    var cosx = (endPt.x - startPt.x) / s;
    var step = v * (t - t0);
    var x = startPt.x + step * cosx;
    var y = startPt.y + step * sinx;
    var dir = endPt.x >= startPt.x ? (Math.PI * 0.5 - Math.asin(sinx)) * 180 / Math.PI : (Math.PI * 1.5 + Math.asin(sinx)) * 180 / Math.PI;

    if (endpoint) {
      if (endpoint.dir === undefined) {
        endpoint.dir = dir;
      }
    } else {
      endpoint = {
        lng: x,
        lat: y,
        dir: dir,
        isOrigin: false,
        time: time
      };
    }
    return endpoint;
  },

  getTrackPointsBeforeTime: function getTrackPointsBeforeTime(time) {
    var tpoints = [];
    for (var i = 0, len = this._trackPoints.length; i < len; i++) {
      if (this._trackPoints[i].time < time) {
        tpoints.push(this._trackPoints[i]);
      }
    }
    var endPt = this.getCalculateTrackPointByTime(time);
    if (endPt) {
      tpoints.push(endPt);
    }
    return tpoints;
  },

  _update: function _update() {
    this._sortTrackPointsByTime();
    this._updatetimeTick();
  },

  _sortTrackPointsByTime: function _sortTrackPointsByTime() {
    var len = this._trackPoints.length;
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len - 1 - i; j++) {
        if (this._trackPoints[j].time > this._trackPoints[j + 1].time) {
          var tmp = this._trackPoints[j + 1];
          this._trackPoints[j + 1] = this._trackPoints[j];
          this._trackPoints[j] = tmp;
        }
      }
    }
  },

  _updatetimeTick: function _updatetimeTick() {
    this._timeTick = {};
    for (var i = 0, len = this._trackPoints.length; i < len; i++) {
      this._timeTick[this._trackPoints[i].time] = this._trackPoints[i];
    }
  }
});

var track = exports.track = function track(dataObj, options) {
  return new Track(dataObj, options);
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// import L from 'leaflet'

var TrackController = exports.TrackController = L.Class.extend({

  initialize: function initialize(tracks, draw, options) {
    L.setOptions(this, options);

    this._tracks = [];

    this._minTime = null;
    this._maxTime = null;

    this._draw = draw;

    if (tracks && tracks.length) {
      for (var i = 0, len = tracks.length; i < len; i++) {
        this._tracks.push(tracks[i]);
      }
    }

    this._update();

    this._caculateCount();
  },

  getMinTime: function getMinTime() {
    return this._minTime;
  },

  getMaxTime: function getMaxTime() {
    return this._maxTime;
  },

  addTrack: function addTrack(track) {
    if (track) {
      this._tracks.push(track);
      this._update();
    }
  },

  drawTracksByTime: function drawTracksByTime(time) {
    this._draw.clear();
    for (var i = 0, len = this._tracks.length; i < len; i++) {
      var track = this._tracks[i];
      var tps = track.getTrackPointsBeforeTime(time);
      if (tps && tps.length) this._draw.drawTrack(tps);
    }
  },

  _update: function _update() {
    if (this._tracks.length) {
      this._minTime = this._tracks[0].getStartTrackPoint().time;
      this._maxTime = this._tracks[0].getEndTrackPoint().time;
      for (var i = 0, len = this._tracks.length; i < len; i++) {
        var stime = this._tracks[i].getStartTrackPoint().time;
        var etime = this._tracks[i].getEndTrackPoint().time;
        if (stime < this._minTime) {
          this._minTime = stime;
        }
        if (etime > this._maxTime) {
          this._maxTime = etime;
        }
      }
    }
  },

  _caculateCount: function _caculateCount() {
    var shipCount = this._tracks.length;
    var pointCount = 0;
    for (var i = 0, len = shipCount; i < len; i++) {
      pointCount += this._tracks[i]._trackPoints.length;
    }
    console.log('共有: ' + shipCount + '艘船;');
    console.log('共有: ' + pointCount + '个轨迹点;');
  }

});

var trackController = exports.trackController = function trackController(tracks, draw, options) {
  return new TrackController(tracks, draw, options);
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clock = exports.Clock = undefined;

__webpack_require__(5);

var Clock = exports.Clock = L.Class.extend({

  options: {
    speed: 13,
    maxSpeed: 65
  },

  initialize: function initialize(trackController, callback, options) {
    L.setOptions(this, options);
    this._trackController = trackController;
    this._endTime = this._trackController.getMaxTime();
    this._curTime = this._trackController.getMinTime();
    this._speed = this.options.speed;
    this._maxSpeed = this.options.maxSpeed;
    this._callback = callback || function () {};
    this._lastFpsUpdateTime = 0;
  },

  // 计算帧率 ， 单位：帧/秒，浏览器的最大值是：60帧/秒
  caculateFps: function caculateFps(now) {
    var fps = 1000 / (now - this._lastFpsUpdateTime);
    return fps;
  },

  // 计算两帧时间间隔，单位：秒
  caculatefpsTime: function caculatefpsTime(now) {
    var time = (now - this._lastFpsUpdateTime) / 1000;
    if (this._lastFpsUpdateTime === 0) {
      time = 0;
    }
    this._lastFpsUpdateTime = now;
    return time;
  },

  _tick: function _tick() {
    var now = +new Date();
    var fpstime = this.caculatefpsTime(now);
    var isPause = false;
    var stepTime = fpstime * Math.pow(2, this._speed - 1);
    this._curTime += stepTime;
    if (this._curTime >= this._endTime) {
      this._curTime = this._endTime;
      isPause = true;
    }
    this._trackController.drawTracksByTime(this._curTime);
    this._callback(this._curTime);
    if (!isPause) this._intervalID = window.requestAnimationFrame(this._tick.bind(this));
  },

  start: function start() {
    if (this._intervalID) return;
    this._intervalID = window.requestAnimationFrame(this._tick.bind(this));
  },

  stop: function stop() {
    if (!this._intervalID) return;
    window.cancelAnimationFrame(this._intervalID);
    this._intervalID = null;
    this._lastFpsUpdateTime = 0;
  },

  rePlaying: function rePlaying() {
    this.stop();
    this._curTime = this._trackController.getMinTime();
    this.start();
  },

  slowSpeed: function slowSpeed() {
    this._speed <= 1 ? this._speed : this._speed -= 1;
    if (this._intervalID) {
      this.stop();
      this.start();
    }
  },

  quickSpeed: function quickSpeed() {
    this._speed >= this._maxSpeed ? this._speed : this._speed += 1;
    if (this._intervalID) {
      this.stop();
      this.start();
    }
  },

  getSpeed: function getSpeed() {
    return this._speed;
  },

  getCurTime: function getCurTime() {
    return this._curTime;
  },

  getStartTime: function getStartTime() {
    return this._trackController.getMinTime();
  },

  getEndTime: function getEndTime() {
    return this._trackController.getMaxTime();
  },

  isPlaying: function isPlaying() {
    return this._intervalID ? 1 : 0;
  },

  setCursor: function setCursor(time) {
    this._curTime = time;
    this._trackController.drawTracksByTime(this._curTime);
    this._callback(this._curTime);
  },

  setSpeed: function setSpeed(speed) {
    this._speed = speed;
    if (this._intervalID) {
      this.stop();
      this.start();
    }
  }
}); // import L from 'leaflet'
var clock = exports.clock = function clock(trackController, callback, options) {
  return new Clock(trackController, callback, options);
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// window = window || this
window.requestAnimationFrame = function () {
  var originalWebkitMethod,
      wrapper,
      callback,
      geckoVersion = 0,
      userAgent = navigator.userAgent,
      index = 0,
      self = this;

  // Workaround for chrome 10 bug where Chrome
  // does not pass the thime to the animation function

  if (window.webkitRequestAnimationFrame) {
    // Define the wrapper

    wrapper = function wrapper(time) {
      if (time === undefined) {
        time = +new Date();
      }
      self.callback(time);
    };

    // make the switch
    originalWebkitMethod = window.webkitRequestAnimationFrame;

    window.webkitRequestAnimationFrame = function (callback, element) {
      self.callback = callback;
      // Browser calls wrapper; wrapper calls callback
      originalWebkitMethod(wrapper, element);
    };
  }

  // Workaround for Gecko 2.0, which has a bug in
  // mozRequestAnimationFrame() that restricts animations to 30-40 fps
  if (window.mozRequestAnimationFrame) {
    // Check the Gecko version. Gecko is used by browsers
    // other than Firefox. Gecko 2.0 corresponds to Firefox 4.0
    index = userAgent.indexOf('rv:');
    if (userAgent.indexOf('Gecko') !== -1) {
      geckoVersion = userAgent.substr(index + 3, 3);
      if (geckoVersion === '2.0') {
        // Forces the return statement to fall through
        // to the setTimeout() function
        window.mozRequestAnimationFrame = undefined;
      }
    }
  }

  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {
    var start, finish;
    window.setTimeout(function () {
      start = +new Date();
      callback(start);
      finish = +new Date();
      self.timeout = 1000 / 60 - (finish - start);
    }, self.timeout);
  };
}();

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.draw = exports.Draw = undefined;

var _tracklayer = __webpack_require__(7);

var Draw = exports.Draw = L.Class.extend({

  options: {
    trackPointOptions: {
      isDraw: false,
      useCanvas: true,
      stroke: false,
      color: '#ef0300',
      fill: true,
      fillColor: '#ef0300',
      radius: 4
    },
    trackLineOptions: {
      isDraw: false,
      stroke: true,
      color: '#1C54E2', // stroke color
      weight: 2,
      fill: false,
      fillColor: '#000'
    },
    shipOptions: {
      useImg: false,
      imgUrl: '../../static/images/ship.png',
      width: 8,
      height: 18,
      color: '#00f', // stroke color
      fillColor: '#9FD12D'
    },
    toolTipOptions: {
      offset: [0, 0],
      direction: 'top',
      permanent: false
    }
  },

  initialize: function initialize(map, options) {
    L.setOptions(this, options);
    this._map = map;
    this._trackLayer = new _tracklayer.TrackLayer().addTo(map);
    this._canvas = this._trackLayer.getContainer();
    this._ctx = this._canvas.getContext('2d');
    this._bufferTracks = [];
    this._trackPointFeatureGroup = L.featureGroup([]).addTo(map);

    this._trackLayer.on('update', this._trackLayerUpdate, this);
    this._map.on('mousemove', this._onmousemoveEvt, this);
  },

  update: function update() {
    this._trackLayerUpdate();
  },

  _trackLayerUpdate: function _trackLayerUpdate() {
    if (this._bufferTracks.length) {
      this._clearLayer();
      this._bufferTracks.forEach(function (element, index) {
        this._drawTrack(element, false);
      }.bind(this));
    }
  },

  _onmousemoveEvt: function _onmousemoveEvt(e) {
    if (!this.options.trackPointOptions.isDraw) {
      return;
    }
    var point = e.layerPoint;
    if (this._bufferTracks.length) {
      for (var i = 0, leni = this._bufferTracks.length; i < leni; i++) {
        for (var j = 0, len = this._bufferTracks[i].length; j < len; j++) {
          var tpoint = this._map.latLngToLayerPoint(L.latLng(this._bufferTracks[i][j].lat, this._bufferTracks[i][j].lng));
          if (point.distanceTo(tpoint) <= this.options.trackPointOptions.radius) {
            this._opentoolTip(this._bufferTracks[i][j]);
            return;
          }
        }
      }
    }
    if (this._map.hasLayer(this._tooltip)) {
      this._map.removeLayer(this._tooltip);
    }
    this._canvas.style.cursor = 'pointer';
  },

  _opentoolTip: function _opentoolTip(trackpoint) {
    if (this._map.hasLayer(this._tooltip)) {
      this._map.removeLayer(this._tooltip);
    }
    this._canvas.style.cursor = 'default';
    var latlng = L.latLng(trackpoint.lat, trackpoint.lng);
    var tooltip = this._tooltip = L.tooltip(this.options.toolTipOptions);
    tooltip.setLatLng(latlng);
    tooltip.addTo(this._map);
    tooltip.setContent(this.getTooltipText(trackpoint));
  },

  _drawTrack: function _drawTrack(trackpoints) {
    // 画轨迹线
    if (this.options.trackLineOptions.isDraw) {
      this._drawTrackLine(trackpoints);
    }
    // 画船
    if (this.options.shipOptions.useImg) {
      this._drawShip2(trackpoints[trackpoints.length - 1]);
    } else {
      this._drawShip(trackpoints[trackpoints.length - 1]);
    }
    // 画经过的轨迹点
    if (this.options.trackPointOptions.isDraw) {
      if (this.options.trackPointOptions.useCanvas) {
        this._drawTrackPoints(trackpoints);
      } else {
        this._drawTrackPoints2(trackpoints);
      }
    }
  },

  drawTrack: function drawTrack(trackpoints) {
    this._bufferTracks.push(trackpoints);
    this._drawTrack(trackpoints);
  },

  _drawTrackLine: function _drawTrackLine(trackpoints) {
    var options = this.options.trackLineOptions;
    var tp0 = this._map.latLngToLayerPoint(L.latLng(trackpoints[0].lat, trackpoints[0].lng));
    this._ctx.save();
    this._ctx.beginPath();
    // 画轨迹线
    this._ctx.moveTo(tp0.x, tp0.y);
    for (var i = 1, len = trackpoints.length; i < len; i++) {
      var tpi = this._map.latLngToLayerPoint(L.latLng(trackpoints[i].lat, trackpoints[i].lng));
      this._ctx.lineTo(tpi.x, tpi.y);
    }
    if (options.stroke) {
      this._ctx.strokeStyle = options.color;
      this._ctx.lineWidth = options.weight;
      this._ctx.stroke();
    }
    if (options.fill) {
      this._ctx.fillStyle = options.fillColor;
      this._ctx.fill();
    }
    this._ctx.restore();
  },

  _drawTrackPoints: function _drawTrackPoints(trackpoints) {
    var options = this.options.trackPointOptions;
    this._ctx.save();
    for (var i = 0, len = trackpoints.length; i < len; i++) {
      if (trackpoints[i].isOrigin) {
        var latLng = L.latLng(trackpoints[i].lat, trackpoints[i].lng);
        var radius = options.radius;
        var point = this._map.latLngToLayerPoint(latLng);
        this._ctx.beginPath();
        this._ctx.arc(point.x, point.y, radius, 0, Math.PI * 2, false);
        if (options.stroke) {
          this._ctx.strokeStyle = options.color;
          this._ctx.stroke();
        }
        if (options.fill) {
          this._ctx.fillStyle = options.fillColor;
          this._ctx.fill();
        }
      }
    }
    this._ctx.restore();
  },

  _drawTrackPoints2: function _drawTrackPoints2(trackpoints) {
    for (var i = 0, len = trackpoints.length; i < len; i++) {
      if (trackpoints[i].isOrigin) {
        var latLng = L.latLng(trackpoints[i].lat, trackpoints[i].lng);
        var cricleMarker = L.circleMarker(latLng, this.options.trackPointOptions);
        cricleMarker.bindTooltip(this.getTooltipText(trackpoints[i]), this.options.toolTipOptions);
        this._trackPointFeatureGroup.addLayer(cricleMarker);
      }
    }
  },

  _drawShip: function _drawShip(trackpoint) {
    var point = this._map.latLngToLayerPoint(L.latLng(trackpoint.lat, trackpoint.lng));
    var rotate = trackpoint.dir || 0;
    var w = this.options.shipOptions.width;
    var h = this.options.shipOptions.height;
    var dh = h / 3;

    this._ctx.save();
    this._ctx.fillStyle = this.options.shipOptions.fillColor;
    this._ctx.strokeStyle = this.options.shipOptions.color;
    this._ctx.translate(point.x, point.y);
    this._ctx.rotate(Math.PI / 180 * rotate);
    this._ctx.beginPath();
    this._ctx.moveTo(0, 0 - h / 2);
    this._ctx.lineTo(0 - w / 2, 0 - h / 2 + dh);
    this._ctx.lineTo(0 - w / 2, 0 + h / 2);
    this._ctx.lineTo(0 + w / 2, 0 + h / 2);
    this._ctx.lineTo(0 + w / 2, 0 - h / 2 + dh);
    this._ctx.closePath();
    this._ctx.fill();
    this._ctx.stroke();
    this._ctx.restore();
  },

  _drawShip2: function _drawShip2(trackpoint) {
    var point = this._map.latLngToLayerPoint(L.latLng(trackpoint.lat, trackpoint.lng));
    var dir = trackpoint.dir || 0;
    var width = this.options.shipOptions.width;
    var height = this.options.shipOptions.height;
    var offset = {
      x: width / 2,
      y: height / 2
    };
    var img = new Image();
    img.onload = function () {
      this._ctx.save();
      this._ctx.translate(point.x, point.y);
      this._ctx.rotate(Math.PI / 180 * dir);
      this._ctx.drawImage(img, 0 - offset.x, 0 - offset.y, width, height);
      this._ctx.restore();
    }.bind(this);
    img.src = this.options.shipOptions.imgUrl;
  },

  getTooltipText: function getTooltipText(targetobj) {
    var content = [];
    content.push('<table>');
    if (targetobj.info && targetobj.info.length) {
      for (var i = 0, len = targetobj.info.length; i < len; i++) {
        content.push('<tr>');
        content.push('<td>' + targetobj.info[i].key + '</td>');
        content.push('<td>' + targetobj.info[i].value + '</td>');
        content.push('</tr>');
      }
    }
    content.push('</table>');
    content = content.join('');
    return content;
  },

  removeLayer: function removeLayer() {
    if (this._map.hasLayer(this._trackLayer)) {
      this._map.removeLayer(this._trackLayer);
    }
    if (this._map.hasLayer(this._trackPointFeatureGroup)) {
      this._map.removeLayer(this._trackPointFeatureGroup);
    }
  },

  _clearLayer: function _clearLayer() {
    var bounds = this._trackLayer.getBounds();
    if (bounds) {
      var size = bounds.getSize();
      this._ctx.clearRect(bounds.min.x, bounds.min.y, size.x, size.y);
    } else {
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
    if (this._map.hasLayer(this._trackPointFeatureGroup)) {
      this._trackPointFeatureGroup.clearLayers();
    }
  },

  clear: function clear() {
    this._clearLayer();
    this._bufferTracks = [];
  }
}); // import L from 'leaflet'
var draw = exports.draw = function draw(map, options) {
  return new Draw(map, options);
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// import L from 'leaflet'

var TrackLayer = exports.TrackLayer = L.Renderer.extend({

  initialize: function initialize(options) {
    L.Renderer.prototype.initialize.call(this, options);
    this.options.padding = 0.1;
  },

  onAdd: function onAdd(map) {
    this._container = L.DomUtil.create('canvas', 'leaflet-zoom-animated');
    this._container.setAttribute('id', 'canvas');

    var pane = map.getPane(this.options.pane);
    pane.appendChild(this._container);

    this._ctx = this._container.getContext('2d');

    this._update();
  },

  onRemove: function onRemove(map) {
    L.DomUtil.remove(this._container);
  },

  getContainer: function getContainer() {
    return this._container;
  },

  getBounds: function getBounds() {
    return this._bounds;
  },

  _update: function _update() {
    if (this._map._animatingZoom && this._bounds) {
      return;
    }

    L.Renderer.prototype._update.call(this);

    var b = this._bounds,
        container = this._container,
        size = b.getSize(),
        m = L.Browser.retina ? 2 : 1;

    L.DomUtil.setPosition(container, b.min);

    // set canvas size (also clearing it); use double size on retina
    container.width = m * size.x;
    container.height = m * size.y;
    container.style.width = size.x + 'px';
    container.style.height = size.y + 'px';

    if (L.Browser.retina) {
      this._ctx.scale(2, 2);
    }

    // translate so we use the same path coordinates after canvas element moves
    this._ctx.translate(-b.min.x, -b.min.y);

    // Tell paths to redraw themselves
    this.fire('update');
  }
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var Util = exports.Util = {
  /* 根据unix时间戳(单位:秒)获取时间字符串 */
  getTimeStrFromUnix: function getTimeStrFromUnix(time) {
    time = parseInt(time * 1000);
    if (isNaN(time)) {
      return '';
    }
    var newDate = new Date(time);
    var year = newDate.getFullYear();
    var month = newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1;
    var day = newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate();
    var hours = newDate.getHours() < 10 ? '0' + newDate.getHours() : newDate.getHours();
    var minuts = newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes();
    var seconds = newDate.getSeconds() < 10 ? '0' + newDate.getSeconds() : newDate.getSeconds();
    var ret = year + '-' + month + '-' + day + ' ' + hours + ':' + minuts + ':' + seconds;
    return ret;
  },

  latlngTodfm: function latlngTodfm(val, latlngtype, iskeepCapacity, spointCount) {
    var resobj = [];
    var dir;
    var newval = parseFloat(val);
    var positiveNum = Math.abs(newval);
    var du = parseInt(positiveNum);
    var fen = parseInt(positiveNum * 60) - du * 60;
    var miao = positiveNum * 60 * 60 - fen * 60 - du * 60 * 60;
    if (typeof spointCount === 'undefined' || spointCount <= 0) {
      spointCount = 0;
    }
    if (spointCount === 0) {
      miao = parseInt(miao);
    } else {
      miao = miao.toFixed(spointCount);
    }
    if (typeof iskeepCapacity === 'undefined') {
      iskeepCapacity = true;
    }
    if (iskeepCapacity) {
      if (latlngtype === 'lng') {
        if (du < 10) du = '00' + du;
        if (du >= 10 && du < 100) du = '0' + du;
      } else {
        if (du < 10) du = '0' + du;
      }
      // if(fen<10) fen = '0'+fen;
      // if(miao<10 && spointCount===0) miao = '0'+miao;
    }
    if (latlngtype === 'lat') {
      if (newval < 0) dir = 'S';else dir = 'N';
    }
    if (latlngtype === 'lng') {
      if (newval < 0) dir = 'W';else dir = 'E';
    }
    resobj.push(du, fen, miao, dir);
    return resobj;
  },

  latlngTodfmStr: function latlngTodfmStr(val, latlngtype, spointCount) {
    var res = this.latlngTodfm(val, latlngtype, spointCount);
    var str = res[3] + ' ' + res[0] + '°' + res[1] + '′' + res[2] + '″';
    return str;
  }
};

/***/ })
/******/ ]);
});
//# sourceMappingURL=Library.js.map