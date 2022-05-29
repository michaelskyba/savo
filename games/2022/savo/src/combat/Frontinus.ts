import Enemy from "./Enemy"
import c from "../game/canvas"

class Frontinus extends Enemy {
	constructor() {
		super(400, 300)
		this.counter = 68
	}

	draw() {
		this.render()

		let fontSize = 40
		c.font = fontSize+ "px monospace"
		c.fillStyle = "white"

		let text = (this.counter < 10 ? "0" : "") + this.counter
		c.text(text, this.x, this.y + fontSize)
	}
}

export default Frontinus
