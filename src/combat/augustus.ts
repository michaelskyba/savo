import c from "../game/canvas"
import Enemy from "./Enemy"
import Slider from "./Slider"

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

	sliders = [
		new Slider(-100, 50, "right")
	]

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

	buffer = {
		status: "",
		elapsed: 0
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
		let radius = RNG(100, 300)

		// We just twisted clockwise and are now at the bottom of the previous
		// origin point. So, we're moving to the left.
		if (this.angle.change == 1) {
			this.origin = {
				x: RNG(25 + radius, this.x - radius),
				y: RNG(25 + radius, 650 - radius)
			}

			this.dir = "left"
		}

		// We just twisted counterclockwise and are now at the bottom of the
		// previous origin point. So, we're moving to the right.
		else {
			this.origin = {
				x: RNG(this.x + radius, 1250 - radius),
				y: RNG(25 + radius, 650 - radius)
			}

			this.dir = "right"
		}

		this.radius = radius
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

	attackCounter() {
		if (this.elapsed[1] > 350) {
			this.counter -= 1
			this.elapsed[1] = 0

			if (this.counter == 0) {
				this.buffer.status = this.status
				this.buffer.elapsed = this.elapsed[0]
				this.startSwing()
			}
		}
	}

	attack(time: number) {
		// We want a 180 degree rotation in 500ms, which means 180/500 = 0.36
		// degrees per millisecond
		this.sword.rotate((time - this.lastFrame) * 0.36)

		if (this.elapsed[1] > 500) {
			// Reset to old, pre-attack values
			this.status = this.buffer.status
			this.elapsed[0] = this.buffer.elapsed
			this.elapsed[1] = 0
			this.counter = 63
		}
	}

	move(time: number) {
		this.timer("start", time)

		this[this.status](time) // circle(), glide(), etc.

		if (this.status != "attack")
			this.attackCounter()

		this.timer("end", time)

		this.sliders[0].move()
	}

	collision(playerX: number, playerY: number): boolean {
		// Augustus is physically overlapping Claudia
		if (this.x + 50 > playerX &&
			this.y + 50 > playerY &&
			playerX + 50 > this.x &&
			playerY + 50 > this.y) return true

		return super.collision(playerX, playerY)
	}

	draw() {
		super.draw()

		// Show origin
		c.beginPath()
		c.lineWidth = 2
		c.rect(this.origin.x, this.origin.y, 50, 50)
		c.strokeStyle = "#eee"
		c.stroke()

		this.sliders[0].draw()
	}
}

const augustus = new Augustus()
export default augustus
