import Enemy from "../combat/Enemy"
import c from "../game/canvas"
import { RNG } from "../util/functions"

// Wall width inside augustusRoom
const w = 25

/*
elapsed {
	0: timer for xy movement
	1: timer for countdown (attack counter manipulation)
}

phase
	0: moving right
	1: moving down
	2: moving left
	3: moving up
*/

class Slider extends Enemy {
	counterThreshold: number
	travelTime: number
	phase = 0

	// Buffer for elapsed[0]
	buffer: number

	constructor(x: number, y: number, phase: number) {
		super(x, y, [0, 0], 0, "#8db255", "#111")

		this.phase = phase
		this.initSpeed()
		this.initCounter()
	}

	initCounter() {
		this.counter = RNG(10, 15) * 2
		this.counterThreshold = RNG(200, 400)
	}

	initSpeed() {
		// Horizontal
		if (this.phase == 0 || this.phase == 2)
			this.travelTime = RNG(4000, 8000)

		// Vertical
		else
			this.travelTime = RNG(2000, 4000)
	}

	attackCounter() {
		if (this.elapsed[1] > this.counterThreshold) {
			this.counter -= 1
			this.elapsed[1] = 0

			if (this.counter == 0) {
				this.startSwing()
				this.buffer = this.elapsed[0]
			}
		}
	}

	attack(time: number) {
		// We want a 180 degree rotation in 200ms, which means 180/200 = 0.9
		// degrees per millisecond
		this.sword.rotate((time - this.lastFrame) * 0.9)

		if (this.elapsed[1] > 200) {
			// Reset to old, pre-attack values
			this.status = "countdown"

			this.elapsed[0] = this.buffer
			this.elapsed[1] = 0
			this.initCounter()
		}
	}

	moveX() {
		let progress = this.elapsed[0] / this.travelTime
		if (this.phase == 2)
			progress = 1 - progress

		this.x = (c.w - 2*w - c.s) * progress + w

		const rightThreshold = c.w - w - c.s
		if (this.phase == 0 && this.x >= rightThreshold) {
			this.x = rightThreshold
			this.phase = 1

			this.initSpeed()
			this.elapsed[0] = 0
		}

		const leftThreshold = w
		if (this.phase == 2 && this.x <= leftThreshold) {
			this.x = leftThreshold
			this.phase = 3

			this.initSpeed()
			this.elapsed[0] = 0
		}
	}

	moveY() {
		let progress = this.elapsed[0] / this.travelTime
		if (this.phase == 3)
			progress = 1 - progress

		this.y = (c.h - 2*w - c.s) * progress + w
		console.log(progress)

		const topThreshold = c.h - w - c.s
		if (this.phase == 1 && this.y > topThreshold) {
			this.y = topThreshold
			this.phase = 2

			this.initSpeed()
			this.elapsed[0] = 0
		}

		const bottomThreshold = w
		if (this.phase == 3 && this.y < bottomThreshold) {
			this.y = bottomThreshold
			this.phase = 0

			this.initSpeed()
			this.elapsed[0] = 0
		}
	}

	countdown() {
		if (this.phase == 0 || this.phase == 2)
			this.moveX()
		else
			this.moveY()

		this.attackCounter()
	}

	move(time: number) {
		this.timer("start", time)

		// attack() or countdown()
		this[this.status](time)

		this.timer("end", time)
	}
}

export default Slider
