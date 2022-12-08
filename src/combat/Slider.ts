import Enemy from "../combat/Enemy"
import { RNG } from "../game/functions"

class Slider extends Enemy {
	cx: number

	constructor(y: number) {
		super(-100, y, [0, 0], 0, "#111", "#eee")
		this.counter = RNG(10, 15) * 2
		this.cx = RNG(1, 3)/2
	}

	move() {
		this.x += this.cx
	}
}

export default Slider
