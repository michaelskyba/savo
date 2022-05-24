import c from "../canvas"

const player = {
	x: 200,
	y: 200,
	size: 50,

	keyPressed: {
		left: false,
		right: false,
		up: false,
		down: false
	},

	// Used as both onkeydown and onkeyup (specify with inputType)
	// Sets this.keyPressed accordingly according to keys pressed and released
	handleKey(inputType: string, key: string) {
		let keys = {
			"ArrowLeft": "left",
			"ArrowRight": "right",
			"ArrowUp": "up",
			"ArrowDown": "down"
		}

		let dir = keys[key]
		if (dir) this.keyPressed[dir] = inputType == "keydown"
	},

	move(mode: "fixed" | "overworld", collisions) {
		let speed = 8

		if (this.keyPressed.left) this.x -= speed
		if (this.keyPressed.right) this.x += speed
		if (this.keyPressed.up) this.y -= speed
		if (this.keyPressed.down) this.y += speed

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
				colX -= 662.25 - 25
				colY -= 362.25 - 25
			}

			if (this.x + this.size > colX &&
				this.x < colX + collision.width &&
				this.y + this.size > colY &&
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
					this.x - speed + this.size <= colX)
					this.x = colX - this.size

				if (this.keyPressed.up &&
					this.y + speed >= colY + collision.height)
					this.y = colY + collision.height

				if (this.keyPressed.down &&
					this.y - speed + this.size <= colY)
					this.y = colY - this.size
			}
		}
	},

	draw(mode: "fixed" | "overworld") {
		c.fillStyle = "blue"

		if (mode == "fixed")
			c.frect(this.x, this.y, this.size, this.size)

		else {
			let split = this.size / 2
			c.frect(662.5 - split, 362.5 - split, this.size, this.size)
		}
	}
}

export default player
