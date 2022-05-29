import Enemy from "./Enemy"

class Frontinus extends Enemy {
	constructor() {
		super(400, 300)
		this.counter = 5
	}

	draw() {
		this.render()
	}
}

export default Frontinus
