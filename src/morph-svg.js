import * as easeFn from './utilities/easing'
import {match} from './utilities/interpolate'
import Morhper from './morpher'

function morph(from, diff, pc) {
	var _diff = diff.map(function(val) {
		return val.scalar(pc)
	})
	from.morph(_diff)
}

function translate(from, to, pc) {
	return from.translate(to.geometry.sub(from.geometry).scalar(pc))
}

function transform(a, b, {duration, easing, done}) {

	duration = duration || 400
	easing = easing || easeFn.linear
	if (typeof easing === 'string') {
		easing = easeFn[easing]
	}
	done = done || function() {}

	// for begin and ending states
	var ma = new Morhper(a)
	var mb = new Morhper(b)

	var _mb = new Morhper(a)

	var pa = ma.analyze()
	var pb = mb.analyze()

	_mb.node = mb.node.cloneNode()

	ma.fadeTo(1)
	_mb.fadeTo(0)

	a.style.visibility = 'hidden'
	b.style.visibility = 'hidden'

	a.parentNode.appendChild(ma.node)
	b.parentNode.appendChild(_mb.node);

	[pa, pb] = match(pa, pb)
	ma.setPoints(pa)
	mb.setPoints(pb)
	_mb.setPoints(pa)

	var diff = ma.points.map(function(val, index) {
		return mb.points[index].sub(val)
	})

	function _done() {
		ma.node.parentNode.removeChild(ma.node)
		_mb.node.parentNode.removeChild(_mb.node)

		b.style.visibility = 'visible'

		done()
	}

	var last = Date.now();

	(function run() {
		var dur = duration
		var elapse =  Date.now() - last

		var pc = easing(elapse / dur)
		if (elapse > dur) {
			pc = 1
		}

		translate(ma, mb, pc)
		translate(_mb, mb, pc)

		morph(ma, diff, pc)
		morph(_mb, diff, pc)

		ma.apply()
		_mb.apply()

		ma.fadeTo(1 - pc)
		_mb.fadeTo(pc)

		if (elapse <= dur) {
			requestAnimationFrame(run)
		} else {
			_done()
		}
	})()
}

export default transform
