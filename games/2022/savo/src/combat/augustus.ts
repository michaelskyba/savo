import c from "../game/canvas"
import Enemy from "../combat/Enemy"

class Augustus extends Enemy {
	constructor() {
		super(993.75, 337.5, [], 100, "#eee", "#111")
		this.counter = 63
	}

	move() {
		this.x -= 5
	}
}

const augustus = new Augustus()
export default augustus
