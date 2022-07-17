import c from "../game/canvas"
import Enemy from "../combat/Enemy"

const RNG = (min, max) => {
	return Math.round(Math.random() * (max - min)) + min
}

// Move every 100 ms
const threshold = 16.66

/*
elapsed {
	0: timer for movement (x,y manipulation)
	1: timer for countdown (attack counter manipulation)
}

status
	"circle" = moving in a circle
	"glide" = moving in a straight line towards the next rotation origin
	"attacking" = swinging sword

Times
	19, 37, 54.5, 1:12
*/

class Augustus extends Enemy {
	angle = {
		degrees: 0,
		change: 0
	}

	// Radius of rotation circle
	radius = 200

	origin = {
		x: 993.75,
		y: 337.5
	}
	glideValues = {
		x: [0, 1],
		y: [0, 1],
		cy: 0,
		cx: 0
	}

	status = "glide"
	dir = "right"

	constructor() {
		super(993.75, 337.5, [0, 0], 99, "#eee", "#111")

		this.counter = 63
		this.radius = RNG(100, 250)

		this.genGlide()
	}

	constraints() {
		// Don't move through walls
		if (this.x > 1250) this.x = 1250
		if (this.y > 650) this.y = 650
		if (this.x < 25) this.x = 25
		if (this.y < 25) this.y = 25
	}

	// Generate the gliding destination and appropriate (x,y) movement speed
	genGlide() {
		let x = this.origin.x
		let y = this.origin.y - this.radius

		let cx = (x - this.x) / 100
		let cy = (y - this.y) / 100

		this.glideValues = {
			// We use a small range instead of literal this.x == glideValue.x
			// because JavaScript messes up arithmetic with decimals
			x: [x - Math.abs(cx), x + Math.abs(cx)],
			y: [y - Math.abs(cy), y + Math.abs(cy)],
			cx: cx,
			cy: cy
		}
	}

	// Decide on a radius and origin point
	glideInit() {
		this.status = "glide"

		// We just twisted clockwise and are now at the bottom of the previous
		// origin point. So, we're moving to the left.
		if (this.angle.change == 1) {
			let radius = RNG(100, 300)

			this.origin = {
				x: RNG(25 + radius, this.x - radius),
				y: RNG(25 + radius, 650 - radius)
			}

			this.dir = "left"
		}

		// We just twisted counterclockwise and are now at the bottom of the
		// previous origin point. So, we're moving to the right.
		else {
			let radius = RNG(100, 300)

			this.origin = {
				x: RNG(this.x + radius, 1250 - radius),
				y: RNG(25 + radius, 650 - radius)
			}

			this.dir = "right"
		}

		this.genGlide()
	}

	glide() {
		while (this.elapsed[0] > threshold) {
			this.elapsed[0] -= threshold

			const glide = this.glideValues
			this.x += glide.cx
			this.y += glide.cy

			if (this.x >= glide.x[0] &&
				this.x <= glide.x[1] &&
				this.y >= glide.y[0] &&
				this.y <= glide.y[1]) this.circleInit()

			this.constraints()
		}
	}

	circleInit() {
		this.status = "circle"
		this.angle.degrees = 270

		if (this.dir == "right") {
			this.angle.change = 1
			this.dir = "left"
		}

		else {
			this.angle.change = -1
			this.dir = "right"
		}
	}

	circle() {
		while (this.elapsed[0] > threshold) {
			this.elapsed[0] -= threshold
			this.angle.degrees += this.angle.change

			// We've rotated to the bottom of the circle
			if (this.angle.degrees == 90) {
				this.glideInit()
				return
			}

			if (this.angle.degrees > 360) this.angle.degrees = this.angle.degrees % 360
			let radian = Math.round(this.angle.degrees) * Math.PI / 180

			this.x = this.origin.x + this.radius * Math.cos(radian)
			this.y = this.origin.y + this.radius * Math.sin(radian)

			this.constraints()
		}
	}

	move(time: number) {
		this.timer("start", time)

		// circle(), glide(), etc.
		this[this.status]()

		this.timer("end", time)
	}

	draw() {
		super.draw()

		// Show origin
		c.beginPath()
		c.rect(this.origin.x, this.origin.y, 50, 50)
		c.strokeStyle = "#eee"
		c.stroke()
	}
}

const augustus = new Augustus()
export default augustus
