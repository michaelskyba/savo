import Enemy from "./Enemy"
import c from "../game/canvas"

class Frontinus extends Enemy {
	elapsed = 0
	lastFrame: number

	counter = 5
	status = "countdown"

	constructor() {
		super(400, 300)
	}

	collision(playerX: number, playerY: number): boolean {
		if (this.counter != 0) return false

		return super.collision(playerX, playerY)
	}

	move(time: number) {
		if (!this.lastFrame) {
			this.lastFrame = time
		}
		this.elapsed += time - this.lastFrame

		// Counting down to the next attack
		if (this.status == "countdown") {
			let threshold = 500

			while (this.elapsed > threshold) {
				this.counter--
				this.elapsed -= threshold

				if (this.counter == 0) {
					this.status = "attack"
					this.elapsed = 0
				}
			}
		}

		// Executing the attack
		else {
		}

		this.lastFrame = time
	}

	draw() {
		// 25 = enemy size / 2 (so the sword starts in the center)
		if (this.status == "attack")
			this.sword.draw(this.x + 25, this.y + 25)

		c.fillStyle = "coral"
		c.frect(this.x, this.y, 50, 50)

		let fontSize = 40
		c.font = fontSize + "px monospace"
		c.fillStyle = "white"

		let text = (this.counter < 10 ? "0" : "") + this.counter
		c.text(text, this.x, this.y + fontSize)
	}
}

export default Frontinus
