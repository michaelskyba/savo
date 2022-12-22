import Enemy from "../combat/Enemy"
import c from "../game/canvas"
import { RNG } from "../util/functions"

// Wall width inside augustusRoom
const w = 25

/*
elapsed {
	0: timer for movement (x,y manipulation)
	1: timer for countdown (attack counter manipulation)
}
*/

class Slider extends Enemy {
	travelTime: number
	counterThreshold: number
	direction: string

	// Buffer for elapsed[0]
	buffer: number

	constructor(y: number) {
		super(-100, y, [0, 0], 0, "#8db255", "#111")
		this.initCounter()
		this.initSpeed(1)
		this.direction = "right"
	}

	initCounter() {
		this.counter = RNG(10, 15) * 2
		this.counterThreshold = RNG(200, 400)
	}

	initSpeed(direction: number) {
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

	countdown() {
		let progress = this.elapsed[0] / this.travelTime
		this.x = (c.w - 2*w) * progress

		if (this.direction == "right" && this.x > c.w - w - c.s) {
			this.x = c.w - w - c.s
			this.initSpeed(-1)
			this.elapsed[0] = 0
		}

		if (this.direction == "left" && this.x < w) {
			this.x = w
			this.initSpeed(1)
			this.elapsed[0] = 0
		}

		this.attackCounter()
	}

	move(time: number) {
		this.timer("start", time)
		this[this.status](time)
		this.timer("end", time)
	}
}

export default Slider
