import Vector from '../utilities/vector';

const REGX_PATH_SEPARATOR = /\B(?=[A-z])|\b(?=[A-z])|\s(?=[A-z])/;
const REGX_CARRIER = /[\n\r]/g;
const REGX_PAHT_NUMBER = /[+\-]*\s*[0-9\.]+/g;

<<<<<<< HEAD
export function analyze(node) {
=======
export function attributeAnalyzer(node) {
>>>>>>> 05a8dc40b4e93769dca0a4d67c1d3a94fa7b5752
	var d = node.getAttribute('d');
	d = d.replace(REGX_CARRIER, '').trim();
	d = d.split(REGX_PATH_SEPARATOR);

	var last,
		points = [];

	d.forEach(function(val) {
		var op = val.match(/[A-z]+/)[0];
		var num = val.match(REGX_PAHT_NUMBER);

		if (num === null) {
			return;
		}

		num.forEach(function(val, index) {
			num[index] = parseFloat(val);
		});

		var ret;

		switch(op) {
			case 'M':
			case 'L':
				ret = new Vector(num[0], num[1]);
				break;
			case 'H':
				ret = new Vector(num[0], last.y);
				break;
			case 'V':
				ret = new Vector(last.x, num[0]);
				break;
			case 'm':
			case 'l':
				ret = last.add(new Vector(num[0], num[1]));
				break;
			case 'h':
				ret = last.add(new Vector(num[0], 0));
				break;
			case 'v':
				ret = last.add(new Vector(0, num[0]));
				break;
		}

		last = ret;


		if (ret) {
			points.push(ret);
		}
	});

	return points;
}

function bezierCurve() {

}