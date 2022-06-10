import Enemy from "../combat/Enemy"

class Nero extends Enemy {
	constructor() {
		super(637.5, 445, 50, "maroon")
		this.counter = 5
	}
}

export default Nero
