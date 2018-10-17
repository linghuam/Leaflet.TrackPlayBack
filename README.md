# Leaflet.TrackPlayBack

## Introduce

It's a track playback plugin based on leaflet and HTML5 canvas. To use it,you need provide some GPS data and time data, then you can play the track on the map.

Support track playback, pause, fast forward, fast reverse operation.

## Requirements

- leaflet version: >=0.7

## Demo

[Click here to see demo](https://linghuam.github.io/Leaflet.TrackPlayBack/)

## Usage

Using npm:

```shell
npm i leaflet-plugin-trackplayback
```

```js
```

Using script tag:

```html
  <link rel="stylesheet" href="./lib/leaflet/leaflet.css">
  <!--Optional (only if you need plaback control)-->
  <link rel="stylesheet" href="../dist/control.playback.css">
  <script src="./lib/leaflet/leaflet.js"></script>
  <!--Optional (only if you need plaback control)-->
  <script src="../dist/control.trackplayback.js"></script>
  <script src="../dist/leaflet.trackplayback.js"></script>
```

```js
    const trackplayback = L.trackplayback(data, map);
    // Optional  (only if you need plaback control)
    const trackplaybackControl = L.trackplaybackcontrol(trackplayback);
    trackplaybackControl.addTo(map);
```

## API reference

### constructor(data, map, options)

`data` can be:

```
[{lat:30, lng:116, time:1502529980, dir:320, info:[{key: 'name', value: 'ship1'}]}, ....]
```

when you want to play back one track

or

```
[[{lat:30, lng:116, time:1502529980, dir:320, info:[]}, ....], [{lat:30, lng:116, time:1502529980, dir:320, info:[]}, ....]]
```

when you want to play back one more track.

the trackpoint obj properties:

- lat: Latitude of target
- lng: Longitude of target
- time: unix timestamp
- dir(Optional): Moving direction(0-360 degrees, Clockwise direction), if you don't provide it, the program can auto caculate the target direction
- info(Optional): other static information of the target, it's an array of key-value pairs


`map` is the L.map instance.


`options` can be:

```js
const Options = {
  // the play options
  clockOptions: {
    // the default speed
    // caculate method: fpstime * Math.pow(2, speed - 1)
    // fpstime is the two frame time difference
    speed: 13,
    // the max speed
    maxSpeed: 65
  },
  // trackPoint options
  trackPointOptions: {
    // whether draw track point
    isDraw: false,
    // whether use canvas to draw it, if false, use leaflet api `L.circleMarker`
    useCanvas: true,
    stroke: false,
    color: '#ef0300',
    fill: true,
    fillColor: '#ef0300',
    opacity: 0.3,
    radius: 4
  },
  // trackLine options
  trackLineOptions: {
    // whether draw track line
    isDraw: false,
    stroke: true,
    color: '#1C54E2',
    weight: 2,
    fill: false,
    fillColor: '#000',
    opacity: 0.3
  },
  // target options
  targetOptions: {
    // whether use image to display target, if false, the program provide a default
    useImg: false,
    // if useImg is true, provide the imgUrl
    imgUrl: '../../static/images/ship.png',
    // the width of target, unit: px
    width: 8,
    // the height of target, unit: px
    height: 18,
    // the stroke color of target, effective when useImg set false
    color: '#00f',
    // the fill color of target, effective when useImg set false
    fillColor: '#9FD12D'
  }
}

```

example:

```js
const trackplayback = L.trackplayback(data, map, options)
// or
const trackplayback = new L.TrackPlayBack(data, map, options)
```

### events

```js
// trigger on time change
trackplayback.on('tick', e => {
  console.log(e.time)
}, this)
```

### methods

#### trackplayback.start()

start play, return this

#### trackplayback.stop()

stop play, return this

#### trackplayback.rePlaying()

replay, return this

#### trackplayback.slowSpeed()

slow play speed, return this

#### trackplayback.quickSpeed()

quick play speed, return this

#### trackplayback.getSpeed()

get play speed, return speed value

#### trackplayback.getCurTime()

get current time, return unix timestamp

#### trackplayback.getStartTime()

get start time, return unix timestamp

#### trackplayback.getEndTime()

get end time, return unix timestamp

#### trackplayback.isPlaying()

whether in playing, return true or false

#### trackplayback.setCursor(time)

set current playing time, need a unix timestamp param, return this

#### trackplayback.setSpeed(speed)

set the playback speed, return this

#### trackplayback.showTrackPoint()

draw track point, return this

#### trackplayback.hideTrackPoint()

remove track point, return this

#### trackplayback.showTrackLine()

draw track line, return this

#### trackplayback.hideTrackLine()

remove track line, return this

## Issues

If you have good suggestions or comments,[welcome to ask questions](https://github.com/linghuam/TrackPlayback/issues).

## Recommends

* [html5 canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
* [LeafletPlayback](https://github.com/hallahan/LeafletPlayback)


## License

[MIT license](https://opensource.org/licenses/mit-license.php)
