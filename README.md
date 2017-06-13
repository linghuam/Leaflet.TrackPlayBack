## Leaflet-trackPlayback-Control 

基于leaflet实现的海上船舶轨迹回放插件，支持轨迹的播放、暂停、快进、快退操作。兼容leaflet V1+。
查看[demo](https://linghuam.github.io/TrackPlayback/src/index.html)

### Download and Usage
下载该库，使用方法见src/index.html示例。

### Data
采用geojson格式数据
、、、 json
{
  "type": "Feature",
  "geometry": {
    "type": "MultiPoint",
    "coordinates": [/*array of [lng,lat] coordinates*/]
  },
  "properties": {
    "time": [/*array of UNIX timestamps*/]
  }
}
、、、

### 拓展阅读
[曲线轨迹动画原理](http://www.tuicool.com/articles/zaeQf22)
[WebGIS中使用ZRender实现轨迹前端动态播放特效](http://www.cnblogs.com/naaoveGIS/p/6718822.html)