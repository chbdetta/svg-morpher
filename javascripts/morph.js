var morph =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/public/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _easing = __webpack_require__(1);

	var easeFn = _interopRequireWildcard(_easing);

	var _interpolate = __webpack_require__(2);

	var _morpher = __webpack_require__(4);

	var _morpher2 = _interopRequireDefault(_morpher);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function morph(from, diff, pc) {
		var _diff = diff.map(function (val) {
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
		var ma = new _morpher2.default(a);
		var mb = new _morpher2.default(b);

		var _mb = new _morpher2.default(a);

		var pa = ma.analyze();
		var pb = mb.analyze();

		_mb.node = mb.node.cloneNode();

		ma.fadeTo(1);
		_mb.fadeTo(0);

		a.style.visibility = 'hidden';
		b.style.visibility = 'hidden';

		a.parentNode.appendChild(ma.node);
		b.parentNode.appendChild(_mb.node);

		var _match = (0, _interpolate.match)(pa, pb);

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

	module.exports = transform;

/***/ },
/* 1 */
/***/ function(module, exports) {

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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.match = match;

	var _vector = __webpack_require__(3);

	var _vector2 = _interopRequireDefault(_vector);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

	exports.default = interpolate;
	function match(pointsA, pointsB) {
		if (pointsA.length < pointsB.length) {
			return [interpolate(pointsA, pointsB.length), pointsB];
		} else {
			return [pointsA, interpolate(pointsB, pointsA.length)];
		}
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Vector = function () {
		function Vector() {
			var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
			var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

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
	}();

		exports.default = Vector;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _svgAnalyzer = __webpack_require__(5);

	var _vector = __webpack_require__(3);

	var _vector2 = _interopRequireDefault(_vector);

	var _rotate = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

	var Morpher = function () {
		function Morpher(node) {
			_classCallCheck(this, Morpher);

			if (typeof node === 'undefined') {
				return false;
			}

			this.node = node.cloneNode();
			this.node.setAttribute('id', '_Morph_' + ~~(Math.random() * 10000));

			this._points = [];
		}

		/**
	  * analyze the svg element and squeeze out the point list
	  * @param  {Element} node svg element
	  * @param  {Integer} seg  the segment for curve separation
	  * @return {Object}       abstract information
	  */


		_createClass(Morpher, [{
			key: 'analyze',
			value: function analyze() {
				// analyze the points using specific analyzer
				return (0, _svgAnalyzer.analyze)(this.node);
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
				this['center'] = new _vector2.default((this.right.x + this.left.x) / 2, (this.top.y + this.bottom.y) / 2);
				this['geometry'] = this._geometry = this.center;

				// make sure points are odered in  clockwise
				if ((top - left + points.length) % points.length < (bottom - left + points.length) % points.length) {
					console.log('reverse');
					points.reverse();
				}

				// and rearrange them putting the start point at left most
				// to make the transition look more reasonable
				(0, _rotate.rotate)(points, -points.indexOf(this.left));

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
	}();

		exports.default = Morpher;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.analyze = analyze;

	var _vector = __webpack_require__(3);

	var _vector2 = _interopRequireDefault(_vector);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(6);

	function analyze(svgNode) {
	  var segments = svgNode.pathSegList._list,
	      points = [],
	      last;

	  Array.prototype.forEach.call(segments, function (val, index) {

	    var ret = [];

	    switch (val.pathSegTypeAsLetter) {
	      case 'M':
	      case 'L':
	        ret.push(new _vector2.default(val.x, val.y));
	        break;
	      case 'H':
	        ret.push(new _vector2.default(val.x, last.y));
	        break;
	      case 'V':
	        ret.push(new _vector2.default(last.x, val.y));
	        break;
	      case 'm':
	      case 'l':
	        ret.push(last.add(new _vector2.default(val.x, val.y)));
	        break;
	      case 'h':
	        ret.push(last.add(new _vector2.default(val.x, 0)));
	        break;
	      case 'v':
	        ret.push(last.add(new _vector2.default(0, val.y)));
	        break;
	      case 'S':
	        var firstCtrlPoint = void 0,
	            prevSeg = segments[index - 1];
	        // previous segment is cubic curve
	        if (prevSeg.pathSegTypeAsLetter === 'c') {
	          firstCtrlPoint = new _vector2.default(prevSeg.x2, prevSeg.y2).add(last);
	        } else if (prevSeg.pathSegTypeAsLetter === 's') {
	          firstCtrlPoint = new _vector2.default(prevSeg.x1, prevSeg.y1).add(last);
	        } else if (prevSeg.pathSegTypeAsLetter === 'C' || prevSeg.pathSegTypeAsLetter === 'S') {
	          firstCtrlPoint = reflect(new _vector2.default(prevSeg.x2, prevSeg.y2), last);
	        } else {
	          firstCtrlPoint = last;
	        }
	        ret = ret.concat(generateCurve(last, firstCtrlPoint, new _vector2.default(val.x2, val.y2), new _vector2.default(val.x, val.y)));
	        break;
	      case 'C':
	        ret = ret.concat(generateCurve(last, new _vector2.default(val.x1, val.y1), new _vector2.default(val.x2, val.y2), new _vector2.default(val.x, val.y)));

	        break;
	      case 'Q':
	        ret = ret.concat(generateCurve(last, new _vector2.default(val.x1, val.y1), new _vector2.default(val.x, val.y)));
	        break;
	      case 'T':
	        firstCtrlPoint, prevSeg = segments[index - 1];
	        // previous segment is cubic curve
	        if (prevSeg.pathSegTypeAsLetter === 'q') {
	          firstCtrlPoint = new _vector2.default(prevSeg.x1, prevSeg.y1).add(last);
	        } else if (prevSeg.pathSegTypeAsLetter === 't') {
	          firstCtrlPoint = new _vector2.default(prevSeg.x1, prevSeg.y1).add(last);
	        } else if (prevSeg.pathSegTypeAsLetter === 'Q') {
	          firstCtrlPoint = reflect(new _vector2.default(prevSeg.x1, prevSeg.y1), last);
	        } else {
	          firstCtrlPoint = last;
	        }

	        ret = ret.concat(generateCurve(last, firstCtrlPoint, new _vector2.default(val.x, val.y)));
	        break;
	      case 'c':
	        ret = ret.concat(generateCurve(last, new _vector2.default(val.x1, val.y1).add(last), new _vector2.default(val.x2, val.y2).add(last), new _vector2.default(val.x, val.y).add(last)));
	        break;
	      case 'q':
	        ret = ret.concat(generateCurve(last, new _vector2.default(val.x1, val.y1).add(last), new _vector2.default(val.x, val.y).add(last)));
	        break;
	    }

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
	  var seg, p3;
	  var ret = [];

	  if ((arguments.length <= 3 ? 0 : arguments.length - 3) === 0) {
	    seg = 15;
	    iteration(1);
	  } else if ((arguments.length <= 3 ? 0 : arguments.length - 3) === 1) {
	    if (typeof (arguments.length <= 3 ? undefined : arguments[3]) === 'number') {
	      seg = arguments.length <= 3 ? undefined : arguments[3];
	      iteration(1);
	    } else {
	      seg = 15;
	      p3 = arguments.length <= 3 ? undefined : arguments[3];
	      iteration(2);
	    }
	  } else if ((arguments.length <= 3 ? 0 : arguments.length - 3) === 2) {
	    p3 = arguments.length <= 3 ? undefined : arguments[3];
	    seg = arguments.length <= 4 ? undefined : arguments[4];
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

/***/ },
/* 6 */
/***/ function(module, exports) {

	// SVGPathSeg API polyfill
	// https://github.com/progers/pathseg
	//
	// This is a drop-in replacement for the SVGPathSeg and SVGPathSegList APIs that were removed from
	// SVG2 (https://lists.w3.org/Archives/Public/www-svg/2015Jun/0044.html), including the latest spec
	// changes which were implemented in Firefox 43 and Chrome 46.

	(function() { "use strict";
	    if (!("SVGPathSeg" in window)) {
	        // Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-InterfaceSVGPathSeg
	        window.SVGPathSeg = function(type, typeAsLetter, owningPathSegList) {
	            this.pathSegType = type;
	            this.pathSegTypeAsLetter = typeAsLetter;
	            this._owningPathSegList = owningPathSegList;
	        }

	        SVGPathSeg.prototype.classname = "SVGPathSeg";

	        SVGPathSeg.PATHSEG_UNKNOWN = 0;
	        SVGPathSeg.PATHSEG_CLOSEPATH = 1;
	        SVGPathSeg.PATHSEG_MOVETO_ABS = 2;
	        SVGPathSeg.PATHSEG_MOVETO_REL = 3;
	        SVGPathSeg.PATHSEG_LINETO_ABS = 4;
	        SVGPathSeg.PATHSEG_LINETO_REL = 5;
	        SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS = 6;
	        SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL = 7;
	        SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS = 8;
	        SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL = 9;
	        SVGPathSeg.PATHSEG_ARC_ABS = 10;
	        SVGPathSeg.PATHSEG_ARC_REL = 11;
	        SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS = 12;
	        SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL = 13;
	        SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS = 14;
	        SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL = 15;
	        SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS = 16;
	        SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL = 17;
	        SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS = 18;
	        SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL = 19;

	        // Notify owning PathSegList on any changes so they can be synchronized back to the path element.
	        SVGPathSeg.prototype._segmentChanged = function() {
	            if (this._owningPathSegList)
	                this._owningPathSegList.segmentChanged(this);
	        }

	        window.SVGPathSegClosePath = function(owningPathSegList) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CLOSEPATH, "z", owningPathSegList);
	        }
	        SVGPathSegClosePath.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegClosePath.prototype.toString = function() { return "[object SVGPathSegClosePath]"; }
	        SVGPathSegClosePath.prototype._asPathString = function() { return this.pathSegTypeAsLetter; }
	        SVGPathSegClosePath.prototype.clone = function() { return new SVGPathSegClosePath(undefined); }

	        window.SVGPathSegMovetoAbs = function(owningPathSegList, x, y) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_MOVETO_ABS, "M", owningPathSegList);
	            this._x = x;
	            this._y = y;
	        }
	        SVGPathSegMovetoAbs.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegMovetoAbs.prototype.toString = function() { return "[object SVGPathSegMovetoAbs]"; }
	        SVGPathSegMovetoAbs.prototype._asPathString = function() { return this.pathSegTypeAsLetter + " " + this._x + " " + this._y; }
	        SVGPathSegMovetoAbs.prototype.clone = function() { return new SVGPathSegMovetoAbs(undefined, this._x, this._y); }
	        Object.defineProperty(SVGPathSegMovetoAbs.prototype, "x", { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegMovetoAbs.prototype, "y", { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });

	        window.SVGPathSegMovetoRel = function(owningPathSegList, x, y) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_MOVETO_REL, "m", owningPathSegList);
	            this._x = x;
	            this._y = y;
	        }
	        SVGPathSegMovetoRel.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegMovetoRel.prototype.toString = function() { return "[object SVGPathSegMovetoRel]"; }
	        SVGPathSegMovetoRel.prototype._asPathString = function() { return this.pathSegTypeAsLetter + " " + this._x + " " + this._y; }
	        SVGPathSegMovetoRel.prototype.clone = function() { return new SVGPathSegMovetoRel(undefined, this._x, this._y); }
	        Object.defineProperty(SVGPathSegMovetoRel.prototype, "x", { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegMovetoRel.prototype, "y", { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });

	        window.SVGPathSegLinetoAbs = function(owningPathSegList, x, y) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_LINETO_ABS, "L", owningPathSegList);
	            this._x = x;
	            this._y = y;
	        }
	        SVGPathSegLinetoAbs.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegLinetoAbs.prototype.toString = function() { return "[object SVGPathSegLinetoAbs]"; }
	        SVGPathSegLinetoAbs.prototype._asPathString = function() { return this.pathSegTypeAsLetter + " " + this._x + " " + this._y; }
	        SVGPathSegLinetoAbs.prototype.clone = function() { return new SVGPathSegLinetoAbs(undefined, this._x, this._y); }
	        Object.defineProperty(SVGPathSegLinetoAbs.prototype, "x", { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegLinetoAbs.prototype, "y", { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });

	        window.SVGPathSegLinetoRel = function(owningPathSegList, x, y) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_LINETO_REL, "l", owningPathSegList);
	            this._x = x;
	            this._y = y;
	        }
	        SVGPathSegLinetoRel.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegLinetoRel.prototype.toString = function() { return "[object SVGPathSegLinetoRel]"; }
	        SVGPathSegLinetoRel.prototype._asPathString = function() { return this.pathSegTypeAsLetter + " " + this._x + " " + this._y; }
	        SVGPathSegLinetoRel.prototype.clone = function() { return new SVGPathSegLinetoRel(undefined, this._x, this._y); }
	        Object.defineProperty(SVGPathSegLinetoRel.prototype, "x", { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegLinetoRel.prototype, "y", { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });

	        window.SVGPathSegCurvetoCubicAbs = function(owningPathSegList, x, y, x1, y1, x2, y2) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS, "C", owningPathSegList);
	            this._x = x;
	            this._y = y;
	            this._x1 = x1;
	            this._y1 = y1;
	            this._x2 = x2;
	            this._y2 = y2;
	        }
	        SVGPathSegCurvetoCubicAbs.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegCurvetoCubicAbs.prototype.toString = function() { return "[object SVGPathSegCurvetoCubicAbs]"; }
	        SVGPathSegCurvetoCubicAbs.prototype._asPathString = function() { return this.pathSegTypeAsLetter + " " + this._x1 + " " + this._y1 + " " + this._x2 + " " + this._y2 + " " + this._x + " " + this._y; }
	        SVGPathSegCurvetoCubicAbs.prototype.clone = function() { return new SVGPathSegCurvetoCubicAbs(undefined, this._x, this._y, this._x1, this._y1, this._x2, this._y2); }
	        Object.defineProperty(SVGPathSegCurvetoCubicAbs.prototype, "x", { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicAbs.prototype, "y", { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicAbs.prototype, "x1", { get: function() { return this._x1; }, set: function(x1) { this._x1 = x1; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicAbs.prototype, "y1", { get: function() { return this._y1; }, set: function(y1) { this._y1 = y1; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicAbs.prototype, "x2", { get: function() { return this._x2; }, set: function(x2) { this._x2 = x2; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicAbs.prototype, "y2", { get: function() { return this._y2; }, set: function(y2) { this._y2 = y2; this._segmentChanged(); }, enumerable: true });

	        window.SVGPathSegCurvetoCubicRel = function(owningPathSegList, x, y, x1, y1, x2, y2) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL, "c", owningPathSegList);
	            this._x = x;
	            this._y = y;
	            this._x1 = x1;
	            this._y1 = y1;
	            this._x2 = x2;
	            this._y2 = y2;
	        }
	        SVGPathSegCurvetoCubicRel.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegCurvetoCubicRel.prototype.toString = function() { return "[object SVGPathSegCurvetoCubicRel]"; }
	        SVGPathSegCurvetoCubicRel.prototype._asPathString = function() { return this.pathSegTypeAsLetter + " " + this._x1 + " " + this._y1 + " " + this._x2 + " " + this._y2 + " " + this._x + " " + this._y; }
	        SVGPathSegCurvetoCubicRel.prototype.clone = function() { return new SVGPathSegCurvetoCubicRel(undefined, this._x, this._y, this._x1, this._y1, this._x2, this._y2); }
	        Object.defineProperty(SVGPathSegCurvetoCubicRel.prototype, "x", { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicRel.prototype, "y", { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicRel.prototype, "x1", { get: function() { return this._x1; }, set: function(x1) { this._x1 = x1; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicRel.prototype, "y1", { get: function() { return this._y1; }, set: function(y1) { this._y1 = y1; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicRel.prototype, "x2", { get: function() { return this._x2; }, set: function(x2) { this._x2 = x2; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicRel.prototype, "y2", { get: function() { return this._y2; }, set: function(y2) { this._y2 = y2; this._segmentChanged(); }, enumerable: true });

	        window.SVGPathSegCurvetoQuadraticAbs = function(owningPathSegList, x, y, x1, y1) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS, "Q", owningPathSegList);
	            this._x = x;
	            this._y = y;
	            this._x1 = x1;
	            this._y1 = y1;
	        }
	        SVGPathSegCurvetoQuadraticAbs.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegCurvetoQuadraticAbs.prototype.toString = function() { return "[object SVGPathSegCurvetoQuadraticAbs]"; }
	        SVGPathSegCurvetoQuadraticAbs.prototype._asPathString = function() { return this.pathSegTypeAsLetter + " " + this._x1 + " " + this._y1 + " " + this._x + " " + this._y; }
	        SVGPathSegCurvetoQuadraticAbs.prototype.clone = function() { return new SVGPathSegCurvetoQuadraticAbs(undefined, this._x, this._y, this._x1, this._y1); }
	        Object.defineProperty(SVGPathSegCurvetoQuadraticAbs.prototype, "x", { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoQuadraticAbs.prototype, "y", { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoQuadraticAbs.prototype, "x1", { get: function() { return this._x1; }, set: function(x1) { this._x1 = x1; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoQuadraticAbs.prototype, "y1", { get: function() { return this._y1; }, set: function(y1) { this._y1 = y1; this._segmentChanged(); }, enumerable: true });

	        window.SVGPathSegCurvetoQuadraticRel = function(owningPathSegList, x, y, x1, y1) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL, "q", owningPathSegList);
	            this._x = x;
	            this._y = y;
	            this._x1 = x1;
	            this._y1 = y1;
	        }
	        SVGPathSegCurvetoQuadraticRel.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegCurvetoQuadraticRel.prototype.toString = function() { return "[object SVGPathSegCurvetoQuadraticRel]"; }
	        SVGPathSegCurvetoQuadraticRel.prototype._asPathString = function() { return this.pathSegTypeAsLetter + " " + this._x1 + " " + this._y1 + " " + this._x + " " + this._y; }
	        SVGPathSegCurvetoQuadraticRel.prototype.clone = function() { return new SVGPathSegCurvetoQuadraticRel(undefined, this._x, this._y, this._x1, this._y1); }
	        Object.defineProperty(SVGPathSegCurvetoQuadraticRel.prototype, "x", { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoQuadraticRel.prototype, "y", { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoQuadraticRel.prototype, "x1", { get: function() { return this._x1; }, set: function(x1) { this._x1 = x1; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoQuadraticRel.prototype, "y1", { get: function() { return this._y1; }, set: function(y1) { this._y1 = y1; this._segmentChanged(); }, enumerable: true });

	        window.SVGPathSegArcAbs = function(owningPathSegList, x, y, r1, r2, angle, largeArcFlag, sweepFlag) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_ARC_ABS, "A", owningPathSegList);
	            this._x = x;
	            this._y = y;
	            this._r1 = r1;
	            this._r2 = r2;
	            this._angle = angle;
	            this._largeArcFlag = largeArcFlag;
	            this._sweepFlag = sweepFlag;
	        }
	        SVGPathSegArcAbs.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegArcAbs.prototype.toString = function() { return "[object SVGPathSegArcAbs]"; }
	        SVGPathSegArcAbs.prototype._asPathString = function() { return this.pathSegTypeAsLetter + " " + this._r1 + " " + this._r2 + " " + this._angle + " " + (this._largeArcFlag ? "1" : "0") + " " + (this._sweepFlag ? "1" : "0") + " " + this._x + " " + this._y; }
	        SVGPathSegArcAbs.prototype.clone = function() { return new SVGPathSegArcAbs(undefined, this._x, this._y, this._r1, this._r2, this._angle, this._largeArcFlag, this._sweepFlag); }
	        Object.defineProperty(SVGPathSegArcAbs.prototype, "x", { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcAbs.prototype, "y", { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcAbs.prototype, "r1", { get: function() { return this._r1; }, set: function(r1) { this._r1 = r1; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcAbs.prototype, "r2", { get: function() { return this._r2; }, set: function(r2) { this._r2 = r2; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcAbs.prototype, "angle", { get: function() { return this._angle; }, set: function(angle) { this._angle = angle; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcAbs.prototype, "largeArcFlag", { get: function() { return this._largeArcFlag; }, set: function(largeArcFlag) { this._largeArcFlag = largeArcFlag; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcAbs.prototype, "sweepFlag", { get: function() { return this._sweepFlag; }, set: function(sweepFlag) { this._sweepFlag = sweepFlag; this._segmentChanged(); }, enumerable: true });

	        window.SVGPathSegArcRel = function(owningPathSegList, x, y, r1, r2, angle, largeArcFlag, sweepFlag) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_ARC_REL, "a", owningPathSegList);
	            this._x = x;
	            this._y = y;
	            this._r1 = r1;
	            this._r2 = r2;
	            this._angle = angle;
	            this._largeArcFlag = largeArcFlag;
	            this._sweepFlag = sweepFlag;
	        }
	        SVGPathSegArcRel.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegArcRel.prototype.toString = function() { return "[object SVGPathSegArcRel]"; }
	        SVGPathSegArcRel.prototype._asPathString = function() { return this.pathSegTypeAsLetter + " " + this._r1 + " " + this._r2 + " " + this._angle + " " + (this._largeArcFlag ? "1" : "0") + " " + (this._sweepFlag ? "1" : "0") + " " + this._x + " " + this._y; }
	        SVGPathSegArcRel.prototype.clone = function() { return new SVGPathSegArcRel(undefined, this._x, this._y, this._r1, this._r2, this._angle, this._largeArcFlag, this._sweepFlag); }
	        Object.defineProperty(SVGPathSegArcRel.prototype, "x", { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcRel.prototype, "y", { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcRel.prototype, "r1", { get: function() { return this._r1; }, set: function(r1) { this._r1 = r1; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcRel.prototype, "r2", { get: function() { return this._r2; }, set: function(r2) { this._r2 = r2; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcRel.prototype, "angle", { get: function() { return this._angle; }, set: function(angle) { this._angle = angle; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcRel.prototype, "largeArcFlag", { get: function() { return this._largeArcFlag; }, set: function(largeArcFlag) { this._largeArcFlag = largeArcFlag; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcRel.prototype, "sweepFlag", { get: function() { return this._sweepFlag; }, set: function(sweepFlag) { this._sweepFlag = sweepFlag; this._segmentChanged(); }, enumerable: true });

	        window.SVGPathSegLinetoHorizontalAbs = function(owningPathSegList, x) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS, "H", owningPathSegList);
	            this._x = x;
	        }
	        SVGPathSegLinetoHorizontalAbs.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegLinetoHorizontalAbs.prototype.toString = function() { return "[object SVGPathSegLinetoHorizontalAbs]"; }
	        SVGPathSegLinetoHorizontalAbs.prototype._asPathString = function() { return this.pathSegTypeAsLetter + " " + this._x; }
	        SVGPathSegLinetoHorizontalAbs.prototype.clone = function() { return new SVGPathSegLinetoHorizontalAbs(undefined, this._x); }
	        Object.defineProperty(SVGPathSegLinetoHorizontalAbs.prototype, "x", { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });

	        window.SVGPathSegLinetoHorizontalRel = function(owningPathSegList, x) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL, "h", owningPathSegList);
	            this._x = x;
	        }
	        SVGPathSegLinetoHorizontalRel.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegLinetoHorizontalRel.prototype.toString = function() { return "[object SVGPathSegLinetoHorizontalRel]"; }
	        SVGPathSegLinetoHorizontalRel.prototype._asPathString = function() { return this.pathSegTypeAsLetter + " " + this._x; }
	        SVGPathSegLinetoHorizontalRel.prototype.clone = function() { return new SVGPathSegLinetoHorizontalRel(undefined, this._x); }
	        Object.defineProperty(SVGPathSegLinetoHorizontalRel.prototype, "x", { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });

	        window.SVGPathSegLinetoVerticalAbs = function(owningPathSegList, y) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS, "V", owningPathSegList);
	            this._y = y;
	        }
	        SVGPathSegLinetoVerticalAbs.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegLinetoVerticalAbs.prototype.toString = function() { return "[object SVGPathSegLinetoVerticalAbs]"; }
	        SVGPathSegLinetoVerticalAbs.prototype._asPathString = function() { return this.pathSegTypeAsLetter + " " + this._y; }
	        SVGPathSegLinetoVerticalAbs.prototype.clone = function() { return new SVGPathSegLinetoVerticalAbs(undefined, this._y); }
	        Object.defineProperty(SVGPathSegLinetoVerticalAbs.prototype, "y", { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });

	        window.SVGPathSegLinetoVerticalRel = function(owningPathSegList, y) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL, "v", owningPathSegList);
	            this._y = y;
	        }
	        SVGPathSegLinetoVerticalRel.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegLinetoVerticalRel.prototype.toString = function() { return "[object SVGPathSegLinetoVerticalRel]"; }
	        SVGPathSegLinetoVerticalRel.prototype._asPathString = function() { return this.pathSegTypeAsLetter + " " + this._y; }
	        SVGPathSegLinetoVerticalRel.prototype.clone = function() { return new SVGPathSegLinetoVerticalRel(undefined, this._y); }
	        Object.defineProperty(SVGPathSegLinetoVerticalRel.prototype, "y", { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });

	        window.SVGPathSegCurvetoCubicSmoothAbs = function(owningPathSegList, x, y, x2, y2) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS, "S", owningPathSegList);
	            this._x = x;
	            this._y = y;
	            this._x2 = x2;
	            this._y2 = y2;
	        }
	        SVGPathSegCurvetoCubicSmoothAbs.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegCurvetoCubicSmoothAbs.prototype.toString = function() { return "[object SVGPathSegCurvetoCubicSmoothAbs]"; }
	        SVGPathSegCurvetoCubicSmoothAbs.prototype._asPathString = function() { return this.pathSegTypeAsLetter + " " + this._x2 + " " + this._y2 + " " + this._x + " " + this._y; }
	        SVGPathSegCurvetoCubicSmoothAbs.prototype.clone = function() { return new SVGPathSegCurvetoCubicSmoothAbs(undefined, this._x, this._y, this._x2, this._y2); }
	        Object.defineProperty(SVGPathSegCurvetoCubicSmoothAbs.prototype, "x", { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicSmoothAbs.prototype, "y", { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicSmoothAbs.prototype, "x2", { get: function() { return this._x2; }, set: function(x2) { this._x2 = x2; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicSmoothAbs.prototype, "y2", { get: function() { return this._y2; }, set: function(y2) { this._y2 = y2; this._segmentChanged(); }, enumerable: true });

	        window.SVGPathSegCurvetoCubicSmoothRel = function(owningPathSegList, x, y, x2, y2) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL, "s", owningPathSegList);
	            this._x = x;
	            this._y = y;
	            this._x2 = x2;
	            this._y2 = y2;
	        }
	        SVGPathSegCurvetoCubicSmoothRel.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegCurvetoCubicSmoothRel.prototype.toString = function() { return "[object SVGPathSegCurvetoCubicSmoothRel]"; }
	        SVGPathSegCurvetoCubicSmoothRel.prototype._asPathString = function() { return this.pathSegTypeAsLetter + " " + this._x2 + " " + this._y2 + " " + this._x + " " + this._y; }
	        SVGPathSegCurvetoCubicSmoothRel.prototype.clone = function() { return new SVGPathSegCurvetoCubicSmoothRel(undefined, this._x, this._y, this._x2, this._y2); }
	        Object.defineProperty(SVGPathSegCurvetoCubicSmoothRel.prototype, "x", { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicSmoothRel.prototype, "y", { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicSmoothRel.prototype, "x2", { get: function() { return this._x2; }, set: function(x2) { this._x2 = x2; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicSmoothRel.prototype, "y2", { get: function() { return this._y2; }, set: function(y2) { this._y2 = y2; this._segmentChanged(); }, enumerable: true });

	        window.SVGPathSegCurvetoQuadraticSmoothAbs = function(owningPathSegList, x, y) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS, "T", owningPathSegList);
	            this._x = x;
	            this._y = y;
	        }
	        SVGPathSegCurvetoQuadraticSmoothAbs.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegCurvetoQuadraticSmoothAbs.prototype.toString = function() { return "[object SVGPathSegCurvetoQuadraticSmoothAbs]"; }
	        SVGPathSegCurvetoQuadraticSmoothAbs.prototype._asPathString = function() { return this.pathSegTypeAsLetter + " " + this._x + " " + this._y; }
	        SVGPathSegCurvetoQuadraticSmoothAbs.prototype.clone = function() { return new SVGPathSegCurvetoQuadraticSmoothAbs(undefined, this._x, this._y); }
	        Object.defineProperty(SVGPathSegCurvetoQuadraticSmoothAbs.prototype, "x", { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoQuadraticSmoothAbs.prototype, "y", { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });

	        window.SVGPathSegCurvetoQuadraticSmoothRel = function(owningPathSegList, x, y) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL, "t", owningPathSegList);
	            this._x = x;
	            this._y = y;
	        }
	        SVGPathSegCurvetoQuadraticSmoothRel.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegCurvetoQuadraticSmoothRel.prototype.toString = function() { return "[object SVGPathSegCurvetoQuadraticSmoothRel]"; }
	        SVGPathSegCurvetoQuadraticSmoothRel.prototype._asPathString = function() { return this.pathSegTypeAsLetter + " " + this._x + " " + this._y; }
	        SVGPathSegCurvetoQuadraticSmoothRel.prototype.clone = function() { return new SVGPathSegCurvetoQuadraticSmoothRel(undefined, this._x, this._y); }
	        Object.defineProperty(SVGPathSegCurvetoQuadraticSmoothRel.prototype, "x", { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoQuadraticSmoothRel.prototype, "y", { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });

	        // Add createSVGPathSeg* functions to SVGPathElement.
	        // Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-InterfaceSVGPathElement.
	        SVGPathElement.prototype.createSVGPathSegClosePath = function() { return new SVGPathSegClosePath(undefined); }
	        SVGPathElement.prototype.createSVGPathSegMovetoAbs = function(x, y) { return new SVGPathSegMovetoAbs(undefined, x, y); }
	        SVGPathElement.prototype.createSVGPathSegMovetoRel = function(x, y) { return new SVGPathSegMovetoRel(undefined, x, y); }
	        SVGPathElement.prototype.createSVGPathSegLinetoAbs = function(x, y) { return new SVGPathSegLinetoAbs(undefined, x, y); }
	        SVGPathElement.prototype.createSVGPathSegLinetoRel = function(x, y) { return new SVGPathSegLinetoRel(undefined, x, y); }
	        SVGPathElement.prototype.createSVGPathSegCurvetoCubicAbs = function(x, y, x1, y1, x2, y2) { return new SVGPathSegCurvetoCubicAbs(undefined, x, y, x1, y1, x2, y2); }
	        SVGPathElement.prototype.createSVGPathSegCurvetoCubicRel = function(x, y, x1, y1, x2, y2) { return new SVGPathSegCurvetoCubicRel(undefined, x, y, x1, y1, x2, y2); }
	        SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticAbs = function(x, y, x1, y1) { return new SVGPathSegCurvetoQuadraticAbs(undefined, x, y, x1, y1); }
	        SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticRel = function(x, y, x1, y1) { return new SVGPathSegCurvetoQuadraticRel(undefined, x, y, x1, y1); }
	        SVGPathElement.prototype.createSVGPathSegArcAbs = function(x, y, r1, r2, angle, largeArcFlag, sweepFlag) { return new SVGPathSegArcAbs(undefined, x, y, r1, r2, angle, largeArcFlag, sweepFlag); }
	        SVGPathElement.prototype.createSVGPathSegArcRel = function(x, y, r1, r2, angle, largeArcFlag, sweepFlag) { return new SVGPathSegArcRel(undefined, x, y, r1, r2, angle, largeArcFlag, sweepFlag); }
	        SVGPathElement.prototype.createSVGPathSegLinetoHorizontalAbs = function(x) { return new SVGPathSegLinetoHorizontalAbs(undefined, x); }
	        SVGPathElement.prototype.createSVGPathSegLinetoHorizontalRel = function(x) { return new SVGPathSegLinetoHorizontalRel(undefined, x); }
	        SVGPathElement.prototype.createSVGPathSegLinetoVerticalAbs = function(y) { return new SVGPathSegLinetoVerticalAbs(undefined, y); }
	        SVGPathElement.prototype.createSVGPathSegLinetoVerticalRel = function(y) { return new SVGPathSegLinetoVerticalRel(undefined, y); }
	        SVGPathElement.prototype.createSVGPathSegCurvetoCubicSmoothAbs = function(x, y, x2, y2) { return new SVGPathSegCurvetoCubicSmoothAbs(undefined, x, y, x2, y2); }
	        SVGPathElement.prototype.createSVGPathSegCurvetoCubicSmoothRel = function(x, y, x2, y2) { return new SVGPathSegCurvetoCubicSmoothRel(undefined, x, y, x2, y2); }
	        SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticSmoothAbs = function(x, y) { return new SVGPathSegCurvetoQuadraticSmoothAbs(undefined, x, y); }
	        SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticSmoothRel = function(x, y) { return new SVGPathSegCurvetoQuadraticSmoothRel(undefined, x, y); }
	    }

	    if (!("SVGPathSegList" in window)) {
	        // Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-InterfaceSVGPathSegList
	        window.SVGPathSegList = function(pathElement) {
	            this._pathElement = pathElement;
	            this._list = this._parsePath(this._pathElement.getAttribute("d"));

	            // Use a MutationObserver to catch changes to the path's "d" attribute.
	            this._mutationObserverConfig = { "attributes": true, "attributeFilter": ["d"] };
	            this._pathElementMutationObserver = new MutationObserver(this._updateListFromPathMutations.bind(this));
	            this._pathElementMutationObserver.observe(this._pathElement, this._mutationObserverConfig);
	        }

	        SVGPathSegList.prototype.classname = "SVGPathSegList";

	        Object.defineProperty(SVGPathSegList.prototype, "numberOfItems", {
	            get: function() {
	                this._checkPathSynchronizedToList();
	                return this._list.length;
	            },
	            enumerable: true
	        });

	        // Add the pathSegList accessors to SVGPathElement.
	        // Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-InterfaceSVGAnimatedPathData
	        Object.defineProperty(SVGPathElement.prototype, "pathSegList", {
	            get: function() {
	                if (!this._pathSegList)
	                    this._pathSegList = new SVGPathSegList(this);
	                return this._pathSegList;
	            },
	            enumerable: true
	        });
	        // FIXME: The following are not implemented and simply return SVGPathElement.pathSegList.
	        Object.defineProperty(SVGPathElement.prototype, "normalizedPathSegList", { get: function() { return this.pathSegList; }, enumerable: true });
	        Object.defineProperty(SVGPathElement.prototype, "animatedPathSegList", { get: function() { return this.pathSegList; }, enumerable: true });
	        Object.defineProperty(SVGPathElement.prototype, "animatedNormalizedPathSegList", { get: function() { return this.pathSegList; }, enumerable: true });

	        // Process any pending mutations to the path element and update the list as needed.
	        // This should be the first call of all public functions and is needed because
	        // MutationObservers are not synchronous so we can have pending asynchronous mutations.
	        SVGPathSegList.prototype._checkPathSynchronizedToList = function() {
	            this._updateListFromPathMutations(this._pathElementMutationObserver.takeRecords());
	        }

	        SVGPathSegList.prototype._updateListFromPathMutations = function(mutationRecords) {
	            if (!this._pathElement)
	                return;
	            var hasPathMutations = false;
	            mutationRecords.forEach(function(record) {
	                if (record.attributeName == "d")
	                    hasPathMutations = true;
	            });
	            if (hasPathMutations)
	                this._list = this._parsePath(this._pathElement.getAttribute("d"));
	        }

	        // Serialize the list and update the path's 'd' attribute.
	        SVGPathSegList.prototype._writeListToPath = function() {
	            this._pathElementMutationObserver.disconnect();
	            this._pathElement.setAttribute("d", SVGPathSegList._pathSegArrayAsString(this._list));
	            this._pathElementMutationObserver.observe(this._pathElement, this._mutationObserverConfig);
	        }

	        // When a path segment changes the list needs to be synchronized back to the path element.
	        SVGPathSegList.prototype.segmentChanged = function(pathSeg) {
	            this._writeListToPath();
	        }

	        SVGPathSegList.prototype.clear = function() {
	            this._checkPathSynchronizedToList();

	            this._list.forEach(function(pathSeg) {
	                pathSeg._owningPathSegList = null;
	            });
	            this._list = [];
	            this._writeListToPath();
	        }

	        SVGPathSegList.prototype.initialize = function(newItem) {
	            this._checkPathSynchronizedToList();

	            this._list = [newItem];
	            newItem._owningPathSegList = this;
	            this._writeListToPath();
	            return newItem;
	        }

	        SVGPathSegList.prototype._checkValidIndex = function(index) {
	            if (isNaN(index) || index < 0 || index >= this.numberOfItems)
	                throw "INDEX_SIZE_ERR";
	        }

	        SVGPathSegList.prototype.getItem = function(index) {
	            this._checkPathSynchronizedToList();

	            this._checkValidIndex(index);
	            return this._list[index];
	        }

	        SVGPathSegList.prototype.insertItemBefore = function(newItem, index) {
	            this._checkPathSynchronizedToList();

	            // Spec: If the index is greater than or equal to numberOfItems, then the new item is appended to the end of the list.
	            if (index > this.numberOfItems)
	                index = this.numberOfItems;
	            if (newItem._owningPathSegList) {
	                // SVG2 spec says to make a copy.
	                newItem = newItem.clone();
	            }
	            this._list.splice(index, 0, newItem);
	            newItem._owningPathSegList = this;
	            this._writeListToPath();
	            return newItem;
	        }

	        SVGPathSegList.prototype.replaceItem = function(newItem, index) {
	            this._checkPathSynchronizedToList();

	            if (newItem._owningPathSegList) {
	                // SVG2 spec says to make a copy.
	                newItem = newItem.clone();
	            }
	            this._checkValidIndex(index);
	            this._list[index] = newItem;
	            newItem._owningPathSegList = this;
	            this._writeListToPath();
	            return newItem;
	        }

	        SVGPathSegList.prototype.removeItem = function(index) {
	            this._checkPathSynchronizedToList();

	            this._checkValidIndex(index);
	            var item = this._list[index];
	            this._list.splice(index, 1);
	            this._writeListToPath();
	            return item;
	        }

	        SVGPathSegList.prototype.appendItem = function(newItem) {
	            this._checkPathSynchronizedToList();

	            if (newItem._owningPathSegList) {
	                // SVG2 spec says to make a copy.
	                newItem = newItem.clone();
	            }
	            this._list.push(newItem);
	            newItem._owningPathSegList = this;
	            // TODO: Optimize this to just append to the existing attribute.
	            this._writeListToPath();
	            return newItem;
	        }

	        SVGPathSegList._pathSegArrayAsString = function(pathSegArray) {
	            var string = "";
	            var first = true;
	            pathSegArray.forEach(function(pathSeg) {
	                if (first) {
	                    first = false;
	                    string += pathSeg._asPathString();
	                } else {
	                    string += " " + pathSeg._asPathString();
	                }
	            });
	            return string;
	        }

	        // This closely follows SVGPathParser::parsePath from Source/core/svg/SVGPathParser.cpp.
	        SVGPathSegList.prototype._parsePath = function(string) {
	            if (!string || string.length == 0)
	                return [];

	            var owningPathSegList = this;

	            var Builder = function() {
	                this.pathSegList = [];
	            }

	            Builder.prototype.appendSegment = function(pathSeg) {
	                this.pathSegList.push(pathSeg);
	            }

	            var Source = function(string) {
	                this._string = string;
	                this._currentIndex = 0;
	                this._endIndex = this._string.length;
	                this._previousCommand = SVGPathSeg.PATHSEG_UNKNOWN;

	                this._skipOptionalSpaces();
	            }

	            Source.prototype._isCurrentSpace = function() {
	                var character = this._string[this._currentIndex];
	                return character <= " " && (character == " " || character == "\n" || character == "\t" || character == "\r" || character == "\f");
	            }

	            Source.prototype._skipOptionalSpaces = function() {
	                while (this._currentIndex < this._endIndex && this._isCurrentSpace())
	                    this._currentIndex++;
	                return this._currentIndex < this._endIndex;
	            }

	            Source.prototype._skipOptionalSpacesOrDelimiter = function() {
	                if (this._currentIndex < this._endIndex && !this._isCurrentSpace() && this._string.charAt(this._currentIndex) != ",")
	                    return false;
	                if (this._skipOptionalSpaces()) {
	                    if (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) == ",") {
	                        this._currentIndex++;
	                        this._skipOptionalSpaces();
	                    }
	                }
	                return this._currentIndex < this._endIndex;
	            }

	            Source.prototype.hasMoreData = function() {
	                return this._currentIndex < this._endIndex;
	            }

	            Source.prototype.peekSegmentType = function() {
	                var lookahead = this._string[this._currentIndex];
	                return this._pathSegTypeFromChar(lookahead);
	            }

	            Source.prototype._pathSegTypeFromChar = function(lookahead) {
	                switch (lookahead) {
	                case "Z":
	                case "z":
	                    return SVGPathSeg.PATHSEG_CLOSEPATH;
	                case "M":
	                    return SVGPathSeg.PATHSEG_MOVETO_ABS;
	                case "m":
	                    return SVGPathSeg.PATHSEG_MOVETO_REL;
	                case "L":
	                    return SVGPathSeg.PATHSEG_LINETO_ABS;
	                case "l":
	                    return SVGPathSeg.PATHSEG_LINETO_REL;
	                case "C":
	                    return SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS;
	                case "c":
	                    return SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL;
	                case "Q":
	                    return SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS;
	                case "q":
	                    return SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL;
	                case "A":
	                    return SVGPathSeg.PATHSEG_ARC_ABS;
	                case "a":
	                    return SVGPathSeg.PATHSEG_ARC_REL;
	                case "H":
	                    return SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS;
	                case "h":
	                    return SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL;
	                case "V":
	                    return SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS;
	                case "v":
	                    return SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL;
	                case "S":
	                    return SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS;
	                case "s":
	                    return SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL;
	                case "T":
	                    return SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS;
	                case "t":
	                    return SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL;
	                default:
	                    return SVGPathSeg.PATHSEG_UNKNOWN;
	                }
	            }

	            Source.prototype._nextCommandHelper = function(lookahead, previousCommand) {
	                // Check for remaining coordinates in the current command.
	                if ((lookahead == "+" || lookahead == "-" || lookahead == "." || (lookahead >= "0" && lookahead <= "9")) && previousCommand != SVGPathSeg.PATHSEG_CLOSEPATH) {
	                    if (previousCommand == SVGPathSeg.PATHSEG_MOVETO_ABS)
	                        return SVGPathSeg.PATHSEG_LINETO_ABS;
	                    if (previousCommand == SVGPathSeg.PATHSEG_MOVETO_REL)
	                        return SVGPathSeg.PATHSEG_LINETO_REL;
	                    return previousCommand;
	                }
	                return SVGPathSeg.PATHSEG_UNKNOWN;
	            }

	            Source.prototype.initialCommandIsMoveTo = function() {
	                // If the path is empty it is still valid, so return true.
	                if (!this.hasMoreData())
	                    return true;
	                var command = this.peekSegmentType();
	                // Path must start with moveTo.
	                return command == SVGPathSeg.PATHSEG_MOVETO_ABS || command == SVGPathSeg.PATHSEG_MOVETO_REL;
	            }

	            // Parse a number from an SVG path. This very closely follows genericParseNumber(...) from Source/core/svg/SVGParserUtilities.cpp.
	            // Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-PathDataBNF
	            Source.prototype._parseNumber = function() {
	                var exponent = 0;
	                var integer = 0;
	                var frac = 1;
	                var decimal = 0;
	                var sign = 1;
	                var expsign = 1;

	                var startIndex = this._currentIndex;

	                this._skipOptionalSpaces();

	                // Read the sign.
	                if (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) == "+")
	                    this._currentIndex++;
	                else if (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) == "-") {
	                    this._currentIndex++;
	                    sign = -1;
	                }

	                if (this._currentIndex == this._endIndex || ((this._string.charAt(this._currentIndex) < "0" || this._string.charAt(this._currentIndex) > "9") && this._string.charAt(this._currentIndex) != "."))
	                    // The first character of a number must be one of [0-9+-.].
	                    return undefined;

	                // Read the integer part, build right-to-left.
	                var startIntPartIndex = this._currentIndex;
	                while (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) >= "0" && this._string.charAt(this._currentIndex) <= "9")
	                    this._currentIndex++; // Advance to first non-digit.

	                if (this._currentIndex != startIntPartIndex) {
	                    var scanIntPartIndex = this._currentIndex - 1;
	                    var multiplier = 1;
	                    while (scanIntPartIndex >= startIntPartIndex) {
	                        integer += multiplier * (this._string.charAt(scanIntPartIndex--) - "0");
	                        multiplier *= 10;
	                    }
	                }

	                // Read the decimals.
	                if (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) == ".") {
	                    this._currentIndex++;

	                    // There must be a least one digit following the .
	                    if (this._currentIndex >= this._endIndex || this._string.charAt(this._currentIndex) < "0" || this._string.charAt(this._currentIndex) > "9")
	                        return undefined;
	                    while (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) >= "0" && this._string.charAt(this._currentIndex) <= "9")
	                        decimal += (this._string.charAt(this._currentIndex++) - "0") * (frac *= 0.1);
	                }

	                // Read the exponent part.
	                if (this._currentIndex != startIndex && this._currentIndex + 1 < this._endIndex && (this._string.charAt(this._currentIndex) == "e" || this._string.charAt(this._currentIndex) == "E") && (this._string.charAt(this._currentIndex + 1) != "x" && this._string.charAt(this._currentIndex + 1) != "m")) {
	                    this._currentIndex++;

	                    // Read the sign of the exponent.
	                    if (this._string.charAt(this._currentIndex) == "+") {
	                        this._currentIndex++;
	                    } else if (this._string.charAt(this._currentIndex) == "-") {
	                        this._currentIndex++;
	                        expsign = -1;
	                    }

	                    // There must be an exponent.
	                    if (this._currentIndex >= this._endIndex || this._string.charAt(this._currentIndex) < "0" || this._string.charAt(this._currentIndex) > "9")
	                        return undefined;

	                    while (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) >= "0" && this._string.charAt(this._currentIndex) <= "9") {
	                        exponent *= 10;
	                        exponent += (this._string.charAt(this._currentIndex) - "0");
	                        this._currentIndex++;
	                    }
	                }

	                var number = integer + decimal;
	                number *= sign;

	                if (exponent)
	                    number *= Math.pow(10, expsign * exponent);

	                if (startIndex == this._currentIndex)
	                    return undefined;

	                this._skipOptionalSpacesOrDelimiter();

	                return number;
	            }

	            Source.prototype._parseArcFlag = function() {
	                if (this._currentIndex >= this._endIndex)
	                    return undefined;
	                var flag = false;
	                var flagChar = this._string.charAt(this._currentIndex++);
	                if (flagChar == "0")
	                    flag = false;
	                else if (flagChar == "1")
	                    flag = true;
	                else
	                    return undefined;

	                this._skipOptionalSpacesOrDelimiter();
	                return flag;
	            }

	            Source.prototype.parseSegment = function() {
	                var lookahead = this._string[this._currentIndex];
	                var command = this._pathSegTypeFromChar(lookahead);
	                if (command == SVGPathSeg.PATHSEG_UNKNOWN) {
	                    // Possibly an implicit command. Not allowed if this is the first command.
	                    if (this._previousCommand == SVGPathSeg.PATHSEG_UNKNOWN)
	                        return null;
	                    command = this._nextCommandHelper(lookahead, this._previousCommand);
	                    if (command == SVGPathSeg.PATHSEG_UNKNOWN)
	                        return null;
	                } else {
	                    this._currentIndex++;
	                }

	                this._previousCommand = command;

	                switch (command) {
	                case SVGPathSeg.PATHSEG_MOVETO_REL:
	                    return new SVGPathSegMovetoRel(owningPathSegList, this._parseNumber(), this._parseNumber());
	                case SVGPathSeg.PATHSEG_MOVETO_ABS:
	                    return new SVGPathSegMovetoAbs(owningPathSegList, this._parseNumber(), this._parseNumber());
	                case SVGPathSeg.PATHSEG_LINETO_REL:
	                    return new SVGPathSegLinetoRel(owningPathSegList, this._parseNumber(), this._parseNumber());
	                case SVGPathSeg.PATHSEG_LINETO_ABS:
	                    return new SVGPathSegLinetoAbs(owningPathSegList, this._parseNumber(), this._parseNumber());
	                case SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL:
	                    return new SVGPathSegLinetoHorizontalRel(owningPathSegList, this._parseNumber());
	                case SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS:
	                    return new SVGPathSegLinetoHorizontalAbs(owningPathSegList, this._parseNumber());
	                case SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL:
	                    return new SVGPathSegLinetoVerticalRel(owningPathSegList, this._parseNumber());
	                case SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS:
	                    return new SVGPathSegLinetoVerticalAbs(owningPathSegList, this._parseNumber());
	                case SVGPathSeg.PATHSEG_CLOSEPATH:
	                    this._skipOptionalSpaces();
	                    return new SVGPathSegClosePath(owningPathSegList);
	                case SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL:
	                    var points = {x1: this._parseNumber(), y1: this._parseNumber(), x2: this._parseNumber(), y2: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber()};
	                    return new SVGPathSegCurvetoCubicRel(owningPathSegList, points.x, points.y, points.x1, points.y1, points.x2, points.y2);
	                case SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS:
	                    var points = {x1: this._parseNumber(), y1: this._parseNumber(), x2: this._parseNumber(), y2: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber()};
	                    return new SVGPathSegCurvetoCubicAbs(owningPathSegList, points.x, points.y, points.x1, points.y1, points.x2, points.y2);
	                case SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL:
	                    var points = {x2: this._parseNumber(), y2: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber()};
	                    return new SVGPathSegCurvetoCubicSmoothRel(owningPathSegList, points.x, points.y, points.x2, points.y2);
	                case SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS:
	                    var points = {x2: this._parseNumber(), y2: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber()};
	                    return new SVGPathSegCurvetoCubicSmoothAbs(owningPathSegList, points.x, points.y, points.x2, points.y2);
	                case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL:
	                    var points = {x1: this._parseNumber(), y1: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber()};
	                    return new SVGPathSegCurvetoQuadraticRel(owningPathSegList, points.x, points.y, points.x1, points.y1);
	                case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS:
	                    var points = {x1: this._parseNumber(), y1: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber()};
	                    return new SVGPathSegCurvetoQuadraticAbs(owningPathSegList, points.x, points.y, points.x1, points.y1);
	                case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL:
	                    return new SVGPathSegCurvetoQuadraticSmoothRel(owningPathSegList, this._parseNumber(), this._parseNumber());
	                case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS:
	                    return new SVGPathSegCurvetoQuadraticSmoothAbs(owningPathSegList, this._parseNumber(), this._parseNumber());
	                case SVGPathSeg.PATHSEG_ARC_REL:
	                    var points = {x1: this._parseNumber(), y1: this._parseNumber(), arcAngle: this._parseNumber(), arcLarge: this._parseArcFlag(), arcSweep: this._parseArcFlag(), x: this._parseNumber(), y: this._parseNumber()};
	                    return new SVGPathSegArcRel(owningPathSegList, points.x, points.y, points.x1, points.y1, points.arcAngle, points.arcLarge, points.arcSweep);
	                case SVGPathSeg.PATHSEG_ARC_ABS:
	                    var points = {x1: this._parseNumber(), y1: this._parseNumber(), arcAngle: this._parseNumber(), arcLarge: this._parseArcFlag(), arcSweep: this._parseArcFlag(), x: this._parseNumber(), y: this._parseNumber()};
	                    return new SVGPathSegArcAbs(owningPathSegList, points.x, points.y, points.x1, points.y1, points.arcAngle, points.arcLarge, points.arcSweep);
	                default:
	                    throw "Unknown path seg type."
	                }
	            }

	            var builder = new Builder();
	            var source = new Source(string);

	            if (!source.initialCommandIsMoveTo())
	                return [];
	            while (source.hasMoreData()) {
	                var pathSeg = source.parseSegment();
	                if (!pathSeg)
	                    return [];
	                builder.appendSegment(pathSeg);
	            }

	            return builder.pathSegList;
	        }
	    }
	}());


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.rotate = rotate;
	// rotate an array to left
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

/***/ }
/******/ ]);
//# sourceMappingURL=morph.js.map