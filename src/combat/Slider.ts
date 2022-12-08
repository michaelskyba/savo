import Enemy from "../combat/Enemy"
import { RNG } from "../game/functions"

class Slider extends Enemy {
	cx: number

	constructor(x: number, y: number, dir: string) {
		super(x, y, [0, 0], 0, "#111", "#eee")
		this.counter = RNG(10, 15) * 2

		this.cx = dir == "right" ? 1 : -1
	}

	move() {
		this.x += this.cx
	}
}

export default Slider
