/*
 *  this._map  ;  this._container
 */
L.Control.PlayBack = L.Control.extend({

    options: {
        position: 'topright',
        speed: 13,
        Max_Speed: 20,
        trackLineOptions: { weight: 2, color: '#ef0300', renderer: L.svg() }, // 轨迹线配置
        OriginCircleOptions: { stroke: false, color: '#ef0300', fillColor: '#ef0300', fillOpacity: 1, radius: 4, renderer: L.svg() }, // 轨迹点配置
        layer: {
            // pointToLayer(featureData, latlng)
        },

        marker: { // marker options
            icon: L.icon({
                iconUrl: 'images/ship.png',
                iconSize: [12, 25],
                iconAnchor: [5, 12] // 解析后：margin-left:-5px;margin-top:-12px;
            })
        }
    },

    bootstrapIconClass: {
        play: 'glyphicon-play',
        stop: 'glyphicon-pause',
        restart: 'glyphicon-repeat',
        slow: 'glyphicon-backward',
        quick: 'glyphicon-forward',
        close: 'glyphicon-remove'
    },

    initialize: function(options) {
        L.Control.prototype.initialize.call(this, options)
        this._data = options.data || {}
    },

    onAdd: function(map) {
        this._initLayout()
        this._update()
        this._initEvts()
        return this._container
    },

    onRemove: function(map) {
        this._trackController.clearTracks()
    },

    getControlHtml: function() {
        var html = []
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

    _initLayout: function() {
        var className = 'leaflet-control-playback'
        this._container = L.DomUtil.create('div', className)

        if (L.DomEvent) {
            L.DomEvent.disableClickPropagation(this._container)
        }

        $container = $(this._container)
        $container.html(this.getControlHtml())

        this._operateObjs = {
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

    _initEvts: function() {
        L.DomEvent.on(this._operateObjs.play.get(0), 'click', this._play, this)
        L.DomEvent.on(this._operateObjs.restart.get(0), 'click', this._restart, this)
        L.DomEvent.on(this._operateObjs.slow.get(0), 'click', this._slow, this)
        L.DomEvent.on(this._operateObjs.quick.get(0), 'click', this._quick, this)
        L.DomEvent.on(this._operateObjs.close.get(0), 'click', this._close, this)
        L.DomEvent.on(this._operateObjs.range.get(0), 'click mousedown dbclick', L.DomEvent.stopPropagation)
            .on(this._operateObjs.range, 'click', L.DomEvent.preventDefault)
            .on(this._operateObjs.range, 'change', this._scrollchange, this)
            .on(this._operateObjs.range, 'mousemove', this._scrollchange, this)
    },

    _play: function() {
        var $this = this._operateObjs.play
        if ($this.hasClass(this.bootstrapIconClass.play)) {
            $this.removeClass(this.bootstrapIconClass.play)
            $this.addClass(this.bootstrapIconClass.stop)
            $this.attr('title', '停止')
            this._playbackClock.start()
        } else {
            $this.removeClass(this.bootstrapIconClass.stop)
            $this.addClass(this.bootstrapIconClass.play)
            $this.attr('title', '播放')
            this._playbackClock.stop()
        }
    },

    _restart: function() {
        this._playbackClock.rePlaying()
    },

    _slow: function() {
        this._playbackClock.slowSpeed()
        var sp = this._playbackClock.getSpeed()
        this._operateObjs.speed.html('X' + sp)
    },

    _quick: function() {
        this._playbackClock.quickSpeed()
        var sp = this._playbackClock.getSpeed()
        this._operateObjs.speed.html('X' + sp)
    },

    _close: function() {
        L.DomUtil.remove(this._container)
        if (this.onRemove) {
            this.onRemove(this._map)
        }
        return this
    },

    _scrollchange: function() {},

    _update: function() {
        var map = this._map,
            data = this._data
        if (map && data && data.features && data.features.length) {
            var tracks = []
            for (var i = 0, len = data.features.length; i < len; i++) {
                var track = new L.Playback.Track(map, data.features[i], this.options)
                tracks.push(track)
            }

            var trackController = this._trackController = new L.Playback.TrackController(map, tracks, this.options)
            this._playbackClock = new L.Playback.Clock(trackController, this._clockCallback.bind(this), this.options)

            this._operateObjs.speed.html('X' + this.options.speed)
            this.setTime()
            this._playbackClock.setCursor(this.getStartTime())
        }
    },

    setTime: function() {
        var startTime = L.Playback.Util.getTimeStrFromUnix(this.getStartTime()),
            endTime = L.Playback.Util.getTimeStrFromUnix(this.getEndTime()),
            curTime = L.Playback.Util.getTimeStrFromUnix(this.getCurTime())
        this._operateObjs.startTime.html(startTime)
        this._operateObjs.endTime.html(endTime)
        this._operateObjs.curTime.html(curTime)
        this._operateObjs.range.attr('min', this.getStartTime())
        this._operateObjs.range.attr('max', this.getEndTime())
        this._operateObjs.range.val(this.getCurTime())
    },

    getStartTime: function() {
        return this._playbackClock.getStartTime()
    },

    getEndTime: function() {
        return this._playbackClock.getEndTime()
    },

    getCurTime: function() {
        return this._playbackClock.getTime()
    },

    _clockCallback: function(ms) {
        // 更新时间
        var time = L.Playback.Util.getTimeStrFromUnix(ms)
        this._operateObjs.curTime.html(time)
        // 更新时间轴
        this._operateObjs.range.val(ms)
    }
})

L.control.playback = function(options) {
    return new L.Control.PlayBack(options)
}