import Vector from './vector';

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

	var i = 0, j = 0, flag = true;

	while(ret.length < targetLength) {
		if (i >= points.length) {
			insert(i);
			i = 0;
			points = ret;
			ret = [];
			flag = true;
		}

		if (j >= distance || flag) {
			ret.push(points[i]);
			i ++;
			flag = !flag;
		} else {
			insert(i);
		}
	}

	function insert(i) {
		let p = points[i % points.length].add(points[i - 1]).scalar(0.5);
		ret.push(p);
		j ++;
		flag = !flag;
	}

	console.log('end interpolate', ret);

	return ret;
}

export default interpolate;
export function match(pointsA, pointsB) {
	if (pointsA.length < pointsB.length) {
		return [interpolate(pointsA, pointsB.length), pointsB];
	} else {
		return [pointsA, interpolate(pointsB, pointsA.length)];
	}
}