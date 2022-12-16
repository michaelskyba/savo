import Enemy from "../combat/Enemy"
import { RNG } from "../util/functions"

class Slider extends Enemy {
	cx: number

	constructor(y: number) {
		super(-100, y, [0, 0], 0, "#111", "#eee")
		this.counter = RNG(10, 15) * 2
		this.initSpeed(1)
	}

	initSpeed(direction: number) {
		this.cx = RNG(1, 3) * direction
	}

	move() {
		this.x += this.cx

		if (this.cx > 0 && this.x > 1250) {
			this.x = 1250
			this.initSpeed(-1)
		}
		if (this.cx < 0 && this.x < 25) {
			this.x = 25
			this.initSpeed(1)
		}
	}
}

export default Slider
