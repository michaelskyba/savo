import Enemy from "./Enemy"
import c from "../game/canvas"

import player from "../game/player"

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

					// From what I understand, tan(θ) = y/x from the origin
					// Since our origin is frontinus's (x, y), we need to
					// subtract each from the player's corresponding value

					let x = player.x - this.x
					let y = player.y - this.y
					let angle = Math.atan(y/x) * 180 / Math.PI

					console.log(angle)

					this.sword.angle = angle
					this.sword.rotate(-90)

					console.log(this.sword.angle)
				}
			}
		}

		// Executing the attack
		else {
			// We want a 180 degree rotation in 200ms, which means 180/200 = 0.9
			// degrees per millisecond
			this.sword.rotate((time - this.lastFrame) * 0.9)

			// It's done after 200 ms
			if (this.elapsed > 200) {
				this.status = "countdown"
				this.counter = 5
				this.elapsed = 0
			}
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
