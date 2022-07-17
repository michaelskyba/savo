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
	angle = 270
	radius = 200

	origin = {
		x: 993.75,
		y: 337.5
	}
	glideValues = {
		x: 0,
		y: 0,
		cy: 0,
		cx: 0
	}

	status = "glide"
	dir = "up"

	constructor() {
		super(993.75, 337.5, [0, 0], 99, "#eee", "#111")

		this.counter = 63
		// this.radius = RNG(100, 250)
		this.radius = 200

		this.genGlide()
	}

	constraints() {
		// Don't move through walls
		if (this.x > 1250) this.x = 1250
		if (this.y > 650) this.y = 650
		if (this.x < 25) this.x = 25
		if (this.y < 25) this.y = 25
	}

	genGlide() {
		let x = this.origin.x

		// If we're going up, the glide point should start above
		// Otherwise, it should start below
		let offset = this.radius * (this.dir == "up" ? -1 : 1)
		let y = this.origin.y + offset

		let cx = (x - this.x) / 100
		let cy = (y - this.y) / 100

		this.glideValues = {
			x: x,
			y: y,
			cx: cx,
			cy: cy
		}
	}

	glide() {
		while (this.elapsed[0] > threshold) {
			this.elapsed[0] -= threshold

			const glide = this.glideValues
			this.x += glide.cx
			this.y += glide.cy

			if (this.x == glide.x && this.y == glide.y)
				this.status = "circle"
		}
	}

	circle() {
		while (this.elapsed[0] > threshold) {
			this.elapsed[0] -= threshold
			this.angle++

			// if (this.angle == 90 && this.dir == "down")
				// this.glideInit()

			if (this.angle > 360) this.angle = this.angle % 360
			let radian = Math.round(this.angle) * Math.PI / 180

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
}

const augustus = new Augustus()
export default augustus
