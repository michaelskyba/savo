import c from "./canvas"

const player = {
	x: 200,
	y: 200,
	size: 50,

	keyPressed: {
		up: false,
		right: false,
		left: false,
		down: false
	},

	// Used as both onkeydown and onkeyup (specify with inputType)
	// Sets this.keyPressed accordingly according to keys pressed and released
	handleKey(inputType: string, event: KeyboardEvent) {
		let keys = {
			"up": "ArrowUp",
			"right": "ArrowRight",
			"left": "ArrowLeft",
			"down": "ArrowDown"
		}

		// Iterate over keys (as in key-value) of keys (the variable, as in keyboard)
		// dir = e.g. "up"
		for (const dir in keys) {
			if (event.code == keys[dir])
				this.keyPressed[dir] = inputType == "keydown"
		}

		console.log(this.keyPressed)
	},

	draw() {
		c.fillStyle = "#2c8898"
		c.frect(this.x, this.y, this.size, this.size)
	}
}

export default player
