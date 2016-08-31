
var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d')
canvas.width = 1000
canvas.height = 600

// console.log(ctx);


//ctx.fillRect(89,50,400,300);

var {pow, abs, cos, PI, sin} = Math
var origin = {
	x: 500,
	y: 200
}

function superFormula(angle, m, n1, n2, n3) {

	var deg = m * angle / 4
	var a = 1, b = 1
	var cor1 = pow(abs(cos(deg) / a), n2)
	var cor2 = pow(abs(sin(deg) / b), n3)

	return pow(cor1 + cor2, - 1/n1)
}

function morph(a, b, pc, diameter) {
	var i = -1,
		x, y, r, deg, t = 0,
		points = []

	while (++ i < 300) {
		deg = i / 300 * 2 * PI
		a.r = superFormula(deg, a.m, a.n1, a.n2, a.n3)
		b.r = superFormula(deg, b.m, b.n1, b.n2, b.n3)

		r = ((b.r - a.r) * pc + a.r)

		t = Math.max(r, t)

		points.push({r, deg})
	}

	ctx.fillStyle = '#eee'
	ctx.beginPath()
	points.forEach(function(p) {
		r = diameter / t * p.r
		x = r * cos(p.deg)
		y = r * sin(p.deg)
		ctx.lineTo(x + origin.x, y + origin.y)
	})
	ctx.closePath()
	ctx.fill()
}

function clear() {
	ctx.fillStyle = "#fff"
	ctx.fillRect(0, 0, canvas.width, canvas.height)
}

var a = {
	m: 2,
	n1: 2,
	n2: 2,
	n3: 2
}
var b = {
	m: 4,
	n1: 4,
	n2: 7,
	n3: 8
}
var last = Date.now()

function animate() {

	var dur = 500
	var elapse = Date.now() - last

	var pc = elapse / dur
	if (elapse > dur) {
		pc = 1
	}

	clear()
	morph(a, b, pc, 100)

	elapse <= dur && requestAnimationFrame(animate)
}
