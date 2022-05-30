import c from "./canvas"

import Life from "../combat/Life"
import Cooldown from "../combat/Cooldown"

const player = {
	x: 200,
	y: 200,

	life: new Life(99, 5, 5),

	cooldowns: {
		damage: new Cooldown(0, 600, "#ff0000")
	},

	keyPressed: {
		left : false,
		right: false,
		up   : false,
		down : false,
		shift: false
	},

	dodge() {
		console.log("Rolling")
	},

	// Used as both onkeydown and onkeyup (specify with inputType)
	// Sets this.keyPressed accordingly according to keys pressed and released
	handleKey(inputType: string, input: string) {
		if (inputType == "keydown" && input == "KeyZ") {
			this.dodge()
			return
		}

		let keys = {
			"ArrowLeft" : "left",
			"ArrowRight": "right",
			"ArrowUp"   : "up",
			"ArrowDown" : "down",
			"ShiftLeft" : "shift"
		}

		let key = keys[input]
		if (key) this.keyPressed[key] = inputType == "keydown"
	},

	move(mode: "fixed" | "overworld", collisions) {
		let speed = this.keyPressed.shift ? 4 : 8

		if (this.keyPressed.left ) this.x -= speed
		if (this.keyPressed.right) this.x += speed
		if (this.keyPressed.up   ) this.y -= speed
		if (this.keyPressed.down ) this.y += speed

		// Correct collisions

		for (const collision of collisions) {
			let colX = collision.x
			let colY = collision.y

			// We can't check for overworld once at the start because we would
			// have to modify the collisions array (or a copy), both of which
			// change it for perinthus.ts. I'm guessing that
			// Object.assign([], myArray) is even slower than this, though.

			// Correct for overworld display shifting
			if (mode == "overworld") {
				// 637.5 = canvas width / 2 - player width / 2
				// 337.5 = canvas height / 2 - player width / 2

				colX -= 637.5
				colY -= 337.5
			}

			if (this.x + 50 > colX &&
				this.x < colX + collision.width &&
				this.y + 50 > colY &&
				this.y < colY + collision.height) {

				// The way we correct the position depends on how the player collided

				// We have to make sure that the previous value did NOT satisfy
				// the collision so that we know how to handle it - otherwise we
				// might see "the player pressed left and up, and now they've collided"
				// and won't know which one it was

				if (this.keyPressed.left &&
					this.x + speed >= colX + collision.width)
					this.x = colX + collision.width

				if (this.keyPressed.right &&
					this.x - speed + 50 <= colX)
					this.x = colX - 50

				if (this.keyPressed.up &&
					this.y + speed >= colY + collision.height)
					this.y = colY + collision.height

				if (this.keyPressed.down &&
					this.y - speed + 50 <= colY)
					this.y = colY - 50
			}
		}
	},

	draw(mode: "fixed" | "overworld") {
		c.fillStyle = "blue"

		if (mode == "fixed")
			c.frect(this.x, this.y, 50, 50)

		else {
			// We want to draw it centered:
			// 637.5 = canvas width / 2 - player width / 2
			// 337.5 = canvas height / 2 - player width / 2

			c.frect(637.5, 337.5, 50, 50)
		}
	},

	receiveDamage() {
		if (this.cooldowns.damage.counter > 0) return

		this.life.hit()
		this.cooldowns.damage.start()
	},

	drawCooldowns() {
		this.cooldowns.damage.draw()
	},

	progressCooldowns(time: number) {
		let cooldowns = ["damage"]
		for (const cooldown of cooldowns) {
			this.cooldowns[cooldown].progress(time)
		}
	}
}

// Custom cooldown animations
let damage = player.cooldowns.damage
damage.getY = (counter: number) => 725 - counter
damage.progress = (time: number) => {
	// We need it to decrease by 725 in 0.5s
	// So, that's (725/0.5)/1000 = 1.45 per millisecond

	if (!damage.lastFrame) {
		damage.lastFrame = time
		return
	}

	let diff = time - damage.lastFrame
	damage.counter -= diff * 1.45

	damage.lastFrame = time
}

export default player
