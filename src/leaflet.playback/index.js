import {Track, track} from './track'
import {TrackController, trackController} from './trackcontroller'
import {Clock, clock} from './clock'
import {Draw, draw} from './draw'
import {Util} from './util'

var PlayBack = {}
var playback = {}

PlayBack.Track = Track
PlayBack.TrackController = TrackController
PlayBack.Clock = Clock
PlayBack.Draw = Draw


playback.track = track
playback.trackController = trackController
playback.clock = clock
playback.draw = draw

PlayBack.Util = Util

export {PlayBack, playback}
