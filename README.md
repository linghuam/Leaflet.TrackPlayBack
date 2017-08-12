# Leaflet-TrackPlayback-Control

## Introduce

基于leaflet+canvas+vuejs实现的海上船舶轨迹回放插件，支持轨迹的播放、暂停、快进、快退操作以及上万个轨迹点的显示和上千条轨迹的回放。

![效果图1](./static/images/1.png)

![效果图2](./static/images/2.png)


## Example

[查看Demo](https://linghuam.github.io/TrackPlayback/dist/index.html)

``` javascript
// 调用代码
import L from 'leaflet'
import '../assets/leaflet.googlelayer'
import '../control.playback/control.playback'
import Data from '../assets/data/3.json'

export default {
  mounted () {
    this.initMap()
  },
  methods: {
    initMap () {
      this.map = L.map('leaflet-map').setView([34, 133], 8)
      L.tileLayer.GoogleLayer().addTo(this.map)
      L.control.playback({
        data: Data
      }).addTo(this.map)
    }
  }
}
```

## Usage

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## Custome your Data

you can change the method '_dataTransform' in 'src/control.playback/control.playback.js'

to transform data to standard format like this.

```
// standard format data
[
  {
    timePosList: [{lat:30, lng:116, time:1502529980, dir:320, heading:300, info:[]}, ....]
  },
  {
    timePosList: [{lat:30, lng:116, time:1502529980, dir:320, heading:300, info:[]}, ....]
  },
  {
    timePosList: [{lat:30, lng:116, time:1502529980, dir:320, heading:300, info:[]}, ....]
  }...
]

```

## Problem

如果您有好的建议或意见,[欢迎提问](https://github.com/linghuam/TrackPlayback/issues)


## Recommend

* [HTML5 Canvas核心技术(书籍)](https://book.douban.com/subject/24533314/)
* [html5 canvas教程](http://www.w3cplus.com/blog/tags/616.html?page=1)
* [曲线轨迹动画原理](http://www.tuicool.com/articles/zaeQf22)
* [WebGIS中使用ZRender实现轨迹前端动态播放特效](http://www.cnblogs.com/naaoveGIS/p/6718822.html)


## License

[MIT license](https://opensource.org/licenses/mit-license.php)
