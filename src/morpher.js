import {analyze} from './analyzers/svg-analyzer';
import Vector from "./utilities/vector";
import {rotate} from './utilities/rotate';

var svgNamespace = 'http://www.w3.org/2000/svg';

function defineProp(obj, prop, value) {
	obj['_' + prop] = value;
	Object.defineProperty(obj, prop, {
		get: function() {
			return value;
		},
		set: function(val) {
			this['_' + prop] = val;
		}
	});
}

class Morpher {
	constructor(node) {
		if (typeof node === 'undefined') {
			return false;
		}

		this.node = node.cloneNode();
		this.node.setAttribute('id', `_Morph_${~~(Math.random() * 10000)}`);

		this._points = [];
	}

	/**
	 * analyze the svg element and squeeze out the point list
	 * @param  {Element} node svg element
	 * @param  {Integer} seg  the segment for curve separation
	 * @return {Object}       abstract information
	 */
	analyze() {
		// analyze the points using specific analyzer
		return analyze(this.node);
	}

	setPoints(points) {
		var left, right, top, bottom;
		var me = this;

		points.forEach(function(val, index) {
			right = right !== undefined ? (val.x <= points[right].x ? right : index) : index;
			left = left !== undefined? (val.x >= points[left].x ? left : index) : index;
			top = top !== undefined? (val.y <= points[top].y ? top : index) : index;
			bottom = bottom !== undefined ? (val.y >= points[bottom].y ? bottom : index) : index;
		});

		this['left'] = points[left];
		this['right'] = points[right];
		this['top'] = points[top];
		this['bottom'] = points[bottom];
		this['center'] = new Vector((this.right.x + this.left.x) / 2, (this.top.y + this.bottom.y) / 2) ;
		this['geometry'] = this._geometry = this.center;

		// make sure points are odered in  clockwise
		if ((top - left + points.length) % points.length < (bottom - left + points.length) % points.length) {
			console.log('reverse');
			points.reverse();
		}

		// and rearrange them putting the start point at left most
		// to make the transition look more reasonable
		rotate(points, -points.indexOf(this.left));

		// recalculate the points according to the geometry
		this.points = this._points = points.map(function(val,index) {
			return val.sub(me.geometry);
		});

		console.log(left, top, right, bottom);
	}

	fadeTo(n) {
		this.node.style.visibility = 'visible';
		this.node.style.opacity = n;
	}

	apply() {
		var d = '';
		var me = this;

		// for efficiency purpose, we delay adding geometry here
		d = this._points.reduce(function(prev, cur, index) {
			var vec = cur.add(me._geometry);

			if (index === 0 ) {
				return prev + `M ${vec.x} ${vec.y}`;
			} else {
				return prev + `L ${vec.x} ${vec.y}`;
			}

		}, d);

		d += 'Z';

		this.node.setAttribute('d', d);
	}

	translate(vec) {
		this._geometry = this.geometry.add(vec);
	}

	morph(dvec) {
		this._points = this.points.map(function(val, index) {
			return val.add(dvec[index]);
		});
	}
}

export default Morpher;