import c from "../game/canvas"
import Sword from "./Sword"

import Life from "./Life"

class Enemy {
	x: number
	y: number

	lastFrame: number
	counter: number
	status = "countdown"
	elapsed: number[]

	sword: Sword

	life: Life
	colour: string

	constructor(x: number, y: number, elapsed: number[], HP: number, colour: string) {
		this.x = x
		this.y = y

		// Different indices can contain different timers, which is why we use
		// an array of numbers instead of just one
		this.elapsed = elapsed

		this.colour = colour
		this.sword = new Sword(200, 0, colour)

		// 1232 = canvas width - textbox width (~88) - padding (5)
		this.life = new Life(HP, 1232, 5)
	}

	collision(playerX: number, playerY: number): boolean {
		// The enemy only attacks when its attack counter is at zero
		if (this.counter != 0) return false

		return this.sword.collision(this.x + 25, this.y + 25, playerX, playerY)
	}

	receiveDamage() {
		this.life.hit()

		// Enemies don't need to heal
		this.life.threatened = false
	}

	// Count the time
	timer(status: "start" | "end", time: number) {
		if (status == "start") {
			if (!this.lastFrame)
				this.lastFrame = time

			// Add to each elapsed value
			let change = time - this.lastFrame
			this.elapsed = this.elapsed.map(x => x + change)
		}

		// The movement loop is over
		else this.lastFrame = time
	}

	move(time: number) {
		// For now, let's say that we want one full rotation per minute
		// That's 360 per minute --> 360 per 60 s --> 6 per s
		// Time is given in ms, so we want 6 * ((ms - last frame) / 1000)

		if (this.lastFrame == null) {
			this.lastFrame = time
			return
		}

		let diff = time - this.lastFrame
		let move = 6 * diff / 1000
		this.lastFrame = time

		this.sword.rotate(move)
	}

	draw() {
		c.fillStyle = this.colour

		// 25 = enemy size / 2 (so the sword starts in the center)
		if (this.status == "attack")
			this.sword.draw(this.x + 25, this.y + 25)

		c.frect(this.x, this.y, 50, 50)

		// Drawing the attack counter
		let fontSize = 40
		c.font = fontSize + "px monospace"
		c.fillStyle = "white"

		let text = (this.counter < 10 ? "0" : "") + this.counter
		c.text(text, this.x, this.y + fontSize)
	}
}

export default Enemy
