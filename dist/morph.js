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

var easing = _interopRequireWildcard(_utilitiesEasing);

var _utilitiesInterpolate = require('./utilities/interpolate');

var _utilitiesInterpolate2 = _interopRequireDefault(_utilitiesInterpolate);

var _morpher = require('./morpher');

var _morpher2 = _interopRequireDefault(_morpher);

function morph(mover, morpher, dv, pc) {
	var d = '';
	morpher.points.forEach(function (val, index) {
		var vec = val.add(dv[index].scalar(pc)).add(mover.geometry);

		if (index === 0) {
			d += 'M ' + vec.x + ' ' + vec.y;
		} else {
			d += 'L ' + vec.x + ' ' + vec.y + ' ';
		}
	});

	d += 'Z';

	return d;
}

function translate(from, to, pc) {
	return from.geometry.add(to.geometry.sub(from.geometry).scalar(pc));
}

function transform(a, b, _ref) {
	var duration = _ref.duration;
	var easeMode = _ref.easeMode;
	var done = _ref.done;

	// for begin and ending states
	var ma = new _morpher2['default'](a);
	var mb = new _morpher2['default'](b);

	ma.analyze();
	mb.analyze();

	// for moving animation
	var mover = new _morpher2['default'](ma);
	mover.node.style.visibility = 'visible';

	a.style.visibility = 'hidden';
	b.style.visibility = 'hidden';

	var last = Date.now();
	a.parentNode.appendChild(mover.node);

	var _match = _utilitiesInterpolate.match(ma.points, mb.points);

	var _match2 = _slicedToArray(_match, 2);

	ma.points = _match2[0];
	mb.points = _match2[1];

	var differ = ma.points.map(function (val, index) {
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
		var elapse = Date.now() - last;

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

var REGX_PATH_SEPARATOR = /\B(?=[A-z])|\b(?=[A-z])|\s(?=[A-z])/;
var REGX_CARRIER = /[\n\r]/g;
var REGX_PAHT_NUMBER = /[+\-]*\s*[0-9\.]+/g;

function analyze(node) {
	var d = node.getAttribute('d');
	d = d.replace(REGX_CARRIER, '').trim();
	d = d.split(REGX_PATH_SEPARATOR);

	var last,
	    points = [];

	d.forEach(function (val) {
		var op = val.match(/[A-z]+/)[0];
		var num = val.match(REGX_PAHT_NUMBER);

		if (num === null) {
			return;
		}

		num.forEach(function (val, index) {
			num[index] = parseFloat(val);
		});

		var ret;

		switch (op) {
			case 'M':
			case 'L':
				ret = new _utilitiesVector2['default'](num[0], num[1]);
				break;
			case 'H':
				ret = new _utilitiesVector2['default'](num[0], last.y);
				break;
			case 'V':
				ret = new _utilitiesVector2['default'](last.x, num[0]);
				break;
			case 'm':
			case 'l':
				ret = last.add(new _utilitiesVector2['default'](num[0], num[1]));
				break;
			case 'h':
				ret = last.add(new _utilitiesVector2['default'](num[0], 0));
				break;
			case 'v':
				ret = last.add(new _utilitiesVector2['default'](0, num[0]));
				break;
		}

		last = ret;

		if (ret) {
			points.push(ret);
		}
	});

	return points;
}

function bezierCurve() {}

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

var Morpher = (function () {
	function Morpher(node) {
		_classCallCheck(this, Morpher);

		if (typeof node === 'undefined') {
			return false;
		}

		if (node instanceof Morpher) {
			this.center = node.center;
			this.geometry = node.geometry;
			this.left = node.left;
			this.right = node.right;
			this.top = node.top;
			this.bottom = node.bottom;
			this.points = node.points;
			this.node = node.node.cloneNode();
		} else {
			this.node = node.cloneNode();
		}

		this.node.setAttribute('id', '_Morph_' + ~ ~(Math.random() * 10000));
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
			var points, left, right, top, bottom;
			var me = this;

			// analyze the points using specific analyzer
			points = _analyzersSvgAnalyzer.analyze(this.node);

			points.forEach(function (val, index) {
				right = right !== undefined ? val.x <= points[right].x ? right : index : index;
				left = left !== undefined ? val.x >= points[left].x ? left : index : index;
				top = top !== undefined ? val.y <= points[top].y ? top : index : index;
				bottom = bottom !== undefined ? val.y >= points[bottom].y ? bottom : index : index;
			});

			this.left = points[left];
			this.right = points[right];
			this.top = points[top];
			this.bottom = points[bottom];
			this.center = new _utilitiesVector2['default']((this.right.x + this.left.x) / 2, (this.top.y + this.bottom.y) / 2);
			this.geometry = this.center;

			console.log(left, top, right, bottom);

			// make sure points are odered in  clockwise
			if ((top - left + points.length) % points.length < (bottom - left + points.length) % points.length) {
				console.log('reverse');
				points.reverse();
			}

			// and rearrange them putting the start point at left most
			_utilitiesRotate.rotate(points, -points.indexOf(this.left));

			// recalculate the points according to the geometry
			points.forEach(function (val, index) {
				var vec = val.sub(me.geometry);
				points[index].x = vec.x;
				points[index].y = vec.y;
			});

			// console.log(points);

			this.points = points;
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

	console.log('start interpolate', points, 'target', targetLength);

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

	console.log('end interpolate', ret);

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