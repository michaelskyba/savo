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
	cx: number

	constructor(y: number) {
		super(-100, y, [0, 0], 0, "#8db255", "#111")
		this.counter = RNG(10, 15) * 2
		this.initSpeed(1)
	}

	initSpeed(direction: number) {
		this.cx = RNG(1, 3) * direction
	}

	attackCounter() {
		if (this.elapsed[1] > 350) {
			this.counter -= 1
			this.elapsed[1] = 0

			if (this.counter == 0)
				this.startSwing()
		}
	}

	attack(time: number) {
		// We want a 180 degree rotation in 200ms, which means 180/200 = 0.9
		// degrees per millisecond
		this.sword.rotate((time - this.lastFrame) * 0.9)

		if (this.elapsed[1] > 200) {
			// Reset to old, pre-attack values
			this.status = "countdown"
			this.elapsed[0] = 500
			this.elapsed[1] = 0
			this.counter = 20
		}
	}

	countdown() {
		this.x += this.cx

		if (this.cx > 0 && this.x > c.w - w - c.s) {
			this.x = c.w - w - c.s
			this.initSpeed(-1)
		}

		if (this.cx < 0 && this.x < w) {
			this.x = w
			this.initSpeed(1)
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
