export var Util = {
  /* 根据unix时间戳(单位:秒)获取时间字符串 */
  getTimeStrFromUnix: function (time) {
    time = parseInt(time * 1000)
    if (isNaN(time)) {
      return ''
    }
    var newDate = new Date(time)
    var year = newDate.getFullYear()
    var month = (newDate.getMonth() + 1) < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1
    var day = newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate()
    var hours = newDate.getHours() < 10 ? '0' + newDate.getHours() : newDate.getHours()
    var minuts = newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes()
    var seconds = newDate.getSeconds() < 10 ? '0' + newDate.getSeconds() : newDate.getSeconds()
    var ret = year + '-' + month + '-' + day + ' ' + hours + ':' + minuts + ':' + seconds
    return ret
  },

  latlngTodfm: function (val, latlngtype, iskeepCapacity, spointCount) {
    var resobj = [];
    var dir;
    var newval = parseFloat(val);
    var positiveNum = Math.abs(newval);
    var du = parseInt(positiveNum);
    var fen = parseInt(positiveNum * 60) - du * 60;
    var miao = positiveNum * 60 * 60 - fen * 60 - du * 60 * 60;
    if (typeof spointCount === 'undefined' || spointCount <= 0) { spointCount = 0; }
    if (spointCount === 0) {
      miao = parseInt(miao);
    } else {
      miao = miao.toFixed(spointCount);
    }
    if (typeof iskeepCapacity === 'undefined') { iskeepCapacity = true; }
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
      if (newval < 0) dir = 'S';
      else dir = 'N';
    }
    if (latlngtype === 'lng') {
      if (newval < 0) dir = 'W';
      else dir = 'E';
    }
    resobj.push(du, fen, miao, dir);
    return resobj;
  },

  latlngTodfmStr: function (val, latlngtype, spointCount) {
    var res = this.latlngTodfm(val, latlngtype, spointCount);
    var str = res[3] + ' ' + res[0] + '°' + res[1] + '′' + res[2] + '″';
    return str;
  }
}
