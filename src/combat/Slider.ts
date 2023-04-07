import Enemy from "../combat/Enemy"
import c from "../game/canvas"
import { RNG } from "../util/functions"

// Wall width inside augustusRoom
const w = 25

/*
elapsed {
	0: timer for x movement
	1: timer for y movement
	2: timer for countdown (attack counter manipulation)
}
*/

class Slider extends Enemy {
	counterThreshold: number
	direction: {x: number, y: number}
	travelTime: {x: number, y: number}

	// Buffer for elapsed[0] and elapsed[1]
	buffer: {x: number, y: number}

	constructor(x: number, y: number, direction: {x: number, y: number}) {
		super(x, y, [0, 0, 0], 0, "#8db255", "#111")

		this.travelTime = {x: 0, y: 0}
		this.buffer = {x: 0, y: 0}

		this.direction = direction
		this.initSpeed("x")
		this.initSpeed("y")
		this.initCounter()
	}

	initCounter() {
		this.counter = RNG(10, 15) * 2
		this.counterThreshold = RNG(200, 400)
	}

	initSpeed(direction) {
		if (this.direction[direction] == 0)
			return

		let time
		if (direction == "x")
			time = RNG(2000, 4000)
		else
			time = RNG(1000, 2000)

		this.travelTime[direction] = time
	}

	attackCounter() {
		if (this.elapsed[2] > this.counterThreshold) {
			this.counter -= 1
			this.elapsed[2] = 0

			if (this.counter == 0) {
				this.startSwing()

				this.buffer.x = this.elapsed[0]
				this.buffer.y = this.elapsed[1]
			}
		}
	}

	attack(time: number) {
		// We want a 180 degree rotation in 200ms, which means 180/200 = 0.9
		// degrees per millisecond
		this.sword.rotate((time - this.lastFrame) * 0.9)

		if (this.elapsed[2] > 200) {
			// Reset to old, pre-attack values
			this.status = "countdown"

			this.elapsed[0] = this.buffer.x
			this.elapsed[1] = this.buffer.y

			this.elapsed[2] = 0
			this.initCounter()
		}
	}

	moveX() {
		const direction = this.direction.x
		if (direction == 0) return

		let progress = this.elapsed[0] / this.travelTime.x
		if (direction == -1)
			progress = 1 - progress

		this.x = (c.w - 2*w - c.s) * progress + w

		const rightThreshold = c.w - w - c.s
		if (direction == 1 && this.x >= rightThreshold) {
			this.x = rightThreshold
			this.direction.x = -1

			this.initSpeed("x")
			this.elapsed[0] = 0
		}

		const leftThreshold = w
		if (direction == -1 && this.x <= leftThreshold) {
			this.x = leftThreshold
			this.direction.x = 1

			this.initSpeed("x")
			this.elapsed[0] = 0
		}
	}

	moveY() {
		const direction = this.direction.y
		if (direction == 0) return

		let progress = this.elapsed[1] / this.travelTime.y
		if (direction == -1)
			progress = 1 - progress

		this.y = (c.h - 2*w - c.s) * progress + w

		const topThreshold = c.h - w - c.s
		if (direction == 1 && this.y > topThreshold) {
			this.y = topThreshold
			this.direction.y = -1

			this.initSpeed("y")
			this.elapsed[1] = 0
		}

		const bottomThreshold = w
		if (direction == -1 && this.y < bottomThreshold) {
			this.y = bottomThreshold
			this.direction.y = 1

			this.initSpeed("y")
			this.elapsed[1] = 0
		}
	}

	countdown() {
		this.moveX()
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
