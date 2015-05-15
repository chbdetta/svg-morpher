(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.morph = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

var _utilitiesVector = require('./utilities/vector');

var _utilitiesVector2 = _interopRequireDefault(_utilitiesVector);

var _utilitiesEasing = require('./utilities/easing');

var easeFn = _interopRequireWildcard(_utilitiesEasing);

var _utilitiesInterpolate = require('./utilities/interpolate');

var _utilitiesInterpolate2 = _interopRequireDefault(_utilitiesInterpolate);

var _morpher = require('./morpher');

var _morpher2 = _interopRequireDefault(_morpher);

function morph(from, diff, pc) {
	var _diff = diff.map(function (val, index) {
		return val.scalar(pc);
	});
	from.morph(_diff);
}

function translate(from, to, pc) {
	return from.translate(to.geometry.sub(from.geometry).scalar(pc));
}

function transform(a, b, _ref) {
	var duration = _ref.duration;
	var easing = _ref.easing;
	var done = _ref.done;

	duration = duration || 400;
	easing = easing || easeFn.linear;
	if (typeof easing === 'string') {
		easing = easeFn[easing];
	}
	done = done || function () {};

	// for begin and ending states
	var ma = new _morpher2['default'](a);
	var mb = new _morpher2['default'](b);

	var _mb = new _morpher2['default'](a);

	var pa = ma.analyze();
	var pb = mb.analyze();

	_mb.node = mb.node.cloneNode();

	ma.fadeTo(1);
	_mb.fadeTo(0);

	a.style.visibility = 'hidden';
	b.style.visibility = 'hidden';

	a.parentNode.appendChild(ma.node);
	b.parentNode.appendChild(_mb.node);

	var _match = _utilitiesInterpolate.match(pa, pb);

	var _match2 = _slicedToArray(_match, 2);

	pa = _match2[0];
	pb = _match2[1];

	ma.setPoints(pa);
	mb.setPoints(pb);
	_mb.setPoints(pa);

	var diff = ma.points.map(function (val, index) {
		return mb.points[index].sub(val);
	});

	function _done() {
		ma.node.parentNode.removeChild(ma.node);
		_mb.node.parentNode.removeChild(_mb.node);

		b.style.visibility = 'visible';

		done();
	}

	var last = Date.now();

	(function run() {
		var dur = duration;
		var elapse = Date.now() - last;

		var pc = easing(elapse / dur);
		if (elapse > dur) {
			pc = 1;
		}

		translate(ma, mb, pc);
		translate(_mb, mb, pc);

		morph(ma, diff, pc);
		morph(_mb, diff, pc);

		ma.apply();
		_mb.apply();

		ma.fadeTo(1 - pc);
		_mb.fadeTo(pc);

		if (elapse <= dur) {
			requestAnimationFrame(run);
		} else {
			_done();
		}
	})();
}

exports['default'] = transform;
module.exports = exports['default'];

},{"./morpher":3,"./utilities/easing":4,"./utilities/interpolate":5,"./utilities/vector":7}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.analyze = analyze;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilitiesVector = require('../utilities/vector');

var _utilitiesVector2 = _interopRequireDefault(_utilitiesVector);

function analyze(svgNode) {
	var segments = svgNode.pathSegList,
	    points = [],
	    last,
	    lastCurveBegin;

	Array.prototype.forEach.call(segments, function (val, index) {

		var ret = [];

		switch (val.pathSegTypeAsLetter) {
			case 'M':
			case 'L':
				ret.push(new _utilitiesVector2['default'](val.x, val.y));
				break;
			case 'H':
				ret.push(new _utilitiesVector2['default'](val.x, last.y));
				break;
			case 'V':
				ret.push(new _utilitiesVector2['default'](last.x, val.y));
				break;
			case 'm':
			case 'l':
				ret.push(last.add(new _utilitiesVector2['default'](val.x, val.y)));
				break;
			case 'h':
				ret.push(last.add(new _utilitiesVector2['default'](val.x, 0)));
				break;
			case 'v':
				ret.push(last.add(new _utilitiesVector2['default'](0, val.y)));
				break;
			case 'S':
				var firstCtrlPoint = undefined,
				    prevSeg = segments[index - 1];
				// previous segment is cubic curve
				if (prevSeg.pathSegTypeAsLetter === 'c') {
					firstCtrlPoint = new _utilitiesVector2['default'](prevSeg.x2, prevSeg.y2).add(last);
				} else if (prevSeg.pathSegTypeAsLetter === 's') {
					firstCtrlPoint = new _utilitiesVector2['default'](prevSeg.x1, prevSeg.y1).add(last);
				} else if (prevSeg.pathSegTypeAsLetter === 'C' || prevSeg.pathSegTypeAsLetter === 'S') {
					firstCtrlPoint = reflect(new _utilitiesVector2['default'](prevSeg.x2, prevSeg.y2), last);
				} else {
					firstCtrlPoint = last;
				}
				ret = ret.concat(generateCurve(last, firstCtrlPoint, new _utilitiesVector2['default'](val.x2, val.y2), new _utilitiesVector2['default'](val.x, val.y)));
				break;
			case 'C':
				ret = ret.concat(generateCurve(last, new _utilitiesVector2['default'](val.x1, val.y1), new _utilitiesVector2['default'](val.x2, val.y2), new _utilitiesVector2['default'](val.x, val.y)));

				break;
			case 'Q':
				ret = ret.concat(generateCurve(last, new _utilitiesVector2['default'](val.x1, val.y1), new _utilitiesVector2['default'](val.x, val.y)));
				break;
			case 'T':
				var firstCtrlPoint = undefined,
				    prevSeg = segments[index - 1];
				// previous segment is cubic curve
				if (prevSeg.pathSegTypeAsLetter === 'q') {
					firstCtrlPoint = new _utilitiesVector2['default'](prevSeg.x1, prevSeg.y1).add(last);
				} else if (prevSeg.pathSegTypeAsLetter === 't') {
					firstCtrlPoint = new _utilitiesVector2['default'](prevSeg.x1, prevSeg.y1).add(last);
				} else if (prevSeg.pathSegTypeAsLetter === 'Q') {
					firstCtrlPoint = reflect(new _utilitiesVector2['default'](prevSeg.x1, prevSeg.y1), last);
				} else {
					firstCtrlPoint = last;
				}

				ret = ret.concat(generateCurve(last, firstCtrlPoint, new _utilitiesVector2['default'](val.x, val.y)));
				break;
			case 'c':
				ret = ret.concat(generateCurve(last, new _utilitiesVector2['default'](val.x1, val.y1).add(last), new _utilitiesVector2['default'](val.x2, val.y2).add(last), new _utilitiesVector2['default'](val.x, val.y).add(last)));
				break;
			case 'q':
				ret = ret.concat(generateCurve(last, new _utilitiesVector2['default'](val.x1, val.y1).add(last), new _utilitiesVector2['default'](val.x, val.y).add(last)));
				break;
		}

		lastCurveBegin = last;
		last = ret[ret.length - 1];

		if (ret.length > 0) {
			points = points.concat(ret);
		}
	});

	return points;
}

/**
 * the reflection of p relative to o
 * @param  {[type]} p [description]
 * @param  {[type]} o [description]
 * @return {[type]}   [description]
 */
function reflect(p, o) {
	return p.add(o.sub(p).scalar(2));
}

function generateCurve(p0, p1, p2) {
	for (var _len = arguments.length, rest = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
		rest[_key - 3] = arguments[_key];
	}

	var seg, p3;
	var ret = [];

	if (rest.length === 0) {
		seg = 15;
		iteration(1);
	} else if (rest.length === 1) {
		if (typeof rest[0] === 'number') {
			seg = rest[0];
			iteration(1);
		} else {
			seg = 15;
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
			while (n++ < seg) {
				ret.push(quadraticBezier(n / seg, p0, p1, p2));
			}
		} else if (mode === 2) {
			while (n++ < seg) {
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
	return p0.scalar(a * a).add(p1.scalar(2 * a * t)).add(p2.scalar(t * t));
}

function cubicBezier(t, p0, p1, p2, p3) {
	if (t < 0 || t > 1) {
		throw new Error('t is out of range');
	}

	var a = 1 - t;
	return p0.scalar(a * a * a).add(p1.scalar(3 * a * a * t)).add(p2.scalar(3 * a * t * t)).add(p3.scalar(t * t * t));
}

},{"../utilities/vector":7}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _analyzersSvgAnalyzer = require('./analyzers/svg-analyzer');

var _utilitiesVector = require('./utilities/vector');

var _utilitiesVector2 = _interopRequireDefault(_utilitiesVector);

var _utilitiesRotate = require('./utilities/rotate');

var svgNamespace = 'http://www.w3.org/2000/svg';

function defineProp(obj, prop, value) {
	obj['_' + prop] = value;
	Object.defineProperty(obj, prop, {
		get: function get() {
			return value;
		},
		set: function set(val) {
			this['_' + prop] = val;
		}
	});
}

var Morpher = (function () {
	function Morpher(node) {
		_classCallCheck(this, Morpher);

		if (typeof node === 'undefined') {
			return false;
		}

		this.node = node.cloneNode();
		this.node.setAttribute('id', '_Morph_' + ~ ~(Math.random() * 10000));

		this._points = [];
	}

	_createClass(Morpher, [{
		key: 'analyze',

		/**
   * analyze the svg element and squeeze out the point list
   * @param  {Element} node svg element
   * @param  {Integer} seg  the segment for curve separation
   * @return {Object}       abstract information
   */
		value: function analyze() {
			// analyze the points using specific analyzer
			return _analyzersSvgAnalyzer.analyze(this.node);
		}
	}, {
		key: 'setPoints',
		value: function setPoints(points) {
			var left, right, top, bottom;
			var me = this;

			points.forEach(function (val, index) {
				right = right !== undefined ? val.x <= points[right].x ? right : index : index;
				left = left !== undefined ? val.x >= points[left].x ? left : index : index;
				top = top !== undefined ? val.y <= points[top].y ? top : index : index;
				bottom = bottom !== undefined ? val.y >= points[bottom].y ? bottom : index : index;
			});

			this['left'] = points[left];
			this['right'] = points[right];
			this['top'] = points[top];
			this['bottom'] = points[bottom];
			this['center'] = new _utilitiesVector2['default']((this.right.x + this.left.x) / 2, (this.top.y + this.bottom.y) / 2);
			this['geometry'] = this._geometry = this.center;

			// make sure points are odered in  clockwise
			if ((top - left + points.length) % points.length < (bottom - left + points.length) % points.length) {
				console.log('reverse');
				points.reverse();
			}

			// and rearrange them putting the start point at left most
			// to make the transition look more reasonable
			_utilitiesRotate.rotate(points, -points.indexOf(this.left));

			// recalculate the points according to the geometry
			this.points = this._points = points.map(function (val, index) {
				return val.sub(me.geometry);
			});

			console.log(left, top, right, bottom);
		}
	}, {
		key: 'fadeTo',
		value: function fadeTo(n) {
			this.node.style.visibility = 'visible';
			this.node.style.opacity = n;
		}
	}, {
		key: 'apply',
		value: function apply() {
			var d = '';
			var me = this;

			// for efficiency purpose, we delay adding geometry here
			d = this._points.reduce(function (prev, cur, index) {
				var vec = cur.add(me._geometry);

				if (index === 0) {
					return prev + ('M ' + vec.x + ' ' + vec.y);
				} else {
					return prev + ('L ' + vec.x + ' ' + vec.y);
				}
			}, d);

			d += 'Z';

			this.node.setAttribute('d', d);
		}
	}, {
		key: 'translate',
		value: function translate(vec) {
			this._geometry = this.geometry.add(vec);
		}
	}, {
		key: 'morph',
		value: function morph(dvec) {
			this._points = this.points.map(function (val, index) {
				return val.add(dvec[index]);
			});
		}
	}]);

	return Morpher;
})();

exports['default'] = Morpher;
module.exports = exports['default'];

},{"./analyzers/svg-analyzer":2,"./utilities/rotate":6,"./utilities/vector":7}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.linear = linear;
exports.easeIn = easeIn;
exports.easeOut = easeOut;
exports.easeInOut = easeInOut;

function linear(pos) {
	return pos;
}

function easeIn(pos) {
	return Math.pow(pos, 3);
}

function easeOut(pos) {
	return Math.pow(pos - 1, 3) + 1;
}

function easeInOut(pos) {
	if ((pos /= 0.5) < 1) {
		return 0.5 * Math.pow(pos, 3);
	}

	return 0.5 * (Math.pow(pos - 2, 3) + 2);
}

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.match = match;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _vector = require('./vector');

var _vector2 = _interopRequireDefault(_vector);

/**
 * Interpolate points into a point list to make enough points
 * for morphing
 * @param  {Array} points        original point list
 * @param  {Array} targetLength    the target number of points
 * @return {Array}               new created point list
 */
function interpolate(points, targetLength) {
	var distance = Math.abs(targetLength - points.length);

	//console.log('start interpolate', points, 'target', targetLength);

	var ret = [];

	var i = 0,
	    j = 0,
	    flag = true;

	while (ret.length < targetLength) {
		if (i >= points.length) {
			insert(i);
			i = 0;
			points = ret;
			ret = [];
			flag = true;
		}

		if (j >= distance || flag) {
			ret.push(points[i]);
			i++;
			flag = !flag;
		} else {
			insert(i);
		}
	}

	function insert(i) {
		var p = points[i % points.length].add(points[i - 1]).scalar(0.5);
		ret.push(p);
		j++;
		flag = !flag;
	}

	//console.log('end interpolate', ret);

	return ret;
}

exports['default'] = interpolate;

function match(pointsA, pointsB) {
	if (pointsA.length < pointsB.length) {
		return [interpolate(pointsA, pointsB.length), pointsB];
	} else {
		return [pointsA, interpolate(pointsB, pointsA.length)];
	}
}

},{"./vector":7}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
// rotate an array to left
exports.rotate = rotate;

function rotate(arr, position) {
	position %= arr.length;
	var i = 0,
	    j = 0,
	    n = arr.length,
	    temp = arr[0],
	    cur = arr[0];

	while (n--) {
		i = (i + position + arr.length) % arr.length;

		temp = arr[i];
		arr[i] = cur;

		cur = temp;

		if (i === j) {
			i++;
			j++;

			cur = arr[i];
		}
	}
}

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Vector = (function () {
	function Vector() {
		var x = arguments[0] === undefined ? 0 : arguments[0];
		var y = arguments[1] === undefined ? 0 : arguments[1];

		_classCallCheck(this, Vector);

		if (x instanceof Vector || x.x && x.y) {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x;
			this.y = y;
		}
	}

	_createClass(Vector, [{
		key: 'add',
		value: function add(vec) {
			return new Vector(this.x + vec.x, this.y + vec.y);
		}
	}, {
		key: 'sub',
		value: function sub(vec) {
			return new Vector(this.x - vec.x, this.y - vec.y);
		}
	}, {
		key: 'dist',
		value: function dist(len) {
			if (typeof len !== 'undefined') {
				var ratio = len / this.dist();
				return this.scalar(ratio);
			} else return Math.sqrt(this.x * this.x + this.y * this.y);
		}
	}, {
		key: 'scalar',
		value: function scalar(n) {
			return new Vector(this.x * n, this.y * n);
		}
	}, {
		key: 'isParallel',
		value: function isParallel(vec) {
			return vec.x === 0 && vec.y === 0 || this.x === 0 && this.y === 0 || vec.y / vec.x === this.y / this.x || this.y === 0 && vec.y === 0 && this.x === vec.x;
		}
	}]);

	return Vector;
})();

exports['default'] = Vector;
module.exports = exports['default'];

},{}]},{},[1])(1)
});