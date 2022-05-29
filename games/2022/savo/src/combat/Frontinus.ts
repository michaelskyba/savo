import Enemy from "./Enemy"
import c from "../game/canvas"

class Frontinus extends Enemy {
	constructor() {
		super(400, 300)
		this.counter = 68
	}

	draw() {
		c.fillStyle = "coral"
		c.frect(this.x, this.y, 50, 50)

		// 25 = enemy size / 2 (so the sword starts in the center)
		if (this.counter == 0)
			this.sword.draw(this.x + 25, this.y + 25)

		let fontSize = 40
		c.font = fontSize+ "px monospace"
		c.fillStyle = "white"

		let text = (this.counter < 10 ? "0" : "") + this.counter
		c.text(text, this.x, this.y + fontSize)
	}
}

export default Frontinus
