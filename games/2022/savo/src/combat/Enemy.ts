import c from "../game/canvas"
import Sword from "./Sword"

import Life from "./Life"

class Enemy {
	x: number
	y: number

	lastFrame: number
	counter: number
	sword: Sword

	life: Life
	colour: string

	constructor(x: number, y: number, HP: number, colour: string) {
		this.x = x
		this.y = y

		this.colour = colour

		this.sword = new Sword(200, 0, colour)

		// 1232 = canvas width - textbox width (~88) - padding (5)
		this.life = new Life(HP, 1232, 5)
	}

	collision(playerX: number, playerY: number): boolean {
		return this.sword.collision(this.x + 25, this.y + 25, playerX, playerY)
	}

	receiveDamage() {
		this.life.hit()

		// Enemies don't need to heal
		this.life.threatened = false
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
		this.sword.draw(this.x + 25, this.y + 25)

		c.frect(this.x, this.y, 50, 50)
	}
}

export default Enemy
