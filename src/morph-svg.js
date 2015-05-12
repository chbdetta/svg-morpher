import Vector from "./utilities/vector";
import * as easing from './utilities/easing';
import interpolate, {match} from './utilities/interpolate';
import Morhper from './morpher';

function morph(mover, morpher, dv, pc) {
	var d = '';
	morpher.points.forEach(function(val, index) {
		let vec = val.add(dv[index].scalar(pc)).add(mover.geometry);

		if (index === 0 ) {
			d += `M ${vec.x} ${vec.y}`;
		} else {
			d += `L ${vec.x} ${vec.y} `;
		}

	});

	d += 'Z';

	return d;
}

function translate(from, to, pc) {
	return from.geometry.add(to.geometry.sub(from.geometry).scalar(pc));
}

function transform(a, b, {duration, easeMode, done}) {

	// for begin and ending states
	var ma = new Morhper(a);
	var mb = new Morhper(b);

	ma.analyze();
	mb.analyze();

	// for moving animation
	var mover = new Morhper(ma);
	mover.node.style.visibility = 'visible';

	a.style.visibility = 'hidden';
	b.style.visibility = 'hidden';

	var last = Date.now();
	a.parentNode.appendChild(mover.node);

	[ma.points, mb.points] = match(ma.points, mb.points);

	let differ = ma.points.map(function(val, index) {
		var ret = mb.points[index].sub(val);
		return ret;
	});

	function _done() {
		mover.node.parentNode.removeChild(mover.node);
		b.style.visibility = 'visible';

		if (done) {
			done();
		}
	}

	(function run() {
		var dur = duration;
		var elapse =  Date.now() - last;

		var pc = easing[easeMode](elapse / dur);
		if (elapse > dur) {
			pc = 1;
		}

		mover.geometry = translate(ma, mb, pc);
		mover.node.setAttribute('d', morph(mover, ma, differ, pc));

		if (elapse <= dur) {
			requestAnimationFrame(run);
		} else {
			_done();
		}
	})();
}

export default transform;