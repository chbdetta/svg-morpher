import {analyze} from './analyzers/svg-analyzer';
import Vector from "./utilities/vector";
import {rotate} from './utilities/rotate';

var svgNamespace = 'http://www.w3.org/2000/svg';

class Morpher {
	constructor(node) {
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

		this.node.setAttribute('id', `_Morph_${~~(Math.random() * 10000)}`);
	}

	/**
	 * analyze the svg element and squeeze out the point list
	 * @param  {Element} node svg element
	 * @param  {Integer} seg  the segment for curve separation
	 * @return {Object}       abstract information
	 */
	analyze() {
		var points,
			left, right, top, bottom;
		var me = this;

		// analyze the points using specific analyzer
		points = analyze(this.node);

		points.forEach(function(val, index) {
			right = right !== undefined ? (val.x <= points[right].x ? right : index) : index;
			left = left !== undefined? (val.x >= points[left].x ? left : index) : index;
			top = top !== undefined? (val.y <= points[top].y ? top : index) : index;
			bottom = bottom !== undefined ? (val.y >= points[bottom].y ? bottom : index) : index;
		});

		this.left = points[left];
		this.right = points[right];
		this.top = points[top];
		this.bottom = points[bottom];
		this.center = new Vector((this.right.x + this.left.x) / 2, (this.top.y + this.bottom.y) / 2);
		this.geometry = this.center;

		console.log(left, top, right, bottom);

		// make sure points are odered in  clockwise
		if ((top - left + points.length) % points.length < (bottom - left + points.length) % points.length) {
			console.log('reverse');
			points.reverse();
		}

		// and rearrange them putting the start point at left most
		rotate(points, -points.indexOf(this.left));

		// recalculate the points according to the geometry
		points.forEach(function(val,index) {
			var vec = val.sub(me.geometry);
			points[index].x = vec.x;
			points[index].y = vec.y;
		});

		// console.log(points);

		this.points = points;
	}
}

export default Morpher;