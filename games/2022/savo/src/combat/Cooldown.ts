import c from "../game/canvas"

class Cooldown {
	x: number
	width: number
	colour: string

	lastFrame: number
	counter = 0

	constructor(x: number, width: number, colour: string) {
		this.x = x
		this.width = width
		this.colour = colour
	}

	start() {
		this.lastFrame = 0
		this.counter = 725
	}

	getY = (counter: number) => 0

	progress(time: number) {
		this.counter--
	}

	draw() {
		if (this.counter < 1) return

		c.globalAlpha = 0.2
		c.fillStyle = this.colour

		c.frect(this.x, this.getY(this.counter), this.width, this.counter)

		c.globalAlpha = 1
	}
}

export default Cooldown
