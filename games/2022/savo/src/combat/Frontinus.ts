import Enemy from "./Enemy"
import c from "../game/canvas"

class Frontinus extends Enemy {
	elapsed = 0
	lastFrame: number

	counter = 60

	constructor() {
		super(400, 300)
	}

	move(time: number) {
		if (this.lastFrame == null) {
			console.log(this.lastFrame)
			this.lastFrame = time
		}

		this.elapsed += time - this.lastFrame

		while (this.elapsed > 1000) {
			if (this.counter > 0) this.counter--
			this.elapsed -= 1000
		}

		this.lastFrame = time
	}

	draw() {
		// 25 = enemy size / 2 (so the sword starts in the center)
		if (this.counter == 0)
			this.sword.draw(this.x + 25, this.y + 25)

		c.fillStyle = "coral"
		c.frect(this.x, this.y, 50, 50)

		let fontSize = 40
		c.font = fontSize+ "px monospace"
		c.fillStyle = "white"

		let text = (this.counter < 10 ? "0" : "") + this.counter
		c.text(text, this.x, this.y + fontSize)
	}
}

export default Frontinus
