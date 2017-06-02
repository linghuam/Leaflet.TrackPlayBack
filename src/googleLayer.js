/*
* google地图
* 跟保船地址一致
*/
(function(){
	var  Config = {
	     errorUrl:'',
	     tempurl:'http://mt{num}.google.cn/vt/lyrs={lyrs}&hl=zh-CN&gl=cn&s=Gal&z={z}&x={x}&y={y}'
	 };

	L.TileLayer.GoogleLayer = L.TileLayer.extend({

		initialize : function(url, options) {
			options = options || {};
			L.setOptions(this, options);
			options.errorTileUrl = Config.errorUrl;
			this._url = Config.tempurl;
			L.TileLayer.prototype.initialize.call(this, this._url, options);
		},

		getTileUrl:function(tilePoint){
	        return L.Util.template(this._url,{
	        	num:2,
	            x: tilePoint.x,
	            y: tilePoint.y,
	            z: tilePoint.z,
	            lyrs: this.options.lyrs || 'm' //m：路线图 t：地形图 p：带标签的地形图 s：卫星图 y：带标签的卫星图 h：标签层（路名、地名等）
	        });
		}
	});

	L.tileLayer.GoogleLayer = function(url, options) {
		return new L.TileLayer.GoogleLayer(url, options);
	};

})();


