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
