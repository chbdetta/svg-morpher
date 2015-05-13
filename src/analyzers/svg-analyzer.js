import Vector from '../utilities/vector';

export function analyze(svgNode) {
	var segments = svgNode.pathSegList,
		points = [], last, startStart,
		cLastControl, qLastControl;

	Array.prototype.forEach.call(segments, (function(val) {

		var ret = [];

		switch(val.pathSegTypeAsLetter) {
			case 'M':
			case 'L':
				ret.push(new Vector(val.x, val.y));
				qLastControl = cLastControl = null;
				break;
			case 'H':
				ret.push(new Vector(val.x, last.y));
				qLastControl = cLastControl = null;
				break;
			case 'V':
				ret.push(new Vector(last.x, val.y));
				qLastControl = cLastControl = null;
				break;
			case 'm':
			case 'l':
				ret.push(last.add(new Vector(val.x, val.y)));
				qLastControl = cLastControl = null;
				break;
			case 'h':
				ret.push(last.add(new Vector(val.x, 0)));
				qLastControl = cLastControl = null;
				break;
			case 'v':
				ret.push(last.add(new Vector(0, val.y)));
				qLastControl = cLastControl = null;
				break;
			case 'S':
				cLastControl = cLastControl || last;
				ret = ret.concat(generateCurve(last, new Vector(val.x1, val.y1),
										cLastControl,
										new Vector(val.x, val.y)));
				qLastControl = null;
				break;
			case 'C':
				cLastControl = new Vector(val.x2, val.y2);
				ret = ret.concat(generateCurve(last, new Vector(val.x1, val.y1),
										cLastControl,
										new Vector(val.x, val.y)));
				qLastControl = null;

				break;
			case 'Q':
				ret = ret.concat(generateCurve(last, new Vector(val.x1, val.y1),
										new Vector(val.x, val.y)));
				cLastControl = null;
				break;
		}

		last = ret[ret.length - 1];

		if (ret.length > 0) {
			points = points.concat(ret);
		}
	}));

	return points;
}

function generateCurve(p0, p1, p2, ...rest) {
	var seg, p3;
	var ret = [];

	if (rest.length == 0) {
		seg = 30;
		iteration(1);
	} else if (rest.length === 1) {
		if (typeof rest[0] === 'number') {
			seg = rest[0];
			iteration(1);
		} else {
			seg = 30;
			p3 = rest[0];
			iteration(2);
		}
	} else if (rest.length === 2) {
		p3 = rest[0];
		seg = rest[1];
		iteration(2);
	}

	function iteration(mode) {
		var n = -1;
		if (mode === 1) {
			while(n ++ < seg) {
				ret.push(quadraticBezier(n / seg, p0, p1, p2));
			}
		} else if (mode === 2) {
			while(n ++ < seg) {
				ret.push(cubicBezier(n / seg, p0, p1, p2, p3));
			}
		}
	}

	return ret;
}

function quadraticBezier(t, p0, p1, p2) {
	if (t < 0 || t > 1) {
		throw new Error('t is out of range');
	}

	var a = 1 - t;
	return p0.scalar(a*a)
		.add(p1.scalar(2*a*t))
		.add(p2.scalar(t*t));
}

function cubicBezier(t, p0, p1, p2, p3) {
	if (t < 0 || t > 1) {
		throw new Error('t is out of range');
	}

	var a = 1 - t;
	return p0.scalar(a*a*a)
		.add(p1.scalar(3*a*a*t))
		.add(p2.scalar(3*a*t*t))
		.add(p3.scalar(t*t*t));
}