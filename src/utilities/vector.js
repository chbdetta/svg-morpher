class Vector {
	constructor(x = 0, y = 0) {
		if (x instanceof Vector || (x.x && x.y)) {
			this.x = x.x
			this.y = x.y
		} else {
			this.x = x
			this.y = y
		}
	}
	add(vec) {
		return new Vector(this.x + vec.x, this.y + vec.y)
	}
	sub(vec) {
		return new Vector(this.x - vec.x, this.y - vec.y)
	}
	dist(len) {
		if (typeof len !== 'undefined') {
			let ratio = len / this.dist()
			return this.scalar(ratio)
		} else
			return Math.sqrt(this.x * this.x + this.y * this.y)
	}
	scalar(n) {
		return new Vector(this.x * n, this.y * n)
	}
	isParallel(vec) {
		return (vec.x === 0 && vec.y === 0)
				|| (this.x === 0 &&  this.y === 0)
				|| (vec.y / vec.x) === (this.y / this.x)
				|| (this.y === 0 && vec.y === 0 && this.x === vec.x)
	}
}

export default Vector
