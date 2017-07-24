import L from 'leaflet'

L.Playback = L.Playback || {}

L.Playback.Util = {
   /* 根据unix时间戳获取时间字符串 */
  getTimeStrFromUnix: function (time) {
    time = parseInt(time)
    if (isNaN(time)) {
      return ''
    }
    var newDate = new Date(time)
            // var newDate = new Date(time);
    var year = newDate.getFullYear()
    var month = (newDate.getMonth() + 1) < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1
    var day = newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate()
    var hours = newDate.getHours() < 10 ? '0' + newDate.getHours() : newDate.getHours()
    var minuts = newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes()
    var seconds = newDate.getSeconds() < 10 ? '0' + newDate.getSeconds() : newDate.getSeconds()
    var ret = year + '-' + month + '-' + day + ' ' + hours + ':' + minuts + ':' + seconds
    return ret
  }
}
