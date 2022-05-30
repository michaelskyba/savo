import c from "../game/canvas"

class Cooldown {
	x: number
	width: number
	colour: string

	counter = 0

	constructor(x: number, width: number, colour: string) {
		this.x = x
		this.width = width
		this.colour = colour
	}

	start() {
		this.counter = 725
	}

	getY = (counter: number) => 0

	progress() {
		this.counter--
	}

	draw() {
		if (this.counter < 1) return

		c.globalAlpha = 0.2
		c.fillStyle = this.colour

		c.frect(this.x, this.getY(this.counter), this.width, this.counter)

		c.globalAlpha = 1

		this.progress()
	}
}

export default Cooldown
