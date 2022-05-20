import c from "./canvas"

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

	move(collisions) {
		let speed = 8

		if (this.keyPressed.left) this.x -= speed
		if (this.keyPressed.right) this.x += speed
		if (this.keyPressed.up) this.y -= speed
		if (this.keyPressed.down) this.y += speed

		// Correct collisions

		for (const collision of collisions) {
			if (this.x + this.size > collision.x &&
				this.x < collision.x + collision.width &&
				this.y + this.size > collision.y &&
				this.y < collision.y + collision.height) {

				// The way we correct the position depends on how the player collided

				// We have to make sure that the previous value did NOT satisfy
				// the collision so that we know how to handle it - otherwise we
				// might see "the player pressed left and up, and now they've collided"
				// and won't know which one it was

				if (this.keyPressed.left &&
					this.x + speed >= collision.x + collision.width)
					this.x = collision.x + collision.width

				if (this.keyPressed.right &&
					this.x - speed + this.size <= collision.x)
					this.x = collision.x - this.size

				if (this.keyPressed.up &&
					this.y + speed >= collision.y + collision.height)
					this.y = collision.y + collision.height

				if (this.keyPressed.down &&
					this.y - speed + this.size <= collision.y)
					this.y = collision.y - this.size
			}
		}
	},

	draw() {
		c.fillStyle = "blue"
		c.frect(this.x, this.y, this.size, this.size)
	}
}

export default player
