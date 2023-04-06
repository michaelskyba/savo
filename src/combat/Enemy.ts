import c from "../game/canvas"

import Sword from "./Sword"
import Life from "./Life"

import player from "../game/player"

class Enemy {
	x: number
	y: number

	bgColour: string
	fgColour: string

	lastFrame: number
	counter: number
	status = "countdown"
	elapsed: number[]

	sword: Sword

	life: Life

	constructor(x: number, y: number, elapsed: number[], HP: number, bgColour: string, fgColour) {
		this.sword = new Sword(200, 0, bgColour)

		this.x = x
		this.y = y

		// Different indices can contain different timers, which is why we use
		// an array of numbers instead of just one
		this.elapsed = elapsed

		this.bgColour = bgColour
		this.fgColour = fgColour

		// canvas width - textbox width (~88) - padding (5)
		this.life = new Life(HP, c.w - 88 - 5, 5)
	}

	// The Enemy itself is overlapping Claudia
	bodyCollision(playerX: number, playerY: number): boolean {
		return (this.x + c.s > playerX &&
			this.y + c.s > playerY &&
			playerX + c.s > this.x &&
			playerY + c.s > this.y)
	}

	swordCollision(playerX: number, playerY: number) {
		// The enemy only attacks when its attack counter is at zero
		if (this.counter != 0)
			return false

		return this.sword.collision(this.x + c.s/2, this.y + c.s/2, playerX, playerY)
	}

	collision(playerX: number, playerY: number): boolean {
		if (this.bodyCollision(playerX, playerY))
			return true

		return this.swordCollision(playerX, playerY)
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

	startSwing() {
		this.status = "attack"

		// Math.atan2 gets the angle to the point from the origin.
		// Since our origin is frontinus's (x, y), we need to
		// subtract each from the player's corresponding value.
		// https://stackoverflow.com/a/28227643

		let x = player.x - this.x
		let y = player.y - this.y
		let angle = Math.atan2(y, x) * 180 / Math.PI

		this.sword.angle = angle
		this.sword.rotate(-90)
	}

	draw() {
		c.fillStyle = this.bgColour

		// + (enemy size / 2) so that the sword starts in the center
		if (this.status == "attack")
			this.sword.draw(this.x + c.s/2, this.y + c.s/2)

		c.frect(this.x, this.y, c.s, c.s)

		// Drawing the attack counter
		let fontSize = 40
		c.font = fontSize + "px monospace"
		c.fillStyle = this.fgColour

		let text = (this.counter < 10 ? "0" : "") + this.counter
		c.text(text, this.x, this.y + fontSize)
	}
}

export default Enemy
